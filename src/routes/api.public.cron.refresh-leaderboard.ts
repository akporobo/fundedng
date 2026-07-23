import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/cron/refresh-leaderboard")({
  server: {
    handlers: {
      POST: async () => refreshLeaderboard(),
      GET: async () => refreshLeaderboard(),
    },
  },
});

async function refreshLeaderboard() {
  const { data: accounts } = await supabaseAdmin
    .from("trader_accounts")
    .select(`
      id, user_id, starting_balance, currency, status,
      current_phase, trading_days,
      challenges(name),
      profiles!inner(full_name)
    `)
    .in("status", ["active", "funded"]);

  if (!accounts?.length) {
    return Response.json({ ok: true, updated: 0 });
  }

  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();

  let updated = 0;

  for (const acct of accounts) {
    const profile = acct.profiles as any;
    const fullName = profile?.full_name ?? "Trader";
    const startingBalance = Number(acct.starting_balance);
    const isUSD = acct.currency === "USD";

    // Monthly profit from closed_trades
    const { data: monthlyTrades } = await supabaseAdmin
      .from("closed_trades")
      .select("profit")
      .eq("account_id", acct.id)
      .gte("close_time", monthStart);

    const monthlyProfit = (monthlyTrades ?? [])
      .reduce((sum, t) => sum + Number(t.profit ?? 0), 0);

    console.log(`[leaderboard] ${acct.id} monthly trades: ${monthlyTrades?.length ?? 0}, profit: ${monthlyProfit}`);

    const monthlyProfitPercent = startingBalance > 0
      ? (monthlyProfit / startingBalance) * 100 : 0;

    // Total return from latest account snapshot
    const { data: latestSnapshot } = await supabaseAdmin
      .from("account_snapshots")
      .select("profit")
      .eq("trader_account_id", acct.id)
      .order("snapshot_time", { ascending: false })
      .limit(1)
      .maybeSingle();

    const totalReturnPercent = startingBalance > 0
      ? (Number((latestSnapshot as any)?.profit ?? 0) / startingBalance) * 100 : 0;

    // Total paid payouts
    const { data: payoutData } = await supabaseAdmin
      .from("payouts")
      .select("amount_naira")
      .eq("trader_account_id", acct.id)
      .eq("status", "paid");

    let totalPayouts = 0;
    if (isUSD && payoutData?.length) {
      const { data: rateData } = await supabaseAdmin
        .from("app_config").select("value").eq("key", "usd_exchange_rate").single();
      const rate = Number(rateData?.value ?? 1550);
      totalPayouts = (payoutData ?? [])
        .reduce((sum, p) => sum + Number(p.amount_naira) / rate, 0);
    } else {
      totalPayouts = (payoutData ?? [])
        .reduce((sum, p) => sum + Number(p.amount_naira), 0);
    }

    const avatarInitials = fullName
      .split(" ").slice(0, 2)
      .map((w: string) => w[0]?.toUpperCase() ?? "").join("");

    await supabaseAdmin.from("leaderboard_cache").upsert({
      user_id: acct.user_id,
      account_id: acct.id,
      anonymized_name: fullName,
      avatar_initials: avatarInitials,
      challenge_name: (acct.challenges as any)?.name ?? "",
      currency: acct.currency ?? "NGN",
      starting_balance: startingBalance,
      monthly_profit: Math.round(monthlyProfit * 100) / 100,
      monthly_profit_percent: Math.round(monthlyProfitPercent * 100) / 100,
      total_return_percent: Math.round(totalReturnPercent * 100) / 100,
      total_payouts: Math.round(totalPayouts * 100) / 100,
      payout_count: payoutData?.length ?? 0,
      status: acct.status,
      current_phase: acct.current_phase,
      trading_days: acct.trading_days ?? 0,
      last_updated_at: new Date().toISOString(),
    } as never, { onConflict: "account_id" });

    updated++;
  }

  return Response.json({ ok: true, updated });
}
