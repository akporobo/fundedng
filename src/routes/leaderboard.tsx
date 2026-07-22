import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PublicHeader } from "@/components/site/PublicHeader";
import { Brand } from "@/components/site/Brand";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface LeaderboardEntry {
  anonymized_name: string;
  avatar_initials: string;
  challenge_name: string;
  currency: string;
  starting_balance: number;
  monthly_profit: number;
  monthly_profit_percent: number;
  payout_count: number;
}

interface ActivityEvent {
  id: string;
  event_type: "payout_paid" | "phase2_approved" | "funded_approved";
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

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [newActivityId, setNewActivityId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from("leaderboard_cache")
        .select("anonymized_name, avatar_initials, challenge_name, currency, starting_balance, monthly_profit, monthly_profit_percent, payout_count")
        .order("monthly_profit", { ascending: false })
        .limit(10),
      supabase.from("live_activity")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20),
    ]).then(([lbResult, actResult]) => {
      if (lbResult.data) setLeaderboard(lbResult.data);
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
          .select("anonymized_name, avatar_initials, challenge_name, currency, starting_balance, monthly_profit, monthly_profit_percent, payout_count")
          .order("monthly_profit", { ascending: false })
          .limit(10)
          .then(({ data }) => { if (data) setLeaderboard(data); });
      })
      .subscribe();

    const actChannel = supabase
      .channel("live-activity-public")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "live_activity",
      }, (payload) => {
        setActivity(prev => [payload.new as any, ...prev].slice(0, 20));
        setNewActivityId((payload.new as any).id);
        setTimeout(() => setNewActivityId(null), 3000);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(lbChannel);
      supabase.removeChannel(actChannel);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <PublicHeader />

      {/* Top 10 Leaderboard */}
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
            <h1 className="font-display text-3xl font-bold md:text-4xl">Top 10 Traders This Month</h1>
          </div>

          {leaderboard.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm">
              No traders on the leaderboard yet. Be the first to opt in from your dashboard.
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((trader, i) => (
                <div key={i} className={`flex items-center gap-4 rounded-xl border bg-card p-4 ${
                  i === 0 ? "border-yellow-500/30 bg-yellow-500/5" :
                  i === 1 ? "border-gray-400/30" :
                  i === 2 ? "border-amber-700/30" : "border-border"
                }`}>
                  <div className="w-8 text-center font-display font-bold text-lg text-muted-foreground shrink-0">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </div>

                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-display font-bold text-primary text-sm shrink-0">
                    {trader.avatar_initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold truncate">{trader.anonymized_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {trader.challenge_name} ·{" "}
                      {trader.currency === "USD"
                        ? `$${Number(trader.starting_balance).toLocaleString()}`
                        : `₦${Number(trader.starting_balance).toLocaleString()}`}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={`font-display font-bold ${trader.monthly_profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {trader.currency === "USD"
                        ? `$${Math.abs(trader.monthly_profit).toLocaleString()}`
                        : `₦${Math.abs(trader.monthly_profit).toLocaleString()}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {trader.monthly_profit_percent >= 0 ? "+" : ""}{trader.monthly_profit_percent.toFixed(1)}% this month
                    </p>
                  </div>

                  {trader.payout_count > 0 && (
                    <div className="shrink-0">
                      <span className="text-xs bg-primary/20 text-primary rounded-full px-2 py-0.5 font-medium">
                        {trader.payout_count} payout{trader.payout_count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Live Activity Feed */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
          <div className="flex items-center gap-2 mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              LIVE
            </span>
            <h2 className="font-display text-2xl font-bold">Recent Activity</h2>
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
                    label: "received a payout",
                    value: event.currency === "USD"
                      ? `$${Number(event.amount).toFixed(2)}`
                      : `₦${Number(event.amount).toLocaleString()}`,
                  },
                  phase2_approved: {
                    emoji: "🎯",
                    color: "text-blue-400",
                    bgColor: "bg-blue-400/10 border-blue-400/20",
                    label: "advanced to Phase 2",
                    value: event.currency === "USD"
                      ? `$${Number(event.account_size).toLocaleString()} account`
                      : `₦${Number(event.account_size).toLocaleString()} account`,
                  },
                  funded_approved: {
                    emoji: "🏆",
                    color: "text-yellow-400",
                    bgColor: "bg-yellow-400/10 border-yellow-400/20",
                    label: "became a funded trader",
                    value: event.currency === "USD"
                      ? `$${Number(event.account_size).toLocaleString()} account`
                      : `₦${Number(event.account_size).toLocaleString()} account`,
                  },
                }[event.event_type] ?? null;

                if (!eventConfig) return null;

                return (
                  <div
                    key={event.id}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition-all duration-500 ${
                      isNew
                        ? "border-primary/40 bg-primary/10 scale-[1.01]"
                        : `${eventConfig.bgColor}`
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-card flex items-center justify-center font-display font-bold text-sm shrink-0 border border-border">
                      {event.avatar_initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold">{event.anonymized_name}</span>
                        {" "}<span className="text-muted-foreground">{eventConfig.label}</span>
                      </p>
                      <p className={`text-xs font-medium ${eventConfig.color}`}>
                        {eventConfig.emoji} {eventConfig.value}
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
