import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendEventEmail } from "@/lib/email.server";

const AddSocialProofInput = z.object({
  accessToken: z.string().min(1),
  label: z.string().min(1),
  image_url: z.string().url(),
  storage_path: z.string().optional(),
  category: z.string().min(1),
  display_order: z.number().int().min(0),
});

export const addSocialProofServer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AddSocialProofInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const auth = await assertAdmin(data.accessToken);
      if (!auth.ok) return auth;

      const { error: insertError } = await supabaseAdmin
        .from("social_proof_items")
        .insert({
          label: data.label,
          image_url: data.image_url,
          storage_path: data.storage_path ?? null,
          category: data.category,
          display_order: data.display_order,
        } as never);

      if (insertError) return { ok: false as const, error: insertError.message };
      return { ok: true as const };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Add failed";
      console.error("[addSocialProofServer] unexpected", msg);
      return { ok: false as const, error: msg };
    }
  });

async function assertAdmin(token: string) {
  const { data: authData, error: authErr } = await supabaseAdmin.auth.getUser(token);
  if (authErr || !authData?.user) return { ok: false as const, error: "Please sign in again" };
  const { data: roles } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", authData.user.id);
  if (!roles?.some((r) => r.role === "admin")) return { ok: false as const, error: "Forbidden: admin role required" };
  return { ok: true as const, userId: authData.user.id };
}

async function assertUser(token: string) {
  const { data: authData, error: authErr } = await supabaseAdmin.auth.getUser(token);
  if (authErr || !authData?.user) return { ok: false as const, error: "Please sign in again" };
  return { ok: true as const, userId: authData.user.id };
}

// ---------------------------------------------------------------------------
// Request payout (trader-side) + send email notification
// ---------------------------------------------------------------------------
const RequestPayoutInput = z.object({
  accessToken: z.string().min(1),
  userId: z.string().uuid(),
  traderAccountId: z.string().uuid(),
  amountNaira: z.number().positive(),
  profitPercent: z.number(),
  bankDetails: z.object({
    account_number: z.string(),
    bank_name: z.string(),
    account_name: z.string(),
  }),
});

export const requestPayoutServer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RequestPayoutInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const auth = await assertUser(data.accessToken);
      if (!auth.ok) return auth;
      if (auth.userId !== data.userId) return { ok: false as const, error: "Unauthorized" };

      const { data: payoutInsert, error: insertErr } = await supabaseAdmin
        .from("payouts")
        .insert({
          user_id: data.userId,
          trader_account_id: data.traderAccountId,
          amount_naira: data.amountNaira,
          profit_percent: data.profitPercent,
          payment_method: "bank_transfer",
          wallet_address: null,
          bank_details: data.bankDetails,
        } as never)
        .select("id")
        .single();

      if (insertErr || !payoutInsert) return { ok: false as const, error: insertErr?.message ?? "Insert failed" };

      await sendEventEmail({ type: "payout_requested", payoutId: (payoutInsert as any).id }).catch((e) =>
        console.error("[requestPayoutServer] email send failed", e),
      );

      return { ok: true as const, payoutId: (payoutInsert as any).id };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Request failed";
      console.error("[requestPayoutServer] unexpected", msg);
      return { ok: false as const, error: msg };
    }
  });

// ---------------------------------------------------------------------------
// Update payout status + send email notification
// ---------------------------------------------------------------------------
const UpdatePayoutInput = z.object({
  accessToken: z.string().min(1),
  payoutId: z.string().uuid(),
  status: z.enum(["approved", "paid", "rejected"]),
});

