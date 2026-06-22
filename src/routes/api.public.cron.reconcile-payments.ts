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

interface SquadTransaction {
  transaction_ref: string;
  transaction_amount: number;
  email: string;
  transaction_status: string;
  meta?: Record<string, string>;
  metadata?: Record<string, string>;
  transaction_date?: string;
}

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

  const squadSecret = process.env.SQUAD_SECRET_KEY;
  if (!squadSecret) {
    console.error("[reconcile-payments] SQUAD_SECRET_KEY not configured");
    return Response.json({ error: "SQUAD_SECRET_KEY not configured" }, { status: 500 });
  }

  const from = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  let squadRes: Response;
  try {
    squadRes = await fetch(
      `https://api-d.squadco.com/transaction/list?perPage=100&from=${encodeURIComponent(from)}&transaction_status=success`,
      { headers: { Authorization: `Bearer ${squadSecret}` } }
    );
  } catch (e) {
    console.error("[reconcile-payments] Squad API request failed:", e);
    return Response.json({ error: "Squad API request failed" }, { status: 502 });
  }

  if (!squadRes.ok) {
    const text = await squadRes.text().catch(() => "");
    console.error("[reconcile-payments] Squad API error:", squadRes.status, text);
    return Response.json({ error: "Squad API error" }, { status: 502 });
  }

  let squadJson: any;
  try {
    squadJson = await squadRes.json();
  } catch {
    return Response.json({ error: "Invalid Squad API response" }, { status: 502 });
  }

  const transactions: SquadTransaction[] = squadJson?.data?.transactions ?? [];
  if (transactions.length === 0) {
    return Response.json({ ok: true, processed: 0 });
  }

  let created = 0;
  let delivered = 0;
  let skipped = 0;
  let errors = 0;

  for (const txn of transactions) {
    const reference = txn.transaction_ref;
    if (!reference) continue;

    try {
      const { data: existingOrder } = await supabaseAdmin
        .from("orders")
        .select("id, user_id, challenge_id, status")
        .eq("paystack_reference", reference)
        .maybeSingle();

      if (existingOrder) {
        const { data: existingAccount } = await supabaseAdmin
          .from("trader_accounts")
          .select("id")
          .eq("order_id", existingOrder.id)
          .maybeSingle();

        if (existingAccount) {
          skipped++;
          continue;
        }

        await attemptDelivery(existingOrder.id, existingOrder.user_id, existingOrder.challenge_id);
        delivered++;
        continue;
      }

      const meta = txn.metadata ?? txn.meta ?? {};
      const challengeId = meta.challenge_id;
      const userId = meta.user_id;

      if (!challengeId || !userId) {
        await supabaseAdmin.rpc("send_telegram" as never, {
          p_message: `⚠️ Reconciliation: paid txn with no meta\nRef: ${reference}\nAmount: ${txn.transaction_amount}\nEmail: ${txn.email}\nManual order creation needed.`,
        } as never).catch(() => {});
        errors++;
        continue;
      }

      const { data: challenge } = await supabaseAdmin
        .from("challenges")
        .select("id, name, account_size, price_naira")
        .eq("id", challengeId)
        .maybeSingle();

      if (!challenge) {
        errors++;
        continue;
      }

      const { data: order, error: orderErr } = await supabaseAdmin
        .from("orders")
        .insert({
          user_id: userId,
          challenge_id: challengeId,
          amount_paid: txn.transaction_amount,
          status: "paid",
          paystack_reference: reference,
        })
        .select("id")
        .single();

      if (orderErr || !order) {
        console.error("[reconcile-payments] Failed to create order for ref:", reference, orderErr);
        errors++;
        continue;
      }

      await sendEventEmail({
        type: "purchase_confirmed",
        orderId: order.id,
      }).catch(() => {});

      await attemptDelivery(order.id, userId, challengeId);
      created++;
      delivered++;
    } catch (e) {
      console.error("[reconcile-payments] Error processing txn", reference, e);
      errors++;
    }
  }

  return Response.json({
    ok: true,
    processed: transactions.length,
    created,
    delivered,
    skipped,
    errors,
  });
}
