import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { claimPoolAccount } from "@/lib/account-pool.server";
import { sendEventEmail } from "@/lib/email.server";

export const Route = createFileRoute("/api/public/cron/reconcile-payments")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => reconcilePayments(request),
    },
  },
});

async function attemptDelivery(orderId: string, userId: string, challengeId: string) {
  const { data: challenge } = await supabaseAdmin
    .from("challenges")
    .select("id, name, account_size")
    .eq("id", challengeId)
    .maybeSingle();

  if (!challenge) return;

  const poolResult = await claimPoolAccount({
    orderId,
    accountSizeNgn: challenge.account_size,
    challengeId: challenge.id,
    userId,
  }).catch(() => null);

  const { data: prof } = await supabaseAdmin
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .maybeSingle();
  const traderName = prof?.full_name ?? "A trader";

  if (poolResult?.ok) {
    await sendEventEmail({
      type: "mt5_delivered",
      orderId,
      mt5Login: poolResult.mt5Login,
      mt5Password: poolResult.mt5Password,
      mt5Server: poolResult.mt5Server,
    }).catch(() => {});

    await supabaseAdmin.rpc("send_telegram" as never, {
      p_message: `✅ <b>Reconciliation Delivery</b>\nTrader: ${traderName}\nChallenge: ${challenge.name}\nLogin: ${poolResult.mt5Login}\nServer: ${poolResult.mt5Server}`,
    } as never).catch(() => {});
  } else {
    await supabaseAdmin.rpc("send_telegram" as never, {
      p_message: `⏳ <b>Reconciliation — Manual Delivery Needed</b>\nTrader: ${traderName}\nChallenge: ${challenge.name}\nOrder: ${orderId}\nReason: ${poolResult?.error ?? "Pool unavailable"}`,
    } as never).catch(() => {});
  }
}

async function reconcilePayments(request: Request) {
  const secret = request.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find paid orders and check which ones are missing trader_accounts
  const { data: paidOrders, error: queryErr } = await supabaseAdmin
    .from("orders")
    .select("id, user_id, challenge_id, created_at")
    .eq("status", "paid")
    .order("created_at", { ascending: true });

  if (queryErr) {
    console.error("[reconcile-payments] Query failed:", queryErr);
    return Response.json({ error: queryErr.message }, { status: 500 });
  }

  if (!paidOrders || paidOrders.length === 0) {
    return Response.json({ ok: true, processed: 0 });
  }

  // Get all order_ids that already have an account delivered
  const orderIds = paidOrders.map((o) => o.id);
  const { data: deliveredAccounts } = await supabaseAdmin
    .from("trader_accounts")
    .select("order_id")
    .in("order_id", orderIds);

  const deliveredOrderIds = new Set(
    (deliveredAccounts ?? []).map((a) => a.order_id)
  );

  const undelivered = paidOrders.filter((o) => !deliveredOrderIds.has(o.id));

  if (undelivered.length === 0) {
    return Response.json({ ok: true, total: paidOrders.length, undelivered: 0 });
  }

  let attempts = 0;
  let errors = 0;

  for (const order of undelivered) {
    try {
      await attemptDelivery(order.id, order.user_id, order.challenge_id);
      attempts++;
    } catch (e) {
      console.error("[reconcile-payments] Delivery failed for order", order.id, e);
      errors++;
    }
  }

  return Response.json({
    ok: true,
    total: paidOrders.length,
    undelivered: undelivered.length,
    delivered: attempts,
    errors,
  });
}
