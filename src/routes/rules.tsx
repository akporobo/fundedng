import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicHeader } from "@/components/site/PublicHeader";
import { Brand } from "@/components/site/Brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Zap, ArrowRight, AlertTriangle, Clock, TrendingUp, Wallet, Ban, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/rules")({
  head: () => ({
    meta: [
      { title: "Trading Rules — FundedNG" },
      { name: "description", content: "Full breakdown of FundedNG's prop trading rules: no tick scalping, 20% max drawdown (equity trailing), 3 minimum trading days, profit targets, payouts, and what's allowed." },
      { property: "og:title", content: "Trading Rules — FundedNG" },
      { property: "og:description", content: "Just 3 main rules — no tick scalping, 20% max drawdown (equity trailing), and 3 days minimum trading. See the full rulebook here." },
    ],
  }),
  component: RulesPage,
});

function RulesPage() {
  return (
    <div className="min-h-screen">
      <PublicHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="absolute inset-0 gradient-radial-primary opacity-30" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center md:px-6">
          <Badge variant="outline" className="font-display border-primary/40 text-primary">RULEBOOK</Badge>
          <h1 className="font-display mt-4 text-5xl font-bold leading-tight md:text-6xl">
            Simple, transparent <span className="text-primary text-glow">trading rules</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Just 3 main rules to keep your account alive. Everything else is here for full clarity — no hidden gotchas.
          </p>
        </div>
      </section>

      {/* The 2 main highlight rules */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-6">
          <div className="text-center">
            <Badge variant="outline" className="font-display border-primary/40 text-primary">THE 3 MAIN RULES</Badge>
            <h2 className="font-display mt-4 text-4xl font-bold">Break any one and your account closes.</h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <div className="rounded-xl border-2 border-primary/40 bg-card p-8 glow-primary">
              <div className="flex items-start justify-between">
                <div className="font-display text-6xl font-bold text-primary/30">01</div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display mt-4 text-2xl font-bold">No Tick Scalping</h3>
              <p className="mt-3 text-muted-foreground">
                Closing a trade in less than 3 minutes from open to close is tick scalping and is strictly prohibited.
                All manually closed trades must be held for at least 3 minutes.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Stop-loss and take-profit hits are fully exempt.</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Applies to manual closes only — not server-triggered exits.</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Repeated breaches void the account.</li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-primary/40 bg-card p-8 glow-primary">
              <div className="flex items-start justify-between">
                <div className="font-display text-6xl font-bold text-primary/30">02</div>
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display mt-4 text-2xl font-bold">20% Max Drawdown (Equity Trailing)</h3>
              <p className="mt-3 text-muted-foreground">
                Your equity must never drop more than 20% from the highest equity peak reached (trailing).
                For example, if your account peaks at ₦220,000, equity must stay above ₦176,000.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Measured on floating equity, trailing from the highest peak.</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> No daily loss limit — only the total trailing 20% cap matters.</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Hit it once and the account is closed permanently.</li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-primary/40 bg-card p-8 glow-primary">
              <div className="flex items-start justify-between">
                <div className="font-display text-6xl font-bold text-primary/30">03</div>
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display mt-4 text-2xl font-bold">3 Days Min — 1 Trade/Week</h3>
              <p className="mt-3 text-muted-foreground">
                You need at least 3 trading days to clear a phase and at least 1 executed trade every calendar week to keep the account active.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> A trading day = at least one executed position on that calendar day.</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> At least 1 trade per calendar week to remain active.</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Applies during evaluation phases and after funding.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed rules */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-4xl px-4 py-20 md:px-6">
          <div className="text-center">
            <Badge variant="outline" className="font-display border-primary/40 text-primary">FULL DETAILS</Badge>
            <h2 className="font-display mt-4 text-4xl font-bold">Everything else, in plain English</h2>
          </div>

          <div className="mt-12 space-y-5">
            {[
              {
                icon: TrendingUp,
                title: "Profit Targets",
                body: "Each evaluation phase requires a 10% profit on your starting balance. Phase 1 → Phase 2 → Funded. There is no time limit to reach the target — take as many days as you need, as long as you meet the minimum trading day requirement.",
              },
              {
                icon: Clock,
                title: "Minimum Trading Days",
                body: "You need at least 3 trading days to clear a phase. A trading day = at least one executed position on that calendar day (Africa/Lagos). The system counts calendar days where at least one trade was opened and closed.",
              },
              {
                icon: Zap,
                title: "Weekly Activity Requirement",
                body: "You must execute at least 1 trade every calendar week to keep the account active. Missing a full week without any trade will result in the account being closed for inactivity. This applies during evaluation and after funding.",
              },
              {
                icon: Wallet,
                title: "Profit Split & Payouts",
                body: "Funded traders keep 80% of profits. Payouts are processed within 24 hours of admin approval to your verified Nigerian bank account or USDT wallet. You can request a payout once every 7 days.",
              },
              {
                icon: AlertTriangle,
                title: "What Counts As A Breach",
                body: "Equity dropping to 20% drawdown (trailing from the highest peak) — even momentarily on a spike — is a breach. So is any attempt to manipulate price, abuse evaluation-server latency, or coordinate trades across accounts.",
              },
              {
                icon: Ban,
                title: "Prohibited Strategies",
                body: "No HFT, no tick scalping (closing trades in less than 3 minutes), no arbitrage between accounts, no copy-trading from another funded account, no use of EAs that aren't disclosed. Hedging within a single account is allowed.",
              },
              {
                icon: ShieldCheck,
                title: "News & Weekend Holding",
                body: "You may trade through high-impact news. You may hold positions over the weekend. There is no overnight or weekend holding penalty.",
              },
              {
                icon: CheckCircle2,
                title: "Allowed Instruments",
                body: "All FX pairs, gold, silver, indices and crypto CFDs available on the FundedNG MT5 evaluation server.",
              },
              {
                icon: Wallet,
                title: "KYC Before Payout",
                body: "First payout requires verified bank details that match your registered name. Submit them in your Profile and our team will verify within one business day.",
              },
            ].map((r) => (
              <div key={r.title} className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg border border-primary/30 bg-primary/10 p-2.5">
                    <r.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{r.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{r.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-6">
          <h2 className="font-display text-4xl font-bold">Ready to put the rules to the test?</h2>
          <p className="mt-3 text-muted-foreground">Pick a challenge size and start trading on a FundedNG MT5 evaluation account.</p>
          <Link to="/buy" className="mt-8 inline-block">
            <Button size="lg" className="font-display">Start Challenge <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 text-center md:px-6">
        <Brand />
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
          <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
          <Link to="/agreement" className="text-muted-foreground hover:text-primary">Agreement & Risk</Link>
        </div>
        <div className="mt-4 text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} FundedNG. All rights reserved.
        </div>
      </footer>
    </div>
  );
}