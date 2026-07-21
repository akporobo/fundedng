import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendEventEmail } from "@/lib/email.server";
import { claimPoolAccount } from "@/lib/account-pool.server";

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
        const { data: payout } = await supabaseAdmin
          .from("payouts")
          .select("trader_account_id")
          .eq("id", data.payoutId)
          .maybeSingle();
        if (payout?.trader_account_id) {
          const { data: account } = await supabaseAdmin
            .from("trader_accounts")
            .select("id, starting_balance")
            .eq("id", payout.trader_account_id)
            .maybeSingle();
          if (account) {
            await supabaseAdmin
              .from("trader_accounts")
              .update({ current_equity: account.starting_balance, peak_equity: account.starting_balance, daily_peak_equity: account.starting_balance, daily_peak_date: new Date().toISOString().slice(0, 10), trading_days: 0 } as never)
              .eq("id", account.id);
            await supabaseAdmin
              .from("account_snapshots")
              .insert({ trader_account_id: account.id, equity: account.starting_balance, balance: account.starting_balance, profit: 0, drawdown_percent: 0, snapshot_time: new Date().toISOString() } as never);

            // Pause monitor for this account to prevent MT5 balance from overwriting reset
            await supabaseAdmin
              .from("trader_accounts")
              .update({
                monitor_paused: true,
                monitor_paused_at: new Date().toISOString(),
                monitor_paused_reason: `Payout paid — awaiting MT5 balance reset on Exness`,
              } as never)
              .eq("id", account.id);

            // Send urgent Telegram reminder
            const { data: fullAccount } = await supabaseAdmin
              .from("trader_accounts")
              .select("mt5_login, mt5_server, currency, starting_balance, profiles(full_name)")
              .eq("id", account.id)
              .maybeSingle();

            const { data: payoutDetails } = await supabaseAdmin
              .from("payouts")
              .select("amount_naira")
              .eq("id", data.payoutId)
              .maybeSingle();

            const traderName = (fullAccount as any)?.profiles?.full_name ?? "Unknown Trader";
            const mt5Login = (fullAccount as any)?.mt5_login ?? "?";
            const mt5Server = (fullAccount as any)?.mt5_server ?? "Exness-MT5Trial9";
            const currency = (fullAccount as any)?.currency ?? "NGN";
            const startingBalance = Number((fullAccount as any)?.starting_balance ?? 0);
            const payoutAmount = Number((payoutDetails as any)?.amount_naira ?? 0);

            const balanceDisplay = currency === "USD"
              ? `$${startingBalance.toLocaleString()}`
              : `₦${startingBalance.toLocaleString()}`;

            const payoutDisplay = currency === "USD"
              ? `$${(payoutAmount / 1550).toFixed(2)}`
              : `₦${payoutAmount.toLocaleString()}`;

            try {
              await supabaseAdmin.rpc("send_telegram" as never, {
                p_message:
                  `🔴 <b>ACTION REQUIRED — MT5 Reset Needed</b>\n\n` +
                  `Trader: <b>${traderName}</b>\n` +
                  `MT5 Login: <code>${mt5Login}</code>\n` +
                  `Server: ${mt5Server}\n` +
                  `Account Size: ${balanceDisplay}\n` +
                  `Payout Paid: ${payoutDisplay}\n\n` +
                  `⚠️ <b>Go to Exness Partner Portal NOW and reset this account balance to ${balanceDisplay}</b>\n\n` +
                  `🛑 Monitor is PAUSED for this account until you confirm the reset.\n` +
                  `✅ Click "MT5 Reset Done" in the admin panel to resume monitoring.`,
              } as never);
            } catch (e) {
              console.error("[updatePayoutServer] telegram reminder failed", e);
            }
          }
        }
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
// Confirm MT5 Reset — unpause monitor after payout
// ---------------------------------------------------------------------------
const ConfirmMt5ResetInput = z.object({
  accessToken: z.string().min(1),
  traderAccountId: z.string().uuid(),
});

