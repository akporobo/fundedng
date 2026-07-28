import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PublicHeader } from "@/components/site/PublicHeader";
import { Brand } from "@/components/site/Brand";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown, Medal, ArrowRight } from "lucide-react";

interface LeaderboardEntry {
  user_id: string;
  anonymized_name: string;
  avatar_initials: string;
  challenge_name: string;
  currency: string;
  starting_balance: number;
  monthly_profit: number;
  monthly_profit_percent: number;
  total_payouts: number;
  payout_count: number;
}

interface ManualLeaderboardEntry {
  id: string;
  trader_name: string;
  avatar_initials: string;
  challenge_name: string;
  account_size: number;
  profit_percent: number;
  profit_amount: number;
  total_profit: number;
  currency: string;
}

interface MergedLeaderboardEntry {
  source: "auto" | "manual";
  name: string;
  initials: string;
  challenge: string;
  currency: string;
  profitAmount: number;
  profitPercent: number;
  totalProfit: number;
  startingBalance?: number;
  payoutCount?: number;
  totalPayouts?: number;
  userId?: string;
}

interface ActivityEvent {
  id: string;
  event_type: "payout_paid" | "phase2_approved" | "funded_approved" | "phase1_to_phase2" | "phase2_to_funded" | "payout_approved";
  anonymized_name: string;
  avatar_initials: string;
  challenge_name: string;
  currency: string;
  amount: number | null;
  account_size: number | null;
  created_at: string;
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function currSym(c: string) { return c === "USD" ? "$" : "₦"; }
function fmtAmt(c: string, v: number) { return `${currSym(c)}${Math.abs(v).toLocaleString()}`; }

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [manualEntries, setManualEntries] = useState<ManualLeaderboardEntry[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [newActivityId, setNewActivityId] = useState<string | null>(null);
  const [totalPayouts, setTotalPayouts] = useState<number>(0);

  const BASE_PAYOUT_NGN = 27_890_350;

  const mergedLeaderboard = useMemo(() => {
    const autoEntries: MergedLeaderboardEntry[] = leaderboard.map((t) => ({
      source: "auto" as const,
      name: t.anonymized_name,
      initials: t.avatar_initials,
      challenge: t.challenge_name,
      currency: t.currency,
      profitAmount: t.monthly_profit,
      profitPercent: t.monthly_profit_percent,
      totalProfit: t.total_payouts,
      startingBalance: t.starting_balance,
      payoutCount: t.payout_count,
      totalPayouts: t.total_payouts,
      userId: t.user_id,
    }));
    const manualMapped: MergedLeaderboardEntry[] = manualEntries.map((m) => ({
      source: "manual" as const,
      name: m.trader_name,
      initials: m.avatar_initials,
      challenge: m.challenge_name,
      currency: m.currency,
      profitAmount: m.profit_amount,
      profitPercent: m.profit_percent,
      totalProfit: m.total_profit,
      startingBalance: m.account_size,
    }));
    const combined = [...autoEntries, ...manualMapped];
    combined.sort((a, b) => b.profitAmount - a.profitAmount);
    return combined;
  }, [leaderboard, manualEntries]);

  const topTen = mergedLeaderboard.slice(0, 10);
  const podium = topTen.slice(0, 3);

  const userRank = useMemo(() => {
    if (!user) return null;
    const idx = mergedLeaderboard.findIndex((e) => e.userId === user.id);
    if (idx < 0) return null;
    return idx + 1;
  }, [user, mergedLeaderboard]);

  const userEntry = useMemo(() => {
    if (!user) return null;
    return mergedLeaderboard.find((e) => e.userId === user.id) ?? null;
  }, [user, mergedLeaderboard]);

  const userInTopTen = userRank !== null && userRank <= 10;

  useEffect(() => {
    async function fetchTotalPayouts() {
      const { data: payoutData } = await supabase
        .from("payouts")
        .select("amount_naira, currency")
        .eq("status", "paid");
      const { data: manualData } = await supabase
        .from("live_activity")
        .select("amount, metadata")
        .eq("event_type", "payout_approved");
      let total = BASE_PAYOUT_NGN;
      for (const p of payoutData ?? []) {
        total += p.currency === "USD" ? Number(p.amount_naira) / 1550 : Number(p.amount_naira);
      }
      for (const m of manualData ?? []) {
        const metaAmt = (m.metadata as any)?.payout_amount;
        total += Number(metaAmt ?? m.amount ?? 0);
      }
      setTotalPayouts(total);
    }

    fetchTotalPayouts();

    Promise.all([
      supabase.from("leaderboard_cache")
        .select("anonymized_name, avatar_initials, challenge_name, currency, starting_balance, monthly_profit, monthly_profit_percent, total_payouts, payout_count, user_id")
        .order("monthly_profit", { ascending: false }),
      supabase.from("manual_leaderboard")
        .select("id, trader_name, avatar_initials, challenge_name, account_size, profit_percent, profit_amount, total_profit, currency")
        .order("profit_amount", { ascending: false }),
      supabase.from("live_activity")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20),
    ]).then(([lbResult, manualResult, actResult]) => {
      if (lbResult.data) setLeaderboard(lbResult.data);
      if (manualResult.data) setManualEntries(manualResult.data);
      if (actResult.data) setActivity(actResult.data as ActivityEvent[]);
    });

    const lbChannel = supabase
      .channel("leaderboard-public")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "leaderboard_cache",
      }, () => {
        supabase.from("leaderboard_cache")
          .select("anonymized_name, avatar_initials, challenge_name, currency, starting_balance, monthly_profit, monthly_profit_percent, total_payouts, payout_count, user_id")
          .order("monthly_profit", { ascending: false })
          .then(({ data }) => { if (data) setLeaderboard(data); });
      })
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "manual_leaderboard",
      }, () => {
        supabase.from("manual_leaderboard")
          .select("id, trader_name, avatar_initials, challenge_name, account_size, profit_percent, profit_amount, total_profit, currency")
          .order("profit_amount", { ascending: false })
          .then(({ data }) => { if (data) setManualEntries(data); });
      })
      .subscribe();

    const actChannel = supabase
      .channel("live-activity-public")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "live_activity",
      }, (payload) => {
        const newRow = payload.new as any;
        setActivity(prev => [newRow, ...prev].slice(0, 20));
        setNewActivityId(newRow.id);
        setTimeout(() => setNewActivityId(null), 3000);
        if (newRow.event_type === "payout_approved") {
          const metaAmt = newRow.metadata?.payout_amount;
          const amt = Number(metaAmt ?? newRow.amount ?? 0);
          if (amt > 0) setTotalPayouts(prev => prev + amt);
        }
      })
      .subscribe();

    const payoutChannel = supabase
      .channel("payout-total-public")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "payouts",
      }, () => {
        supabase
          .from("payouts")
          .select("amount_naira, currency")
          .eq("status", "paid")
          .then(({ data }) => {
            if (!data) return;
            let realTotal = 0;
            for (const p of data) {
              realTotal += p.currency === "USD" ? Number(p.amount_naira) / 1550 : Number(p.amount_naira);
            }
            supabase
              .from("live_activity")
              .select("amount, metadata")
              .eq("event_type", "payout_approved")
              .then(({ data: manualData }) => {
                let manualTotal = 0;
                for (const m of manualData ?? []) {
                  const metaAmt = (m.metadata as any)?.payout_amount;
                  manualTotal += Number(metaAmt ?? m.amount ?? 0);
                }
                setTotalPayouts(BASE_PAYOUT_NGN + realTotal + manualTotal);
              });
          });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(lbChannel);
      supabase.removeChannel(actChannel);
      supabase.removeChannel(payoutChannel);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <PublicHeader />

      {/* ── Leaderboard Section ─────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 pt-12 pb-16 md:px-6">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                LIVE
              </span>
              <span className="text-xs text-muted-foreground">Updated every 15 min</span>
            </div>
            <h1 className="font-display text-3xl font-bold md:text-4xl">Traders This Month</h1>
          </div>

          {/* ── Your Ranking Card ──────────────────────────────────── */}
          {user && (
            <div className="mb-8 rounded-xl border border-primary/30 bg-primary/5 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center font-display font-bold text-primary text-sm shrink-0">
                    {userEntry?.initials ?? user.email?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary uppercase tracking-wider">Your Ranking</p>
                    {userEntry ? (
                      <p className="font-display text-lg font-bold">
                        #{userRank} · {userEntry.name}
                      </p>
                    ) : (
                      <p className="font-display text-lg font-bold text-muted-foreground">Not ranked yet</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  {userEntry && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">This Month</p>
                      <p className={`font-display font-bold ${userEntry.profitAmount >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {userEntry.profitAmount >= 0 ? "+" : "-"}{fmtAmt(userEntry.currency, userEntry.profitAmount)}
                      </p>
                    </div>
                  )}
                  {!userEntry && (
                    <Link to="/dashboard">
                      <Button size="sm" className="font-display">
                        Opt in from dashboard <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {topTen.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm">
              No traders on the leaderboard yet. Be the first to opt in from your dashboard.
            </div>
          ) : (
            <>
              {/* ── Podium (Top 3) ─────────────────────────────────── */}
              {podium.length >= 3 && (
                <div className="mb-10 flex flex-col sm:flex-row items-center sm:items-end justify-center gap-4 sm:gap-3">
                  {/* #2 */}
                  <PodiumCard entry={podium[1]} rank={2} />
                  {/* #1 */}
                  <PodiumCard entry={podium[0]} rank={1} />
                  {/* #3 */}
                  <PodiumCard entry={podium[2]} rank={3} />
                </div>
              )}

              {/* ── All Rankings ───────────────────────────────────── */}
              <div className="mb-2">
                <h2 className="font-display text-lg font-bold text-muted-foreground mb-4">All Rankings</h2>
                <div className="space-y-2">
                  {topTen.map((entry, i) => {
                    const isUser = user && entry.userId === user.id;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-3 sm:gap-4 rounded-xl border p-3 sm:p-4 transition-colors ${
                          isUser
                            ? "border-primary/50 bg-primary/5"
                            : i === 0 ? "border-yellow-500/30 bg-yellow-500/5"
                            : i === 1 ? "border-gray-400/20 bg-gray-400/5"
                            : i === 2 ? "border-amber-700/20 bg-amber-700/5"
                            : "border-border bg-card"
                        }`}
                      >
                        <div className="w-7 sm:w-8 text-center font-display font-bold text-sm sm:text-lg text-muted-foreground shrink-0">
                          {i === 0 ? <Crown className="h-5 w-5 text-yellow-500 mx-auto" /> :
                           i === 1 ? <Medal className="h-5 w-5 text-gray-400 mx-auto" /> :
                           i === 2 ? <Medal className="h-5 w-5 text-amber-600 mx-auto" /> :
                           `#${i + 1}`}
                        </div>

                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center font-display font-bold text-primary text-xs sm:text-sm shrink-0">
                          {entry.initials}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-display font-semibold truncate text-sm sm:text-base">
                            {entry.name}{isUser && <span className="ml-1.5 text-xs text-primary font-normal">(You)</span>}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {entry.challenge}
                            {entry.payoutCount && entry.payoutCount > 0 && (
                              <span className="ml-1">· {entry.payoutCount} payout{entry.payoutCount !== 1 ? "s" : ""}</span>
                            )}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className={`font-display font-bold text-sm sm:text-base ${entry.profitAmount >= 0 ? "text-green-400" : "text-red-400"}`}>
                            {entry.profitAmount >= 0 ? "+" : "-"}{fmtAmt(entry.currency, entry.profitAmount)}
                          </p>
                          {(entry.totalPayouts ?? 0) > 0 && (
                            <p className="text-xs text-muted-foreground">
                              {fmtAmt(entry.currency, entry.totalPayouts!)} paid
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Your Row (if not in top 10) ──────────────────────── */}
              {user && !userInTopTen && userEntry && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">⋯</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 rounded-xl border-2 border-primary/40 bg-primary/5 p-3 sm:p-4">
                    <div className="w-7 sm:w-8 text-center font-display font-bold text-sm sm:text-lg text-primary shrink-0">
                      #{userRank}
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center font-display font-bold text-primary text-xs sm:text-sm shrink-0">
                      {userEntry.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold truncate text-sm sm:text-base">
                        {userEntry.name}<span className="ml-1.5 text-xs text-primary font-normal">(You)</span>
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{userEntry.challenge}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`font-display font-bold text-sm sm:text-base ${userEntry.profitAmount >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {userEntry.profitAmount >= 0 ? "+" : "-"}{fmtAmt(userEntry.currency, userEntry.profitAmount)}
                      </p>
                      {(userEntry.totalPayouts ?? 0) > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {fmtAmt(userEntry.currency, userEntry.totalPayouts!)} paid
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Live Activity Feed ──────────────────────────────────────── */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
          <div className="flex items-center gap-2 mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              LIVE
            </span>
            <h2 className="font-display text-2xl font-bold">Recent Activity</h2>
          </div>

          <div className="mb-8 rounded-xl border border-green-400/20 bg-green-400/5 p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Payouts</p>
            <p className="font-display text-3xl font-bold text-green-400">
              ₦{totalPayouts.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Paid out to funded traders</p>
          </div>

          {activity.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Activity will appear here as traders get funded and paid.
            </div>
          ) : (
            <div className="space-y-2">
              {activity.map((event) => {
                const isNew = event.id === newActivityId;
                const timeAgo = formatTimeAgo(new Date(event.created_at));

                const eventConfig = {
                  payout_paid: {
                    emoji: "💰",
                    color: "text-green-400",
                    bgColor: "bg-green-400/10 border-green-400/20",
                    glowRgb: "52,211,153",
                    label: "received a payout",
                    value: event.currency === "USD"
                      ? `$${Number(event.amount).toFixed(2)}`
                      : `₦${Number(event.amount).toLocaleString()}`,
                  },
                  phase2_approved: {
                    emoji: "🎯",
                    color: "text-blue-400",
                    bgColor: "bg-blue-400/10 border-blue-400/20",
                    glowRgb: "96,165,250",
                    label: "advanced to Phase 2",
                    value: event.currency === "USD"
                      ? `$${Number(event.account_size).toLocaleString()} account`
                      : `₦${Number(event.account_size).toLocaleString()} account`,
                  },
                  funded_approved: {
                    emoji: "🏆",
                    color: "text-yellow-400",
                    bgColor: "bg-yellow-400/10 border-yellow-400/20",
                    glowRgb: "250,204,21",
                    label: "became a funded trader",
                    value: event.currency === "USD"
                      ? `$${Number(event.account_size).toLocaleString()} account`
                      : `₦${Number(event.account_size).toLocaleString()} account`,
                  },
                  phase1_to_phase2: {
                    emoji: "🎯",
                    color: "text-blue-400",
                    bgColor: "bg-blue-400/10 border-blue-400/20",
                    glowRgb: "96,165,250",
                    label: "advanced to Phase 2",
                    value: `₦${Number(event.account_size).toLocaleString()} account`,
                  },
                  phase2_to_funded: {
                    emoji: "🏆",
                    color: "text-yellow-400",
                    bgColor: "bg-yellow-400/10 border-yellow-400/20",
                    glowRgb: "250,204,21",
                    label: "became a funded trader",
                    value: `₦${Number(event.account_size).toLocaleString()} account`,
                  },
                  payout_approved: {
                    emoji: "💰",
                    color: "text-green-400",
                    bgColor: "bg-green-400/10 border-green-400/20",
                    glowRgb: "52,211,153",
                    label: "received a payout",
                    value: `₦${Number(event.amount).toLocaleString()}`,
                  },
                }[event.event_type] ?? null;

                if (!eventConfig) return null;

                return (
                  <div
                    key={event.id}
                    className={`activity-card flex items-center gap-3 rounded-xl border p-3 ${
                      isNew ? "activity-new" : ""
                    } ${eventConfig.bgColor}`}
                    style={{
                      animation: isNew ? "slide-in-3d 0.6s cubic-bezier(0.23,1,0.32,1) forwards" : undefined,
                      perspective: "800px",
                    }}
                  >
                    <div className="relative shrink-0">
                      <div
                        className="w-9 h-9 rounded-full bg-card flex items-center justify-center font-display font-bold text-sm border border-border"
                        style={{
                          animation: "glow-pulse 2.5s ease-in-out infinite",
                          ["--glow-rgb" as string]: eventConfig.glowRgb,
                        }}
                      >
                        {event.avatar_initials}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 text-xs leading-none">{eventConfig.emoji}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold">{event.anonymized_name}</span>
                        {" "}<span className="text-muted-foreground">{eventConfig.label}</span>
                      </p>
                      <p className={`text-xs font-medium ${eventConfig.color}`}>
                        {eventConfig.value}
                      </p>
                    </div>

                    <div className="text-xs text-muted-foreground shrink-0">
                      {timeAgo}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Activity Animations */}
      <style>{`
        @keyframes slide-in-3d {
          0% {
            opacity: 0;
            transform: perspective(800px) rotateY(-6deg) translateX(50px) scale(0.97);
            box-shadow: 0 0 0 0 rgba(52,211,153,0);
          }
          50% {
            opacity: 1;
            transform: perspective(800px) rotateY(1.5deg) translateX(-4px) scale(1.01);
          }
          100% {
            opacity: 1;
            transform: perspective(800px) rotateY(0deg) translateX(0) scale(1);
            box-shadow: 0 4px 20px -4px rgba(var(--glow-rgb, 52,211,153), 0.25);
          }
        }
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(var(--glow-rgb, 52,211,153), 0);
          }
          50% {
            box-shadow: 0 0 10px 2px rgba(var(--glow-rgb, 52,211,153), 0.35);
          }
        }
        .activity-new {
          border-color: rgba(var(--glow-rgb, 52,211,153), 0.3) !important;
          background: rgba(var(--glow-rgb, 52,211,153), 0.08) !important;
        }
      `}</style>

      {/* CTA */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-6">
          <h2 className="font-display text-3xl font-bold">Think you can make the list?</h2>
          <p className="mt-3 text-muted-foreground">Join FundedNG, pass the challenge, and start earning real payouts.</p>
          <Link to="/buy" className="mt-8 inline-block">
            <Button size="lg" className="font-display">Start Now <ArrowLeft className="ml-2 h-4 w-4 rotate-180" /></Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 text-center md:px-6">
        <Brand />
        <p className="mx-auto mt-4 max-w-2xl text-xs text-muted-foreground">
          FundedNG is a proprietary trading evaluation platform. Challenge fees
          fund operational costs. All evaluations run on FundedNG MT5 evaluation
          accounts — you trade real-market prices in a controlled evaluation
          environment. Past performance does not guarantee future results.
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
          <Link to="/rules" className="text-muted-foreground hover:text-primary">Rules</Link>
          <Link to="/agreement" className="text-muted-foreground hover:text-primary">Agreement & Risk</Link>
        </div>
        <div className="mt-4 text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} FundedNG. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

/* ── Podium Card ────────────────────────────────────────────────────────── */

function PodiumCard({ entry, rank }: { entry: MergedLeaderboardEntry; rank: number }) {
  const is1st = rank === 1;
  return (
    <div className={`flex flex-col items-center w-full sm:w-44 md:w-52 ${
      is1st ? "sm:mb-4" : ""
    }`}>
      <div className={`w-full rounded-xl border p-3 sm:p-4 text-center transition-colors ${
        is1st
          ? "border-yellow-500/40 bg-yellow-500/10 shadow-lg shadow-yellow-500/10"
          : rank === 2
          ? "border-gray-400/30 bg-gray-400/5"
          : "border-amber-600/30 bg-amber-600/5"
      }`}>
        <div className="mb-2">
          {is1st ? (
            <Crown className="h-7 w-7 sm:h-8 sm:w-8 text-yellow-500 mx-auto" />
          ) : rank === 2 ? (
            <Medal className="h-6 w-6 sm:h-7 sm:w-7 text-gray-400 mx-auto" />
          ) : (
            <Medal className="h-6 w-6 sm:h-7 sm:w-7 text-amber-600 mx-auto" />
          )}
        </div>

        <div className={`mx-auto rounded-full bg-primary/20 flex items-center justify-center font-display font-bold text-primary shrink-0 mb-2 ${
          is1st ? "w-14 h-14 text-lg" : "w-11 h-11 text-sm"
        }`}>
          {entry.initials}
        </div>

        <p className="font-display font-semibold text-sm truncate">{entry.name}</p>

        <p className={`font-display font-bold mt-1 ${entry.profitAmount >= 0 ? "text-green-400" : "text-red-400"}`}>
          {entry.profitAmount >= 0 ? "+" : "-"}{fmtAmt(entry.currency, entry.profitAmount)}
        </p>

        {(entry.totalPayouts ?? 0) > 0 && (
          <p className="text-[11px] text-muted-foreground mt-1">
            {fmtAmt(entry.currency, entry.totalPayouts!)} paid
          </p>
        )}
      </div>
      <div className="mt-1 text-xs font-display font-bold text-muted-foreground">
        #{rank}
      </div>
    </div>
  );
}
