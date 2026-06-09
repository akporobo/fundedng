import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { claimPoolAccount } from "@/lib/account-pool.server";
import { sendEventEmail } from "@/lib/email.server";
import crypto from "node:crypto";

export const Route = createFileRoute("/api/squad-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const rawBody = await request.text();

          // 1. Verify the webhook signature
          const squadSecret = process.env.SQUAD_SECRET_KEY;
          const signature = request.headers.get("x-squad-encrypted-body");
          if (squadSecret && signature) {
            const hash = crypto
              .createHmac("sha512", squadSecret)
              .update(rawBody)
              .digest("hex");
            if (hash.toUpperCase() !== signature.toUpperCase()) {
              console.error("[squad-webhook] Invalid signature");
              return Response.json({ error: "Invalid signature" }, { status: 401 });
            }
          }

          const payload = JSON.parse(rawBody) as {
            Event?: string;
            Body?: {
              transaction_ref?: string;
              transaction_status?: string;
              amount?: number;
              email?: string;
              meta?: Record<string, string>;
            };
          };

          // 2. Only process successful charges
          if (
            payload.Event !== "charge_successful" ||
            payload.Body?.transaction_status?.toLowerCase() !== "success"
          ) {
            return Response.json({ ok: true }); // acknowledge but ignore
          }

          const reference = payload.Body?.transaction_ref;
          if (!reference) {
            return Response.json({ ok: true });
          }

          // 3. Find the order by reference (idempotency)
          const { data: order } = await supabaseAdmin
            .from("orders")
            .select("id, user_id, challenge_id, status")
            .eq("paystack_reference", reference)
            .maybeSingle();

          if (!order) {
            // Order doesn't exist yet — payment came in before callback
            // Log it so you can manually reconcile
            console.warn("[squad-webhook] No order found for reference:", reference);
            await supabaseAdmin.rpc("send_telegram" as never, {
              p_message: `⚠️ Webhook received for unknown reference: ${reference}\nEmail: ${payload.Body?.email}\nManual reconciliation needed.`,
            } as never).catch(() => {});
            return Response.json({ ok: true });
          }

          // 4. Skip if already delivered
          const { data: existingAccount } = await supabaseAdmin
            .from("trader_accounts")
            .select("id")
            .eq("order_id", order.id)
            .maybeSingle();

          if (existingAccount) {
            return Response.json({ ok: true }); // already delivered
          }

          // 5. Get challenge info
          const { data: challenge } = await supabaseAdmin
            .from("challenges")
            .select("id, name, account_size")
            .eq("id", order.challenge_id)
            .maybeSingle();

          if (!challenge) {
            return Response.json({ ok: true });
          }

          // 6. Attempt pool delivery
          const poolResult = await claimPoolAccount({
            orderId: order.id,
            accountSizeNgn: challenge.account_size,
            challengeId: challenge.id,
            userId: order.user_id,
          }).catch((e) => {
            console.error("[squad-webhook] claimPoolAccount threw", e);
            return null;
          });

          const { data: prof } = await supabaseAdmin
            .from("profiles")
            .select("full_name")
            .eq("id", order.user_id)
            .maybeSingle();
          const traderName = prof?.full_name || "A trader";

          if (poolResult?.ok) {
            await sendEventEmail({
              type: "mt5_delivered",
              orderId: order.id,
              mt5Login: poolResult.mt5Login,
              mt5Password: poolResult.mt5Password,
              mt5Server: poolResult.mt5Server,
            }).catch(() => {});

            await supabaseAdmin.rpc("send_telegram" as never, {
              p_message: `✅ <b>Webhook Delivery</b>\nTrader: ${traderName}\nChallenge: ${challenge.name}\nLogin: ${poolResult.mt5Login}\nServer: ${poolResult.mt5Server}`,
            } as never).catch(() => {});
          } else {
            await supabaseAdmin.rpc("send_telegram" as never, {
              p_message: `⏳ <b>Webhook — Manual Delivery Needed</b>\nTrader: ${traderName}\nChallenge: ${challenge.name}\nOrder: ${order.id}\nReason: ${poolResult?.error ?? "Pool unavailable"}`,
            } as never).catch(() => {});
          }

          return Response.json({ ok: true });
        } catch (e) {
          console.error("[squad-webhook] error", e);
          return Response.json({ error: "Internal error" }, { status: 500 });
        }
      },
    },
  },
});
