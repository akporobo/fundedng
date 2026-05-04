import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendKycApprovedEmail } from "@/lib/email.server";

const VerifyInput = z.object({
  userId: z.string().uuid(),
  accountNumber: z.string().regex(/^\d{10}$/, "Account number must be 10 digits"),
  accessToken: z.string().min(1),
});

/**
 * Admin-only: verify a trader's KYC bank account.
 * Succeeds only when:
 *  - The caller is an admin
 *  - The submitted account number matches what the trader saved on their profile
 *  - The trader actually owns at least one trader_account (i.e., they exist as a trader)
 */
export const verifyKycServer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => VerifyInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const { data: authData, error: authErr } = await supabaseAdmin.auth.getUser(data.accessToken);
      if (authErr || !authData.user) return { ok: false, error: "Please sign in again" };
      const callerId = authData.user.id;

      // 1. Caller must be admin
      const { data: roles, error: roleErr } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", callerId);
      if (roleErr) return { ok: false, error: roleErr.message };
      if (!roles?.some((r) => r.role === "admin")) {
        return { ok: false, error: "Forbidden: admin role required" };
      }

      // 2. Load target trader profile + their trader accounts
      const [profileRes, accountsRes] = await Promise.all([
        supabaseAdmin
          .from("profiles")
          .select("id, bank_account_number, bank_name, bank_account_name")
          .eq("id", data.userId)
          .maybeSingle(),
        supabaseAdmin
          .from("trader_accounts")
          .select("id")
          .eq("user_id", data.userId)
          .limit(1),
      ]);

      if (profileRes.error) return { ok: false, error: profileRes.error.message };
      if (accountsRes.error) return { ok: false, error: accountsRes.error.message };

      const profile = profileRes.data;
      if (!profile) return { ok: false, error: "Trader profile not found" };
      if (!profile.bank_account_number) {
        return { ok: false, error: "Trader has not submitted bank account details" };
      }
      if (!accountsRes.data?.length) {
        return { ok: false, error: "Trader has no trader_accounts on record" };
      }

      const submitted = data.accountNumber.trim();
      const onFile = (profile.bank_account_number || "").trim();
      if (submitted !== onFile) {
        return { ok: false, error: "Account number does not match the trader's records" };
      }

      // 4. Mark verified
      const { error: updErr } = await supabaseAdmin
        .from("profiles")
        .update({ kyc_verified: true })
        .eq("id", data.userId);
      if (updErr) return { ok: false, error: updErr.message };

       // 5. Notify the trader
       await supabaseAdmin.from("notifications").insert({
         user_id: data.userId,
         title: "KYC verified",
         message: "Your bank account has been verified. You can now request payouts.",
         type: "success",
       });

       // Send KYC approved email (fire-and-forget)
       const { data: prof } = await supabaseAdmin.from("profiles").select("full_name").eq("id", data.userId).maybeSingle();
       const firstName = prof?.full_name?.split(" ")[0] || prof?.full_name || "Trader";
       sendKycApprovedEmail(data.userId, firstName);

       return { ok: true as const };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Verification failed";
      console.error("[verifyKycServer] unexpected", msg);
      return { ok: false, error: msg };
    }
  });

// ---------------------------------------------------------------------------
// Self-service KYC: trader submits account_number + bank_code, we call
// Paystack's resolve-account API, fuzzy-match the returned account_name to the
// trader's full_name, and on match auto-verify KYC.
// ---------------------------------------------------------------------------

type Bank = { name: string; code: string; slug: string };

/** Lightweight in-memory cache for the bank list (Paystack rarely changes it). */
let _bankCache: { at: number; banks: Bank[] } | null = null;

export const listNigerianBanks = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const fresh = _bankCache && Date.now() - _bankCache.at < 24 * 3600 * 1000;
      if (fresh && _bankCache) return { ok: true as const, banks: _bankCache.banks };

      const secret = process.env.PAYSTACK_SECRET_KEY;
      if (!secret) {
        return { ok: false as const, error: "Bank verification is not configured" };
      }
      const res = await fetch(
        "https://api.paystack.co/bank?country=nigeria&perPage=100",
        { headers: { Authorization: `Bearer ${secret}` } },
      );
      const json = (await res.json().catch(() => ({}))) as {
        status?: boolean;
        data?: Array<{ name: string; code: string; slug: string }>;
      };
      if (!res.ok || !json.status || !Array.isArray(json.data)) {
        return { ok: false as const, error: "Could not load bank list" };
      }
      const banks: Bank[] = json.data
        .map((b) => ({ name: b.name, code: b.code, slug: b.slug }))
        .sort((a, b) => a.name.localeCompare(b.name));
      _bankCache = { at: Date.now(), banks };
      return { ok: true as const, banks };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Bank list failed";
      return { ok: false as const, error: msg };
    }
  },
);

