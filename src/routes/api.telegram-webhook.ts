import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { answerCallbackQuery, editTelegramMessage } from "@/lib/telegram.server";
import { sendEventEmail } from "@/lib/email.server";
import { claimPoolAccount } from "@/lib/account-pool.server";

const ADMIN_TELEGRAM_ID = 8749650113;

export const Route = createFileRoute("/api/telegram-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: any;
        try {
          body = await request.json();
        } catch {
          return new Response("ok", { status: 200 });
        }

        const cq = body?.callback_query;
        if (!cq) return new Response("ok", { status: 200 });

        const callbackQueryId = cq.id;
        const fromId = cq.from?.id;
        const data = cq.data as string;
        const messageId = cq.message?.message_id;
        const chatId = cq.message?.chat?.id;

        if (fromId !== ADMIN_TELEGRAM_ID) {
          await answerCallbackQuery(callbackQueryId, "Unauthorized", true);
          return new Response("ok", { status: 200 });
        }

        const [action, id] = data.split(":");

        try {
          switch (action) {
            // ── PAYOUT APPROVALS ─────────────────────────────────────────

            case "approve_payout": {
              const { error } = await supabaseAdmin
                .from("payouts")
                .update({ status: "approved", processed_at: new Date().toISOString() })
                .eq("id", id)
                .eq("status", "pending");

              if (error) {
                await answerCallbackQuery(callbackQueryId, "Error: " + error.message, true);
                break;
              }

              await sendEventEmail({ type: "payout_approved", payoutId: id }).catch(() => {});
              await answerCallbackQuery(callbackQueryId, "Payout approved!", false);

              if (chatId && messageId) {
                await editTelegramMessage(
                  chatId,
                  messageId,
                  cq.message.text + "\n\n<b>APPROVED</b> by Emperor",
                );
              }
              break;
            }

            case "reject_payout": {
              const { error } = await supabaseAdmin
                .from("payouts")
                .update({ status: "rejected", processed_at: new Date().toISOString() })
                .eq("id", id)
                .eq("status", "pending");

              if (error) {
                await answerCallbackQuery(callbackQueryId, "Error: " + error.message, true);
                break;
              }

              await sendEventEmail({ type: "payout_rejected", payoutId: id, reason: "Rejected by admin." }).catch(() => {});
              await answerCallbackQuery(callbackQueryId, "Payout rejected", false);

              if (chatId && messageId) {
                await editTelegramMessage(
                  chatId,
                  messageId,
                  cq.message.text + "\n\n<b>REJECTED</b> by Emperor",
                );
              }
              break;
            }

            // ── PHASE 2 PROGRESSION ──────────────────────────────────────

            case "approve_phase2": {
              const { data: acc } = await supabaseAdmin
                .from("trader_accounts")
                .select("id, user_id, starting_balance, currency, challenge_id, order_id, current_phase, status")
                .eq("id", id)
                .maybeSingle();

              if (!acc || (acc as any).current_phase >= 2) {
                await answerCallbackQuery(callbackQueryId, "Already processed or not found", true);
                break;
              }

              const isUsd = (acc as any).currency === "USD";
              const startingBalance = Number((acc as any).starting_balance);

              await supabaseAdmin
                .from("trader_accounts")
                .update({ status: "passed", phase1_passed_at: new Date().toISOString(), phase2_requested_at: null } as never)
                .eq("id", id);

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
                await supabaseAdmin
                  .from("trader_accounts")
                  .update({ status: "active", phase1_passed_at: null } as never)
                  .eq("id", id);

                await answerCallbackQuery(callbackQueryId, "Pool unavailable: " + poolResult.error, true);
                break;
              }

              await supabaseAdmin
                .from("trader_accounts")
                .update({ current_phase: 2, trading_days: 0 } as never)
                .eq("id", poolResult.accountId);

              await supabaseAdmin.from("notifications").insert({
                user_id: (acc as any).user_id,
                title: "Phase 1 Passed — New Account Provisioned",
                message: `Congratulations — you passed Phase 1! Your Phase 2 account is ready. New Login: ${poolResult.mt5Login} · Server: ${poolResult.mt5Server}`,
                type: "success",
              } as never);

              await sendEventEmail({ type: "phase1_passed", accountId: poolResult.accountId }).catch(() => {});

              // Post to live activity feed
              {
                const { data: profile } = await supabaseAdmin
                  .from("profiles")
                  .select("full_name")
                  .eq("id", (acc as any).user_id)
                  .maybeSingle();

                const fullName = (profile as any)?.full_name ?? "Trader";
                const avatarInitials = fullName.split(" ").slice(0, 2)
                  .map((w: string) => w[0]?.toUpperCase() ?? "").join("");

                const { data: chData } = await supabaseAdmin
                  .from("challenges")
                  .select("name")
                  .eq("id", (acc as any).challenge_id)
                  .maybeSingle();

                await supabaseAdmin.from("live_activity").insert({
                  event_type: "phase2_approved",
                  anonymized_name: fullName,
                  avatar_initials: avatarInitials,
                  challenge_name: (chData as any)?.name ?? "",
                  currency: (acc as any).currency ?? "NGN",
                  account_size: startingBalance,
                } as never);
              }

              await answerCallbackQuery(callbackQueryId, "Phase 2 provisioned!", false);

              if (chatId && messageId) {
                await editTelegramMessage(
                  chatId,
                  messageId,
                  cq.message.text + `\n\n<b>APPROVED</b> — New Login: <code>${poolResult.mt5Login}</code>`,
                );
              }
              break;
            }

            case "reject_phase2": {
              await supabaseAdmin
                .from("trader_accounts")
                .update({ phase2_requested_at: null } as never)
                .eq("id", id);

              const { data: rejAcc } = await supabaseAdmin
                .from("trader_accounts")
                .select("user_id")
                .eq("id", id)
                .maybeSingle();

              if (rejAcc?.user_id) {
                await supabaseAdmin.from("notifications").insert({
                  user_id: rejAcc.user_id,
                  title: "Phase 2 Request Rejected",
                  message: "Your Phase 2 progression request was rejected. Please contact support for more information.",
                  type: "warning",
                } as never);
              }

              await answerCallbackQuery(callbackQueryId, "Phase 2 rejected", false);

              if (chatId && messageId) {
                await editTelegramMessage(
                  chatId,
                  messageId,
                  cq.message.text + "\n\n<b>REJECTED</b> by Emperor",
                );
              }
              break;
            }

            // ── FUNDED PROGRESSION ───────────────────────────────────────

            case "approve_funded": {
              const { data: acc } = await supabaseAdmin
                .from("trader_accounts")
                .select("id, user_id, starting_balance, currency, challenge_id, order_id, current_phase, status")
                .eq("id", id)
                .maybeSingle();

              if (!acc || (acc as any).status === "funded") {
                await answerCallbackQuery(callbackQueryId, "Already processed or not found", true);
                break;
              }

              const isUsd = (acc as any).currency === "USD";
              const startingBalance = Number((acc as any).starting_balance);

              await supabaseAdmin
                .from("trader_accounts")
                .update({ status: "passed", phase2_passed_at: new Date().toISOString(), funded_requested_at: null } as never)
                .eq("id", id);

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
                await supabaseAdmin
                  .from("trader_accounts")
                  .update({ status: "active", phase2_passed_at: null } as never)
                  .eq("id", id);
                await answerCallbackQuery(callbackQueryId, "Pool unavailable: " + poolResult.error, true);
                break;
              }

              await supabaseAdmin
                .from("trader_accounts")
                .update({
                  status: "funded",
                  current_phase: 3,
                  trading_days: 0,
                  funded_at: new Date().toISOString(),
                } as never)
                .eq("id", poolResult.accountId);

              await supabaseAdmin.from("notifications").insert({
                user_id: (acc as any).user_id,
                title: "You're Funded — New Account Provisioned",
                message: `Congratulations — you are now a funded trader! Your funded account is ready. Login: ${poolResult.mt5Login} · Server: ${poolResult.mt5Server}. Start trading and request your first payout!`,
                type: "success",
              } as never);

              await sendEventEmail({ type: "funded", accountId: poolResult.accountId }).catch(() => {});

              // Post to live activity feed
              {
                const { data: profile } = await supabaseAdmin
                  .from("profiles")
                  .select("full_name")
                  .eq("id", (acc as any).user_id)
                  .maybeSingle();

                const fullName = (profile as any)?.full_name ?? "Trader";
                const avatarInitials = fullName.split(" ").slice(0, 2)
                  .map((w: string) => w[0]?.toUpperCase() ?? "").join("");

                const { data: chData } = await supabaseAdmin
                  .from("challenges")
                  .select("name")
                  .eq("id", (acc as any).challenge_id)
                  .maybeSingle();

                await supabaseAdmin.from("live_activity").insert({
                  event_type: "funded_approved",
                  anonymized_name: fullName,
                  avatar_initials: avatarInitials,
                  challenge_name: (chData as any)?.name ?? "",
                  currency: (acc as any).currency ?? "NGN",
                  account_size: startingBalance,
                } as never);
              }

              await answerCallbackQuery(callbackQueryId, "Funded!", false);

              if (chatId && messageId) {
                await editTelegramMessage(
                  chatId,
                  messageId,
                  cq.message.text + `\n\n<b>FUNDED</b> — New Login: <code>${poolResult.mt5Login}</code>`,
                );
              }
              break;
            }

            case "reject_funded": {
              await supabaseAdmin
                .from("trader_accounts")
                .update({ funded_requested_at: null } as never)
                .eq("id", id);

              const { data: rejAcc } = await supabaseAdmin
                .from("trader_accounts")
                .select("user_id")
                .eq("id", id)
                .maybeSingle();

              if (rejAcc?.user_id) {
                await supabaseAdmin.from("notifications").insert({
                  user_id: rejAcc.user_id,
                  title: "Funded Request Rejected",
                  message: "Your funded status request was rejected. Please contact support for more information.",
                  type: "warning",
                } as never);
              }

              await answerCallbackQuery(callbackQueryId, "Rejected", false);

              if (chatId && messageId) {
                await editTelegramMessage(
                  chatId,
                  messageId,
                  cq.message.text + "\n\n<b>REJECTED</b> by Emperor",
                );
              }
              break;
            }

            default:
              await answerCallbackQuery(callbackQueryId, "Unknown action", false);
          }
        } catch (e) {
          console.error("[telegram-webhook] handler error:", e);
          await answerCallbackQuery(callbackQueryId, "Server error — check admin panel", true);
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
