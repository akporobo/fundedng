import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicHeader } from "@/components/site/PublicHeader";
import { Brand } from "@/components/site/Brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Zap, ArrowRight, AlertTriangle, Clock, TrendingUp, Wallet, Ban, CheckCircle2, Users } from "lucide-react";

export const Route = createFileRoute("/rules")({
  head: () => ({
    meta: [
      { title: "Trading Rules — FundedNG" },
      { name: "description", content: "Full breakdown of FundedNG's prop trading rules: 20% max drawdown (equity trailing), 3-minute minimum hold time with 4-warning grace, weekly activity requirement, profit targets, payouts, and what's allowed." },
      { property: "og:title", content: "Trading Rules — FundedNG" },
      { property: "og:description", content: "Just 3 main rules — 20% max drawdown (equity trailing), 3-minute minimum hold time with 4 warnings, and 3 days minimum trading. See the full rulebook here." },
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
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display mt-4 text-2xl font-bold">Max 20% Drawdown (Equity Trailing)</h3>
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
                <div className="font-display text-6xl font-bold text-primary/30">02</div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display mt-4 text-2xl font-bold">No Tick Scalping</h3>
              <p className="mt-3 text-muted-foreground">
                Each trade must remain open for at least 3 minutes before closing. Breached on the 4th short-held detection:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> 1st through 3rd short-held trade → warning (visible on your dashboard)</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> 4th short-held trade → instant breach, account closes</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Two short-held trades open at the same time → instant breach</li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-primary/40 bg-card p-8 glow-primary">
              <div className="flex items-start justify-between">
                <div className="font-display text-6xl font-bold text-primary/30">03</div>
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display mt-4 text-2xl font-bold">Weekly Activity Requirement</h3>
              <p className="mt-3 text-muted-foreground">
                You must execute at least 1 trade every calendar week to keep your account active, with a minimum of 3 trading days completed in each evaluation phase.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> A trading day = at least one executed position opened and closed on that calendar day.</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Profits must be spread across at least 3 different trading days per phase.</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> At least 1 trade per calendar week to remain active.</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Reason: our liquidity provider removes inactive accounts after extended inactivity — this keeps yours from being dropped.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Instant Challenge Rules */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-6">
          <div className="text-center">
            <Badge variant="outline" className="font-display border-chart-2/40 text-chart-2">INSTANT CHALLENGE RULES</Badge>
            <h2 className="font-display mt-4 text-4xl font-bold">Different rules for Instant Challenges</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Instant Challenges are a 1-step evaluation with a few key differences from the standard 2-step program.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <div className="rounded-xl border-2 border-chart-2/40 bg-card p-8">
              <div className="flex items-start justify-between">
                <div className="font-display text-6xl font-bold text-chart-2/30">01</div>
                <TrendingUp className="h-8 w-8 text-chart-2" />
              </div>
              <h3 className="font-display mt-4 text-2xl font-bold">15% Profit Target</h3>
              <p className="mt-3 text-muted-foreground">
                Instant Challenges require a 15% profit target — a single phase to funded. No phase 2. Reach 15% while staying within all drawdown limits and the account is funded.
              </p>
            </div>

            <div className="rounded-xl border-2 border-chart-2/40 bg-card p-8">
              <div className="flex items-start justify-between">
                <div className="font-display text-6xl font-bold text-chart-2/30">02</div>
                <ShieldCheck className="h-8 w-8 text-chart-2" />
              </div>
              <h3 className="font-display mt-4 text-2xl font-bold">5% Daily Drawdown</h3>
              <p className="mt-3 text-muted-foreground">
                Your equity must not drop more than 5% in a single trading day, measured from the start-of-day equity. In addition to the 20% total trailing drawdown, this daily limit applies exclusively to Instant Challenges.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-chart-2" /> Resets each trading day based on starting equity.</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-chart-2" /> Combined with the 20% trailing max drawdown.</li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-chart-2/40 bg-card p-8">
              <div className="flex items-start justify-between">
                <div className="font-display text-6xl font-bold text-chart-2/30">03</div>
                <Clock className="h-8 w-8 text-chart-2" />
              </div>
              <h3 className="font-display mt-4 text-2xl font-bold">5–45 Day Trading Window</h3>
              <p className="mt-3 text-muted-foreground">
                You have a window of 5 to 45 calendar days to complete the Instant Challenge. You need a minimum of 5 trading days, and the entire challenge must be completed within 45 days.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-chart-2" /> Min 5 trading days (instead of 3 for standard) with profits spread across them.</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-chart-2" /> Max 45 calendar days to complete the challenge.</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-chart-2" /> Same 80% profit split and weekly payouts apply.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* USD Challenge Rules */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-6">
          <div className="text-center">
            <Badge variant="outline" className="font-display border-blue-400/40 text-blue-500">USD CHALLENGE RULES</Badge>
            <h2 className="font-display mt-4 text-4xl font-bold">Tighter rules for USD challenges</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              USD challenges are a 2-step evaluation with tighter drawdown limits and higher profit requirements — designed for experienced traders who want access to international pricing.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <div className="rounded-xl border-2 border-blue-400/40 bg-card p-8">
              <div className="flex items-start justify-between">
                <div className="font-display text-6xl font-bold text-blue-400/30">01</div>
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="font-display mt-4 text-2xl font-bold">8% / 5% Profit Targets</h3>
              <p className="mt-3 text-muted-foreground">
                Phase 1 requires an 8% profit target. Phase 2 requires 5%. Once both phases are complete, the account is funded. Lower profit targets than NGN challenges but with tighter drawdown limits.
              </p>
            </div>

            <div className="rounded-xl border-2 border-blue-400/40 bg-card p-8">
              <div className="flex items-start justify-between">
                <div className="font-display text-6xl font-bold text-blue-400/30">02</div>
                <ShieldCheck className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="font-display mt-4 text-2xl font-bold">10% Max Drawdown (Trailing)</h3>
              <p className="mt-3 text-muted-foreground">
                Your equity must never drop more than 10% from the highest equity peak reached. This is a trailing drawdown — the threshold moves up as your equity peaks higher.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400" /> Tighter than the 20% NGN rule — half the room for error.</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400" /> Combined with a 5% daily drawdown limit.</li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-blue-400/40 bg-card p-8">
              <div className="flex items-start justify-between">
                <div className="font-display text-6xl font-bold text-blue-400/30">03</div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="font-display mt-4 text-2xl font-bold">5% Daily Drawdown</h3>
              <p className="mt-3 text-muted-foreground">
                Your equity must not drop more than 5% in a single trading day, measured from the start-of-day equity. This applies during both evaluation phases and after funding.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400" /> Resets each trading day based on starting equity.</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400" /> Combined with the 10% trailing max drawdown.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              USD challenges also require a minimum of <strong>5 trading days</strong> per phase (profits spread across them). Payouts can be requested once every <strong>10 business days</strong>. Accounts inactive for <strong>15 consecutive days</strong> are closed. News trading is restricted 5 minutes before/after high-impact events.
            </p>
          </div>
        </div>
      </section>

      {/* Discounted Challenge Rules */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-6">
          <div className="text-center">
            <Badge variant="outline" className="font-display border-amber-400/40 text-amber-500">DISCOUNTED CHALLENGES</Badge>
            <h2 className="font-display mt-4 text-4xl font-bold">Limited payouts for discounted challenges</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Challenges purchased at a discounted price are subject to a maximum of 2 payouts. Once two payouts have been
              made, the account will be considered fully settled and no further payouts will be processed.
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              This restriction applies to any challenge where a discount was applied at the point of purchase, including
              promotional codes, partner discounts, seasonal sales, or any other reduced-price offer. Standard-priced
              challenges are not affected by this limit.
            </p>
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
                body: "All profits in each phase must be made in at least 3 min trading days. A trading day = at least one executed position on that calendar day (Africa/Lagos). The system counts calendar days where at least one trade was opened and closed.",
              },
              {
                icon: Zap,
                title: "Weekly Activity Requirement",
                body: "You must execute at least 1 trade every calendar week to keep the account active. Missing a full week without any trade will result in the account being closed for inactivity. This applies during evaluation and after funding. Our liquidity provider removes inactive accounts after extended inactivity — this rule keeps your account from being dropped.",
              },
              {
                icon: Ban,
                title: "No Weekend Holding",
                body: "Positions must be closed before the weekend market close. Holding trades over the weekend is not permitted. Markets can gap significantly over the weekend — particularly on Gold, Indices, and certain FX pairs. A gap that opens beyond your Stop Loss can breach your account before you have any chance to react. This rule protects your account from weekend gap risk that is outside your control.",
              },
              {
                icon: Wallet,
                title: "Profit Split & Payouts",
                  body: "Funded traders keep 80% of profits. Payouts are processed within 24 hours of admin approval to your verified Nigerian bank account or USDT wallet. NGN challenges can request a payout once every 7 calendar days. USD challenges can request a payout once every 10 business days.",
              },
              {
                icon: AlertTriangle,
                title: "What Counts As A Breach",
                body: "Equity dropping to 20% drawdown (trailing from the highest peak) — even momentarily on a spike — is a breach. So is a 4th short-held trade, two short-held trades open at the same time, or any attempt to manipulate price, abuse evaluation-server latency, or coordinate trades across accounts.",
              },
              {
                icon: Ban,
                title: "Prohibited Strategies",
                body: "No HFT, no tick scalping (closing trades in less than 3 minutes — 3 warnings then breach on 4th), no arbitrage between accounts, no copy-trading from another funded account, no use of EAs that aren't disclosed. Hedging within a single account is allowed.",
              },
              {
                icon: Users,
                title: "No Gaming The System",
                body: "Creating or using multiple accounts to participate in free giveaway challenges, promotions, or any evaluation multiple times is strictly prohibited. All associated accounts will be permanently terminated and any pending payouts forfeited.",
              },
              {
                icon: ShieldCheck,
                title: "News Trading Restriction",
                body: "No new trades may be opened 5 minutes before or 5 minutes after any high-impact news event. Trades already open before the restricted window are not affected — they can remain open and close normally including via SL/TP. High-impact events are sourced from the ForexFactory economic calendar (red folder events). The wider 5-minute buffer gives more protection against post-release volatility spikes that can trigger Stop Losses unfairly.",
              },
              {
                icon: CheckCircle2,
                title: "Allowed Instruments",
                body: "All FX pairs, Gold, Silver, Indices, and Crypto CFDs are available on the FundedNG MT5 evaluation server. Note: Indices and Gold are particularly prone to gaps and spikes — the weekend-hold and news-trading rules apply equally across all instruments to protect traders.",
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