const ResolveInput = z.object({
  accessToken: z.string().min(1),
  accountNumber: z.string().regex(/^\d{10}$/, "Account number must be 10 digits"),
  bankCode: z.string().min(2).max(10),
  bankName: z.string().min(2).max(120),
});

/** Normalize a name for fuzzy comparison: uppercase, alphanumeric tokens only. */
function tokens(name: string): string[] {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2);
}

/**
 * Fuzzy match: every meaningful token in the SHORTER name must appear in the
 * longer name. Tolerates middle-name / ordering / punctuation differences.
 */
function namesMatch(a: string, b: string): boolean {
  const ta = tokens(a);
  const tb = tokens(b);
  if (ta.length === 0 || tb.length === 0) return false;
  const [shorter, longer] = ta.length <= tb.length ? [ta, tb] : [tb, ta];
  const longerSet = new Set(longer);
  const matched = shorter.filter((t) => longerSet.has(t)).length;
  // Require ≥2 token overlap and at least 60% of shorter name tokens to match.
  return matched >= 2 && matched / shorter.length >= 0.6;
}

/**
 * Trader-facing: verify own KYC via Paystack resolve-account.
 * On success: saves bank details + flips kyc_verified=true.
 */
export const verifyKycPaystack = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResolveInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const { data: authData, error: authErr } = await supabaseAdmin.auth.getUser(data.accessToken);
      if (authErr || !authData.user) return { ok: false as const, error: "Please sign in again" };
      const userId = authData.user.id;

      const secret = process.env.PAYSTACK_SECRET_KEY;
      if (!secret) return { ok: false as const, error: "Bank verification is not configured" };

      // Load profile to get the registered full_name.
      const { data: profile, error: profErr } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name")
        .eq("id", userId)
        .maybeSingle();
      if (profErr) return { ok: false as const, error: profErr.message };
      if (!profile?.full_name?.trim()) {
        return { ok: false as const, error: "Add your full name to your profile first" };
      }

      // Call Paystack resolve.
      const url = `https://api.paystack.co/bank/resolve?account_number=${encodeURIComponent(
        data.accountNumber,
      )}&bank_code=${encodeURIComponent(data.bankCode)}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${secret}` } });
      const json = (await res.json().catch(() => ({}))) as {
        status?: boolean;
        message?: string;
        data?: { account_number: string; account_name: string };
      };
      if (!res.ok || !json.status || !json.data?.account_name) {
        return {
          ok: false as const,
          error: json.message || "Could not verify this account number with the bank",
        };
      }

      const resolvedName = json.data.account_name;
      if (!namesMatch(resolvedName, profile.full_name)) {
        return {
          ok: false as const,
          error: `Account name "${resolvedName}" does not match your registered name "${profile.full_name}". Use a bank account that belongs to you.`,
        };
      }

      const { error: updErr } = await supabaseAdmin
        .from("profiles")
        .update({
          bank_account_number: data.accountNumber,
          bank_name: data.bankName,
          bank_account_name: resolvedName,
          kyc_verified: true,
        })
        .eq("id", userId);
      if (updErr) return { ok: false as const, error: updErr.message };

       await supabaseAdmin.from("notifications").insert({
         user_id: userId,
         title: "✅ KYC Verified",
         message:
           "Your bank account was verified instantly via Paystack. You can now request payouts.",
         type: "success",
       });

       // Send KYC approved email (fire-and-forget)
       const firstName = profile?.full_name?.split(" ")[0] || profile?.full_name || "Trader";
       sendKycApprovedEmail(userId, firstName);

       return { ok: true as const, accountName: resolvedName };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Verification failed";
      console.error("[verifyKycPaystack] unexpected", msg);
      return { ok: false as const, error: msg };
    }
  });