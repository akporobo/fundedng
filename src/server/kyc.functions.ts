import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

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

      return { ok: true as const };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Verification failed";
      console.error("[verifyKycServer] unexpected", msg);
      return { ok: false, error: msg };
    }
  });