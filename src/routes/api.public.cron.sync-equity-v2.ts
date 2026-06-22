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
    news_violations?: Array<{
      symbol: string;
      open_time: number;
      event_title: string;
      event_time: number;
      volume: number;
      ticket: number;
    }>;
    weekend_violations?: Array<{
      symbol: string;
      ticket: number;
      open_time: number;
      volume: number;
    }>;
    closed_deals?: Array<{
      ticket: number;
      symbol: string;
      open_time: number;
      close_time: number;
      duration_seconds: number;
      profit: number;
      volume: number;
    }>;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { account_id, mt5_login, equity, balance, profit, scalping_violations, news_violations, weekend_violations, closed_deals } = body;
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
    .select("id, status, starting_balance, peak_equity, last_synced_at, trading_days, current_phase, phase1_passed_at, created_at")
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

  // Derive trading days from actual closed trades for this phase
  const phaseStart = account.current_phase >= 2 && account.phase1_passed_at
    ? account.phase1_passed_at
    : account.created_at;

  const { data: closeData } = await supabaseAdmin
    .from("closed_trades")
    .select("close_time")
    .eq("account_id", account_id)
    .gte("close_time", phaseStart);

  const uniqueDays = new Set(
    (closeData ?? []).map((r: any) => r.close_time.slice(0, 10))
  );
  const tradingDaysCount = uniqueDays.size;

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
      trading_days: tradingDaysCount,
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
    try {
      const resp = await fetch(scalingUrl.toString(), {
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
      });
      if (!resp.ok) {
        const body = await resp.text().catch(() => "");
        console.error(`[sync-equity-v2] scalping handler returned ${resp.status}: ${body}`);
      }
    } catch (e) {
      console.error("[sync-equity-v2] scalping forward failed:", e);
    }
  }

  // Forward news violations to the handler endpoint
  if (news_violations?.length > 0) {
    const newsUrl = new URL(request.url);
    newsUrl.pathname = "/api/public/cron/handle-news-violation";
    try {
      const resp = await fetch(newsUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cron-secret": process.env.CRON_SECRET ?? "",
        },
        body: JSON.stringify({
          account_id,
          mt5_login,
          violations: news_violations,
        }),
      });
      if (!resp.ok) {
        const body = await resp.text().catch(() => "");
        console.error(`[sync-equity-v2] news handler returned ${resp.status}: ${body}`);
      }
    } catch (e) {
      console.error("[sync-equity-v2] news forward failed:", e);
    }
  }

  // Forward weekend violations to the handler endpoint
  if (weekend_violations?.length > 0) {
    const weekendUrl = new URL(request.url);
    weekendUrl.pathname = "/api/public/cron/handle-weekend-violation";
    try {
      const resp = await fetch(weekendUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cron-secret": process.env.CRON_SECRET ?? "",
        },
        body: JSON.stringify({
          account_id,
          mt5_login,
          violations: weekend_violations,
        }),
      });
      if (!resp.ok) {
        const body = await resp.text().catch(() => "");
        console.error(`[sync-equity-v2] weekend handler returned ${resp.status}: ${body}`);
      }
    } catch (e) {
      console.error("[sync-equity-v2] weekend forward failed:", e);
    }
  }

  // Upsert closed trades for calendar + trading days
  if (closed_deals?.length > 0) {
    await supabaseAdmin
      .from("closed_trades")
      .upsert(
        closed_deals.map((d: any) => ({
          account_id:        account_id,
          ticket:            d.ticket,
          symbol:            d.symbol,
          open_time:         new Date(d.open_time * 1000).toISOString(),
          close_time:        new Date(d.close_time * 1000).toISOString(),
          duration_seconds:  d.duration_seconds,
          profit:            d.profit,
          volume:            d.volume,
        })),
        { onConflict: "account_id,ticket", ignoreDuplicates: true }
      );
  }

  return Response.json({
    ok: true,
    account_id,
    drawdown_percent: drawdownPercent,
    status: updatedAccount.status,
  });
}