export const confirmMt5ResetServer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ConfirmMt5ResetInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const auth = await assertAdmin(data.accessToken);
      if (!auth.ok) return auth;

      const { error } = await supabaseAdmin
        .from("trader_accounts")
        .update({
          monitor_paused: false,
          monitor_paused_at: null,
          monitor_paused_reason: null,
        } as never)
        .eq("id", data.traderAccountId);

      if (error) return { ok: false as const, error: error.message };

      // Confirm via Telegram
      const { data: account } = await supabaseAdmin
        .from("trader_accounts")
        .select("mt5_login, profiles(full_name)")
        .eq("id", data.traderAccountId)
        .maybeSingle();

      const name = (account as any)?.profiles?.full_name ?? "Trader";
      const login = (account as any)?.mt5_login ?? "?";

      try {
        await supabaseAdmin.rpc("send_telegram" as never, {
          p_message: `✅ <b>MT5 Reset Confirmed</b>\nTrader: ${name}\nLogin: <code>${login}</code>\nMonitor resumed — equity sync active again.`,
        } as never);
      } catch (e) {
        console.error("[confirmMt5ResetServer] telegram failed", e);
      }

      return { ok: true as const };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed";
      console.error("[confirmMt5ResetServer] unexpected", msg);
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
        .select("user_id, starting_balance, currency, challenge_id, order_id, current_phase, status")
        .eq("id", data.accountId)
        .maybeSingle();

      if (!acc) return { ok: false as const, error: "Account not found" };
      if ((acc as any).current_phase >= 2) return { ok: false as const, error: "Already in Phase 2 or beyond" };

      const isUsd = (acc as any).currency === "USD";
      const startingBalance = Number((acc as any).starting_balance);

      // 1. Mark Phase 1 account as passed
      const { error: passErr } = await supabaseAdmin
        .from("trader_accounts")
        .update({
          status: "passed",
          phase1_passed_at: new Date().toISOString(),
          phase2_requested_at: null,
        } as never)
        .eq("id", data.accountId);

      if (passErr) return { ok: false as const, error: passErr.message };

      // 2. Claim a fresh account from the pool for Phase 2
      const poolResult = await claimPoolAccount({
        orderId: (acc as any).order_id,
        accountSizeNgn: isUsd ? 0 : startingBalance,
        accountSizeUsd: isUsd ? startingBalance : undefined,
        currency: (acc as any).currency ?? "NGN",
        challengeId: (acc as any).challenge_id,
        userId: (acc as any).user_id,
        phaseProgression: true,
      });

      if (!poolResult.ok) {
        // Rollback Phase 1 status if pool claim fails
        await supabaseAdmin
          .from("trader_accounts")
          .update({ status: "active", phase1_passed_at: null } as never)
          .eq("id", data.accountId);
        return { ok: false as const, error: `Pool unavailable: ${poolResult.error}` };
      }

      // 3. Set the new account to Phase 2
      await supabaseAdmin
        .from("trader_accounts")
        .update({
          current_phase: 2,
          phase1_passed_at: new Date().toISOString(),
          trading_days: 0,
        } as never)
        .eq("id", poolResult.accountId);

      // 4. Notify trader with new credentials
      await supabaseAdmin.from("notifications").insert({
        user_id: (acc as any).user_id,
        title: "🎯 Phase 1 Passed — New Account Provisioned",
        message: `Congratulations — you passed Phase 1! Your Phase 2 account is ready. New Login: ${poolResult.mt5Login} · Server: ${poolResult.mt5Server}. Your starting balance is ${isUsd ? "$" : "₦"}${startingBalance.toLocaleString()}. Good luck!`,
        type: "success",
      } as never);

      // 5. Send phase 1 passed email
      await sendEventEmail({ type: "phase1_passed", accountId: poolResult.accountId }).catch((e) =>
        console.error("[approvePhase2Server] email send failed", e),
      );

      // 6. Telegram alert to admin
      await supabaseAdmin.rpc("send_telegram" as never, {
        p_message: `🎯 <b>Phase 2 Provisioned</b>\nTrader: ${(acc as any).user_id}\nNew Login: ${poolResult.mt5Login}\nServer: ${poolResult.mt5Server}\nSize: ${isUsd ? "$" : "₦"}${startingBalance.toLocaleString()}`,
      } as never);

      return { ok: true as const, newAccountId: poolResult.accountId };
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
        .select("user_id, starting_balance, currency, challenge_id, order_id, current_phase, status")
        .eq("id", data.accountId)
        .maybeSingle();

      if (!acc) return { ok: false as const, error: "Account not found" };
      if ((acc as any).status === "funded") return { ok: false as const, error: "Already funded" };

      const isUsd = (acc as any).currency === "USD";
      const startingBalance = Number((acc as any).starting_balance);

      // 1. Mark Phase 2 account as passed
      const { error: passErr } = await supabaseAdmin
        .from("trader_accounts")
        .update({
          status: "passed",
          phase2_passed_at: new Date().toISOString(),
          funded_requested_at: null,
        } as never)
        .eq("id", data.accountId);

      if (passErr) return { ok: false as const, error: passErr.message };

      // 2. Claim fresh funded account from pool
      const poolResult = await claimPoolAccount({
        orderId: (acc as any).order_id,
        accountSizeNgn: isUsd ? 0 : startingBalance,
        accountSizeUsd: isUsd ? startingBalance : undefined,
        currency: (acc as any).currency ?? "NGN",
        challengeId: (acc as any).challenge_id,
        userId: (acc as any).user_id,
        phaseProgression: true,
      });

      if (!poolResult.ok) {
        // Rollback if pool claim fails
        await supabaseAdmin
          .from("trader_accounts")
          .update({ status: "active", phase2_passed_at: null } as never)
          .eq("id", data.accountId);
        return { ok: false as const, error: `Pool unavailable: ${poolResult.error}` };
      }

      // 3. Set funded status on new account
      await supabaseAdmin
        .from("trader_accounts")
        .update({
          status: "funded",
          current_phase: 3,
          funded_at: new Date().toISOString(),
          trading_days: 0,
        } as never)
        .eq("id", poolResult.accountId);

      // 4. Notify trader
      await supabaseAdmin.from("notifications").insert({
        user_id: (acc as any).user_id,
        title: "🏆 You're Funded — New Account Provisioned",
        message: `Congratulations — you are now a funded trader! Your funded account is ready. Login: ${poolResult.mt5Login} · Server: ${poolResult.mt5Server}. Start trading and request your first payout!`,
        type: "success",
      } as never);

      // 5. Email
      await sendEventEmail({ type: "funded", accountId: poolResult.accountId }).catch((e) =>
        console.error("[approveFundedServer] email send failed", e),
      );

      // 6. Telegram
      await supabaseAdmin.rpc("send_telegram" as never, {
        p_message: `🏆 <b>Trader Funded</b>\nUser: ${(acc as any).user_id}\nNew Login: ${poolResult.mt5Login}\nServer: ${poolResult.mt5Server}\nSize: ${isUsd ? "$" : "₦"}${startingBalance.toLocaleString()}`,
      } as never);

      return { ok: true as const, newAccountId: poolResult.accountId };
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