export const updatePayoutServer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => UpdatePayoutInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const auth = await assertAdmin(data.accessToken);
      if (!auth.ok) return auth;

      const { error } = await supabaseAdmin
        .from("payouts")
        .update({ status: data.status, processed_at: new Date().toISOString() })
        .eq("id", data.payoutId);
      if (error) return { ok: false as const, error: error.message };

      if (data.status === "approved") {
        await sendEventEmail({ type: "payout_approved", payoutId: data.payoutId }).catch((e) =>
          console.error("[updatePayoutServer] payout_approved email failed", e),
        );
      } else if (data.status === "paid") {
        await sendEventEmail({ type: "payout_paid", payoutId: data.payoutId }).catch((e) =>
          console.error("[updatePayoutServer] payout_paid email failed", e),
        );
      } else if (data.status === "rejected") {
        await sendEventEmail({ type: "payout_rejected", payoutId: data.payoutId, reason: "Rejected by admin." }).catch((e) =>
          console.error("[updatePayoutServer] payout_rejected email failed", e),
        );
      }

      return { ok: true as const };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Update failed";
      console.error("[updatePayoutServer] unexpected", msg);
      return { ok: false as const, error: msg };
    }
  });

// ---------------------------------------------------------------------------
// Approve Phase 2 (reset equity, bump phase, send email)
// ---------------------------------------------------------------------------
const ApprovePhase2Input = z.object({
  accessToken: z.string().min(1),
  accountId: z.string().uuid(),
});

export const approvePhase2Server = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ApprovePhase2Input.parse(input))
  .handler(async ({ data }) => {
    try {
      const auth = await assertAdmin(data.accessToken);
      if (!auth.ok) return auth;

      const { data: acc } = await supabaseAdmin
        .from("trader_accounts")
        .select("user_id, starting_balance")
        .eq("id", data.accountId)
        .maybeSingle();
      if (!acc) return { ok: false as const, error: "Account not found" };
      if ((acc as any).current_phase >= 2) return { ok: false as const, error: "Already in Phase 2 or beyond" };

      const startingBalance = (acc as any).starting_balance;

      const { error: updateErr } = await supabaseAdmin
        .from("trader_accounts")
        .update({
          current_phase: 2,
          current_equity: startingBalance,
          peak_equity: startingBalance,
          phase1_passed_at: new Date().toISOString(),
          phase2_requested_at: null,
          status: "active",
        } as never)
        .eq("id", data.accountId);
      if (updateErr) return { ok: false as const, error: updateErr.message };

      await supabaseAdmin.from("account_snapshots").insert({
        trader_account_id: data.accountId,
        equity: startingBalance,
        balance: startingBalance,
        profit: 0,
        drawdown_percent: 0,
      } as never);

      await supabaseAdmin.from("notifications").insert({
        user_id: (acc as any).user_id,
        title: "🎯 Phase 1 Passed",
        message: "Congratulations — you're now in Phase 2. Your equity has been reset to the starting balance.",
        type: "success",
      } as never);

      await sendEventEmail({ type: "phase1_passed", accountId: data.accountId }).catch((e) =>
        console.error("[approvePhase2Server] email send failed", e),
      );

      return { ok: true as const };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Approval failed";
      console.error("[approvePhase2Server] unexpected", msg);
      return { ok: false as const, error: msg };
    }
  });

// ---------------------------------------------------------------------------
// Approve Funded (reset equity, mark funded, send email)
// ---------------------------------------------------------------------------
const ApproveFundedInput = z.object({
  accessToken: z.string().min(1),
  accountId: z.string().uuid(),
});

