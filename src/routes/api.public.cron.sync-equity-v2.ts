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
    fetcher_only?: boolean;
    open_positions?: Array<{
      ticket: number;
      symbol: string;
      open_time: number;
      volume: number;
      profit: number;
      price_open: number;
      type: string;
    }>;
    closed_deals?: Array<{
      ticket: number;
      symbol: string;
      open_time: number;
      close_time: number;
      duration_seconds: number;
      profit: number;
      volume: number;
      close_price?: number;
      type?: string;
    }>;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { account_id, mt5_login, equity, balance, profit, scalping_violations, news_violations, weekend_violations, closed_deals, fetcher_only, open_positions } = body;

  // Trades fetcher path — skip equity/drawdown/peak, only sync trade data
  if (fetcher_only === true) {
    if (closed_deals?.length) {
      await supabaseAdmin
        .from("closed_trades")
        .upsert(
          closed_deals.map((d: any) => ({
            account_id:       account_id,
            ticket:           d.ticket,
            symbol:           d.symbol,
            open_time:        new Date(d.open_time * 1000).toISOString(),
            close_time:       new Date(d.close_time * 1000).toISOString(),
            duration_seconds: d.duration_seconds,
            profit:           d.profit,
            volume:           d.volume,
            close_price:      d.close_price ?? null,
            type:             d.type ?? null,
          })),
          { onConflict: "account_id,ticket", ignoreDuplicates: true }
        );
    }

    if (open_positions !== undefined) {
      await supabaseAdmin
        .from("open_positions")
        .delete()
        .eq("account_id", account_id);

      if (open_positions.length > 0) {
        await supabaseAdmin
          .from("open_positions")
          .insert(
            open_positions.map((p: any) => ({
              account_id:  account_id,
              ticket:      p.ticket,
              symbol:      p.symbol,
              open_time:   new Date(p.open_time * 1000).toISOString(),
              volume:      p.volume,
              profit:      p.profit,
              price_open:  p.price_open,
              type:        p.type,
            }))
          );
      }
    }

    const { data: fetcherAccount } = await supabaseAdmin
      .from("trader_accounts")
      .select("current_phase, phase1_passed_at, created_at")
      .eq("id", account_id)
      .single();

    if (fetcherAccount) {
      const phaseStart = fetcherAccount.current_phase >= 2 && fetcherAccount.phase1_passed_at
        ? fetcherAccount.phase1_passed_at
        : fetcherAccount.created_at;

      const { data: closeData } = await supabaseAdmin
        .from("closed_trades")
        .select("close_time")
        .eq("account_id", account_id)
        .gte("close_time", phaseStart)
        .limit(10000);

      const uniqueDays = new Set(
        (closeData ?? []).map((r: any) => r.close_time.slice(0, 10))
      );

      await supabaseAdmin
        .from("trader_accounts")
        .update({ trading_days: uniqueDays.size })
        .eq("id", account_id);
    }

    if (scalping_violations?.length > 0) {
      const scalingUrl = new URL(request.url);
      scalingUrl.pathname = "/api/public/cron/handle-scalping";
      await fetch(scalingUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "x-cron-secret": process.env.CRON_SECRET ?? "",
        },
        body: JSON.stringify({
          account_id,
          mt5_login,
          violations: scalping_violations,
        }),
      });
    }

    return Response.json({ ok: true, fetcher_only: true });
  }

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

  // If peak_equity in DB equals starting_balance exactly, this account was just
  // phase-reset. Don't let incoming equity (which may still reflect old phase
  // profits) inflate the peak. Only allow equity to raise peak once balance
  // also confirms the reset (i.e. balance close to starting_balance).
  const justReset = Math.abs(prevPeak - startingBalance) < 1;
  const balanceIsReset = Math.abs(balance - startingBalance) < startingBalance * 0.02;

  let newPeak: number;
  if (justReset && !balanceIsReset) {
    newPeak = startingBalance;
  } else {
    newPeak = Math.max(startingBalance, prevPeak, equity);
  }

  const drawdownPercent =
    equity < newPeak
      ? Number((((newPeak - equity) / newPeak) * 100).toFixed(2))
      : 0;

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

  return Response.json({
    ok: true,
    account_id,
    drawdown_percent: drawdownPercent,
    status: updatedAccount.status,
  });
}
