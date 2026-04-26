import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PublicHeader } from "@/components/site/PublicHeader";
import { Brand } from "@/components/site/Brand";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { formatNaira } from "@/lib/utils";
import { Check, Zap, ShieldCheck, Trophy, ArrowRight, Clock } from "lucide-react";
import tradingChartHero from "@/assets/trading-chart-hero.jpg";
import tradingChartHeroDark from "@/assets/trading-chart-hero-dark.jpg";

export const Route = createFileRoute("/")({ component: Index });

interface Challenge {
  id: string; name: string; account_size: number; price_naira: number;
  profit_target_percent: number; max_drawdown_percent: number; phases: number;
}

function Index() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    // If running as installed PWA, send the user straight to the dashboard.
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(display-mode: standalone)").matches
    ) {
      window.location.replace("/dashboard");
      return;
    }
    supabase.from("challenges").select("*").eq("is_active", true).order("account_size")
      .then(({ data }) => setChallenges((data as Challenge[]) ?? []));
  }, []);

  return (
    <div className="min-h-screen">
      <PublicHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={tradingChartHero}
          alt="Live trading candlestick chart with upward trend"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-60 dark:hidden"
        />
        <img
          src={tradingChartHeroDark}
          alt=""
          aria-hidden="true"
          width={1920}
          height={1080}
          className="absolute inset-0 hidden h-full w-full object-cover opacity-80 dark:block"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="absolute inset-0 gradient-radial-primary opacity-40" />
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center md:px-6 md:py-32">
          <div className="font-display mb-6 text-xs tracking-[0.4em] text-primary opacity-80">
            NIGERIA'S PROP TRADING FIRM
          </div>
          <h1 className="font-display text-4xl font-bold leading-[1.05] md:text-7xl lg:text-8xl">
            Trade Big.
            <br />
            <span className="text-primary text-glow">Get Paid.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base font-display tracking-wide text-primary md:text-lg">
            The Best Prop-Firm for 9ja traders wey sabi
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            Pass two phases. Get funded. Withdraw 24 hours after your 7-day payout
            window opens — no wahala.
          </p>

          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-6 md:grid-cols-4">
            {[["24h","Payouts"],["80%","Profit Split"],["3","Simple Rules"],["₦2M","Max Funding"]].map(([v,l]) => (
              <div key={l}>
                <div className="font-display text-3xl font-bold text-primary">{v}</div>
                <div className="mt-1 text-xs text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/buy">
              <Button size="lg" className="font-display animate-pulse-glow">
                Start Challenge <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button size="lg" variant="outline">Create Account</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center md:px-6">
          <Badge variant="outline" className="font-display border-primary/40 text-primary">THE RULES</Badge>
          <h2 className="font-display mt-4 text-4xl font-bold">Just 3 Rules. That's It.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { num: "01", title: "20% Max Drawdown", desc: "Don't lose more than 20% of your starting balance. No daily loss limit.", icon: ShieldCheck },
              { num: "02", title: "Trade Every 7 Days", desc: "Place at least one trade within every 7-day window to keep your account active.", icon: Zap },
              { num: "03", title: "Min 3-Minute Trade Duration", desc: "All manually closed trades must be held for at least 3 minutes. Stop-loss and take-profit hits are fully exempt from this rule.", icon: Clock },
            ].map((r) => (
              <div key={r.num} className="rounded-xl border border-border bg-card p-8 text-left transition-colors hover:border-primary/40">
                <div className="flex items-start justify-between">
                  <div className="font-display text-5xl font-bold text-primary/30">{r.num}</div>
                  <r.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">{r.title}</h3>
                <p className="mt-2 text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/rules">
              <Button variant="outline" size="lg" className="font-display">
                Read the full rulebook <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <div className="text-center">
            <Badge variant="outline" className="font-display border-primary/40 text-primary">PRICING</Badge>
            <h2 className="font-display mt-4 text-4xl font-bold">Choose Your Account</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {(challenges.length ? challenges : [
              { id:"1", name:"Starter", account_size:200000, price_naira:7500, profit_target_percent:10, max_drawdown_percent:20, phases:2 },
              { id:"2", name:"Growth", account_size:500000, price_naira:17500, profit_target_percent:10, max_drawdown_percent:20, phases:2 },
              { id:"3", name:"Pro", account_size:1000000, price_naira:32000, profit_target_percent:10, max_drawdown_percent:20, phases:2 },
              { id:"4", name:"Elite", account_size:2000000, price_naira:60000, profit_target_percent:10, max_drawdown_percent:20, phases:2 },
            ]).map((c, i) => (
              <div key={c.id} className={`relative rounded-xl border bg-card p-8 ${i===1 ? "border-primary glow-primary" : "border-border"}`}>
                {i===1 && (
                  <div className="font-display absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-wider text-primary-foreground">
                    POPULAR
                  </div>
                )}
                <div className="font-display text-xs tracking-[0.2em] text-muted-foreground">{c.name.toUpperCase()}</div>
                <div className="font-display mt-2 text-4xl font-bold text-primary">{formatNaira(c.account_size)}</div>
                <div className="text-sm text-muted-foreground">account size</div>
                <div className="mt-6 space-y-2 border-t border-border pt-6">
                  {[`${c.profit_target_percent}% profit target per phase`,`${c.max_drawdown_percent}% max drawdown`,`${c.phases} phases to funded`,"Payouts within 24 hrs of approval","80% profit split"].map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" /> {f}
                    </div>
                  ))}
                </div>
                <Link to="/buy" search={{ challenge: c.id }} className="mt-6 block">
                  <Button className="w-full font-display" variant={i===1 ? "default" : "outline"}>
                    Start for {formatNaira(c.price_naira)}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-6">
          <Trophy className="mx-auto h-12 w-12 text-primary" />
          <h2 className="font-display mt-6 text-4xl font-bold">Ready to get funded?</h2>
          <p className="mt-3 text-muted-foreground">Join hundreds of Nigerian traders earning real payouts.</p>
          <Link to="/buy" className="mt-8 inline-block">
            <Button size="lg" className="font-display">Start Now <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 text-center md:px-6">
        <Brand />
        <p className="mx-auto mt-4 max-w-2xl text-xs text-muted-foreground">
          FundedNG is a proprietary trading evaluation platform. Challenge fees
          fund operational costs. All evaluations run on simulated MT5 accounts —
          you trade real-market prices but no real-money risk. Past performance
          does not guarantee future results.
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
          <Link to="/rules" className="text-muted-foreground hover:text-primary">Rules</Link>
          <Link to="/agreement" className="text-muted-foreground hover:text-primary">Agreement & Risk</Link>
        </div>
        <div className="mt-4 text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} FundedNG. All rights reserved.
        </div>
      </footer>

      <PWAInstallButton />
    </div>
  );
}
