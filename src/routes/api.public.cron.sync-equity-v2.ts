import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendEventEmail } from "@/lib/email.server";

export const Route = createFileRoute("/api/public/cron/sync-equity-v2")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => syncEquityV2(request),
      GET: async ({ request }: { request: Request }) => syncEquityV2(request),
    },
  },
});

async function syncEquityV2(request: Request) {
  const secret = request.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    account_id?: string;
    mt5_login?: string;
    equity?: number;
    balance?: number;
    profit?: number;
    scalping_violations?: Array<{
      symbol: string;
      open_time: number;
      close_time: number;
      duration_seconds: number;
      profit: number;
      volume: number;
      ticket: number;
    }>;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { account_id, mt5_login, equity, balance, profit, scalping_violations } = body;
  if (
    !account_id ||
    !mt5_login ||
    equity === undefined ||
    balance === undefined ||
    profit === undefined
  ) {
    return Response.json(
      { error: "Missing required fields: account_id, mt5_login, equity, balance, profit" },
      { status: 400 }
    );
  }

  const { data: account, error: acctErr } = await supabaseAdmin
    .from("trader_accounts")
    .select("id, status, starting_balance, peak_equity, last_synced_at, trading_days")
    .eq("id", account_id)
    .in("status", ["active", "funded"])
    .single();

  if (acctErr || !account) {
    return Response.json(
      { error: "Account not found or status not active/funded" },
      { status: 404 }
    );
  }

  const startingBalance = Number(account.starting_balance);
  const prevPeak = Number(account.peak_equity ?? startingBalance);
  const newPeak = Math.max(startingBalance, prevPeak, equity);
  const drawdownPercent =
    equity < newPeak
      ? Number((((newPeak - equity) / newPeak) * 100).toFixed(2))
      : 0;

  const today = new Date().toISOString().slice(0, 10);
  const lastSyncDay = account.last_synced_at
    ? account.last_synced_at.slice(0, 10)
    : null;
  const isNewDay = lastSyncDay !== today;

  const { error: snapErr } = await supabaseAdmin
    .from("account_snapshots")
    .insert({
      trader_account_id: account_id,
      equity,
      balance,
      profit,
      drawdown_percent: drawdownPercent,
    });

  if (snapErr) {
    return Response.json({ error: snapErr.message }, { status: 500 });
  }

  const { data: updatedAccount, error: updateErr } = await supabaseAdmin
    .from("trader_accounts")
    .update({
      last_synced_at: new Date().toISOString(),
      peak_equity: newPeak,
      trading_days: isNewDay
        ? (account.trading_days ?? 0) + 1
        : account.trading_days ?? 0,
    })
    .eq("id", account_id)
    .select("status, breach_reason")
    .single();

  if (updateErr) {
    return Response.json({ error: updateErr.message }, { status: 500 });
  }

  if (updatedAccount.status === "breached") {
    try {
      await sendEventEmail({
        type: "breached",
        accountId: account_id,
        reason: updatedAccount.breach_reason ?? "Maximum drawdown exceeded",
      });
    } catch (emailErr) {
      console.error("[sync-equity-v2] Breach email failed:", emailErr);
    }
  }

  // Forward scalping violations to the handler endpoint
  if (scalping_violations?.length > 0) {
    const scalingUrl = new URL(request.url);
    scalingUrl.pathname = "/api/public/cron/handle-scalping";
    fetch(scalingUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cron-secret": process.env.CRON_SECRET ?? "",
      },
      body: JSON.stringify({
        account_id,
        mt5_login,
        violations: scalping_violations,
      }),
    }).catch((e) => console.error("[sync-equity-v2] scalping forward failed:", e));
  }

  return Response.json({
    ok: true,
    account_id,
    drawdown_percent: drawdownPercent,
    status: updatedAccount.status,
  });
}
