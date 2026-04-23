import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const VerifyInput = z.object({
  userId: z.string().uuid(),
  accountNumber: z.string().regex(/^\d{10}$/, "Account number must be 10 digits"),
});

/**
 * Admin-only: verify a trader's KYC bank account.
 * Succeeds only when:
 *  - The caller is an admin
 *  - The submitted account number matches what the trader saved on their profile
 *  - The trader actually owns at least one trader_account (i.e., they exist as a trader)
 */
export const verifyKycServer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => VerifyInput.parse(input))
  .handler(async ({ data, context }) => {
    const callerId = context.userId;

    // 1. Caller must be admin (checked through RLS-respecting client)
    const { data: roles, error: roleErr } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", callerId);
    if (roleErr) throw new Error(roleErr.message);
    if (!roles?.some((r) => r.role === "admin")) {
      throw new Error("Forbidden: admin role required");
    }

    // 2. Load target trader profile + their trader accounts (admin client to bypass RLS read scoping)
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

    if (profileRes.error) throw new Error(profileRes.error.message);
    if (accountsRes.error) throw new Error(accountsRes.error.message);

    const profile = profileRes.data;
    if (!profile) throw new Error("Trader profile not found");
    if (!profile.bank_account_number) {
      throw new Error("Trader has not submitted bank account details");
    }
    if (!accountsRes.data?.length) {
      throw new Error("Trader has no trader_accounts on record");
    }

    // 3. The submitted account number must EXACTLY match what's on the trader's profile.
    const submitted = data.accountNumber.trim();
    const onFile = (profile.bank_account_number || "").trim();
    if (submitted !== onFile) {
      throw new Error("Account number does not match the trader's records");
    }

    // 4. Mark verified
    const { error: updErr } = await supabaseAdmin
      .from("profiles")
      .update({ kyc_verified: true })
      .eq("id", data.userId);
    if (updErr) throw new Error(updErr.message);

    // 5. Notify the trader
    await supabaseAdmin.from("notifications").insert({
      user_id: data.userId,
      title: "KYC verified",
      message: "Your bank account has been verified. You can now request payouts.",
      type: "success",
    });

    return { ok: true };
  });