export const approveFundedServer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ApproveFundedInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const auth = await assertAdmin(data.accessToken);
      if (!auth.ok) return auth;

      const { data: acc } = await supabaseAdmin
        .from("trader_accounts")
        .select("user_id, starting_balance, status")
        .eq("id", data.accountId)
        .maybeSingle();
      if (!acc) return { ok: false as const, error: "Account not found" };
      if ((acc as any).status === "funded") return { ok: false as const, error: "Already funded" };

      const startingBalance = (acc as any).starting_balance;

      const { error: updateErr } = await supabaseAdmin
        .from("trader_accounts")
        .update({
          status: "funded",
          current_equity: startingBalance,
          peak_equity: startingBalance,
          phase2_passed_at: new Date().toISOString(),
          funded_at: new Date().toISOString(),
          funded_requested_at: null,
        } as never)
        .eq("id", data.accountId);
      if (updateErr) return { ok: false as const, error: updateErr.message };

      await supabaseAdmin.from("account_snapshots").insert({
        trader_account_id: data.accountId,
        equity: startingBalance,
        balance: startingBalance,
        profit: 0,
        drawdown_percent: 0,
      } as never);

      await supabaseAdmin.from("notifications").insert({
        user_id: (acc as any).user_id,
        title: "🏆 You're Funded!",
        message: "Congratulations — your account is now funded. Equity has been reset to the starting balance. Start trading and request payouts.",
        type: "success",
      } as never);

      await sendEventEmail({ type: "funded", accountId: data.accountId }).catch((e) =>
        console.error("[approveFundedServer] email send failed", e),
      );

      return { ok: true as const };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Approval failed";
      console.error("[approveFundedServer] unexpected", msg);
      return { ok: false as const, error: msg };
    }
  });

// ---------------------------------------------------------------------------
// Mark account as breached
// ---------------------------------------------------------------------------
const MarkBreachedInput = z.object({
  accessToken: z.string().min(1),
  accountId: z.string().uuid(),
  reason: z.string().min(1),
});

export const markBreachedServer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MarkBreachedInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const auth = await assertAdmin(data.accessToken);
      if (!auth.ok) return auth;

      const { error } = await supabaseAdmin
        .from("trader_accounts")
        .update({
          status: "breached",
          breach_reason: data.reason.trim(),
        } as never)
        .eq("id", data.accountId);
      if (error) return { ok: false as const, error: error.message };

      await sendEventEmail({ type: "breached", accountId: data.accountId, reason: data.reason.trim() }).catch((e) =>
        console.error("[markBreachedServer] email send failed", e),
      );

      return { ok: true as const };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Breach failed";
      console.error("[markBreachedServer] unexpected", msg);
      return { ok: false as const, error: msg };
    }
  });

// ---------------------------------------------------------------------------
// Social Proof — Update item
// ---------------------------------------------------------------------------
const UpdateSocialProofInput = z.object({
  accessToken: z.string().min(1),
  id: z.string().uuid(),
  display_order: z.number().int().min(0).optional(),
  is_visible: z.boolean().optional(),
});

export const updateSocialProofServer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => UpdateSocialProofInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const auth = await assertAdmin(data.accessToken);
      if (!auth.ok) return auth;

      const updates: Record<string, unknown> = {};
      if (data.display_order !== undefined) updates.display_order = data.display_order;
      if (data.is_visible !== undefined) updates.is_visible = data.is_visible;
      if (Object.keys(updates).length === 0) return { ok: false as const, error: "No fields to update" };

      const { error } = await supabaseAdmin
        .from("social_proof_items")
        .update(updates as never)
        .eq("id", data.id);

      if (error) return { ok: false as const, error: error.message };
      return { ok: true as const };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Update failed";
      console.error("[updateSocialProofServer] unexpected", msg);
      return { ok: false as const, error: msg };
    }
  });

// ---------------------------------------------------------------------------
// Social Proof — Delete item
// ---------------------------------------------------------------------------
const DeleteSocialProofInput = z.object({
  accessToken: z.string().min(1),
  id: z.string().uuid(),
  storage_path: z.string().optional(),
});

export const deleteSocialProofServer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => DeleteSocialProofInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const auth = await assertAdmin(data.accessToken);
      if (!auth.ok) return auth;

      if (data.storage_path) {
        await supabaseAdmin.storage.from("social-proof").remove([data.storage_path]);
      }

      const { error } = await supabaseAdmin
        .from("social_proof_items")
        .delete()
        .eq("id", data.id);

      if (error) return { ok: false as const, error: error.message };
      return { ok: true as const };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Delete failed";
      console.error("[deleteSocialProofServer] unexpected", msg);
      return { ok: false as const, error: msg };
    }
  });
