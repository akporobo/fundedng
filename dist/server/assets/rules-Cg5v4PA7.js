import { r as reactExports, V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { L as Link } from "./router-DudJYIfW.js";
import { P as PublicHeader } from "./PublicHeader-sTgvg8bT.js";
import { B as Brand } from "./Brand-DUbFz4ZD.js";
import { B as Badge } from "./badge-Drtmlf7I.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { S as ShieldCheck } from "./shield-check-CoWiH9kN.js";
import { C as CircleCheck } from "./circle-check-CaHXACS8.js";
import { C as Clock } from "./clock-BmFxWi-H.js";
import { Z as Zap } from "./zap-CzElhQjl.js";
import { T as TrendingUp } from "./trending-up-kxjckc06.js";
import { B as Ban } from "./ban-Dliy2Bex.js";
import { W as Wallet } from "./wallet-C6DygIpk.js";
import { T as TriangleAlert } from "./triangle-alert-CQOpTpD9.js";
import { U as Users } from "./users-IaM0z4Ba.js";
import { A as ArrowRight } from "./arrow-right-DLtychK9.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./client.server-B4evwzKW.js";
import "./email.server-Czm4Ciez.js";
import "crypto";
import "buffer";
import "stream";
import "util";
import "url";
import "https";
import "net";
import "tls";
import "assert";
import "os";
import "http";
import "./ThemeToggle-DWCK5KFm.js";
import "./createLucideIcon-DQobbSW9.js";
import "./utils-vYOMvTwc.js";
import "./download-C5vXGTlG.js";
import "./x-CGo4OehW.js";
import "./menu-DSFmR6XS.js";
function RulesPage() {
  const [rulesTab, setRulesTab] = reactExports.useState("NGN");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden border-b border-border bg-surface", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 gradient-radial-primary opacity-30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-4xl px-4 py-20 text-center md:px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-display border-primary/40 text-primary", children: "RULEBOOK" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display mt-4 text-5xl font-bold leading-tight md:text-6xl", children: [
          "Simple, transparent ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary text-glow", children: "trading rules" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-5 max-w-2xl text-lg text-muted-foreground", children: "Just 3 main rules to keep your account alive. Everything else is here for full clarity — no hidden gotchas." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 inline-flex items-center rounded-full border border-border bg-card p-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setRulesTab("NGN"), className: `font-display rounded-full px-6 py-2 text-xs tracking-wider transition-all ${rulesTab === "NGN" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`, children: "NGN ACCOUNTS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setRulesTab("USD"), className: `font-display rounded-full px-6 py-2 text-xs tracking-wider transition-all ${rulesTab === "USD" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`, children: "USD ACCOUNTS" })
        ] })
      ] })
    ] }),
    rulesTab === "NGN" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-20 md:px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-display border-primary/40 text-primary", children: "THE 3 MAIN RULES" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display mt-4 text-4xl font-bold", children: "Break any one and your account closes." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 grid gap-5 md:grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border-2 border-primary/40 bg-card p-8 glow-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-6xl font-bold text-primary/30", children: "01" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-8 w-8 text-primary" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display mt-4 text-2xl font-bold", children: "Max 20% Drawdown (Equity Trailing)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Your equity must never drop more than 20% from the highest equity peak reached (trailing). For example, if your account peaks at ₦220,000, equity must stay above ₦176,000." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-primary" }),
                " Measured on floating equity, trailing from the highest peak."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-primary" }),
                " No daily loss limit — only the total trailing 20% cap matters."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-primary" }),
                " Hit it once and the account is closed permanently."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border-2 border-primary/40 bg-card p-8 glow-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-6xl font-bold text-primary/30", children: "02" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-8 w-8 text-primary" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display mt-4 text-2xl font-bold", children: "No Tick Scalping" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Each trade must remain open for at least 3 minutes before closing. Breached on the 4th short-held detection:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-primary" }),
                " 1st through 3rd short-held trade → warning (visible on your dashboard)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-primary" }),
                " 4th short-held trade → instant breach, account closes"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-primary" }),
                " Two short-held trades open at the same time → instant breach"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border-2 border-primary/40 bg-card p-8 glow-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-6xl font-bold text-primary/30", children: "03" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-8 w-8 text-primary" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display mt-4 text-2xl font-bold", children: "Weekly Activity Requirement" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "You must execute at least 1 trade every calendar week to keep your account active, with a minimum of 3 trading days completed in each evaluation phase." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-primary" }),
                " A trading day = at least one executed position opened and closed on that calendar day."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-primary" }),
                " Profits must be spread across at least 3 different trading days per phase."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-primary" }),
                " At least 1 trade per calendar week to remain active."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-primary" }),
                " Reason: our liquidity provider removes inactive accounts after extended inactivity — this keeps yours from being dropped."
              ] })
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-20 md:px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-display border-chart-2/40 text-chart-2", children: "INSTANT CHALLENGE RULES" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display mt-4 text-4xl font-bold", children: "Different rules for Instant Challenges" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-3 max-w-2xl text-muted-foreground", children: "Instant Challenges are a 1-step evaluation with a few key differences from the standard 2-step program." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 grid gap-5 md:grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border-2 border-chart-2/40 bg-card p-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-6xl font-bold text-chart-2/30", children: "01" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-8 w-8 text-chart-2" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display mt-4 text-2xl font-bold", children: "15% Profit Target" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Instant Challenges require a 15% profit target — a single phase to funded. No phase 2. Reach 15% while staying within all drawdown limits and the account is funded." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border-2 border-chart-2/40 bg-card p-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-6xl font-bold text-chart-2/30", children: "02" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-8 w-8 text-chart-2" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display mt-4 text-2xl font-bold", children: "5% Daily Drawdown" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Your equity must not drop more than 5% in a single trading day, measured from the start-of-day equity. In addition to the 20% total trailing drawdown, this daily limit applies exclusively to Instant Challenges." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-chart-2" }),
                " Resets each trading day based on starting equity."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-chart-2" }),
                " Combined with the 20% trailing max drawdown."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border-2 border-chart-2/40 bg-card p-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-6xl font-bold text-chart-2/30", children: "03" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-8 w-8 text-chart-2" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display mt-4 text-2xl font-bold", children: "5–45 Day Trading Window" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "You have a window of 5 to 45 calendar days to complete the Instant Challenge. You need a minimum of 5 trading days, and the entire challenge must be completed within 45 days." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-chart-2" }),
                " Min 5 trading days (instead of 3 for standard) with profits spread across them."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-chart-2" }),
                " Max 45 calendar days to complete the challenge."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-chart-2" }),
                " Same 80% profit split and weekly payouts apply."
              ] })
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-20 md:px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-display border-amber-400/40 text-amber-500", children: "DISCOUNTED CHALLENGES" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display mt-4 text-4xl font-bold", children: "Limited payouts for discounted challenges" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-3 max-w-2xl text-muted-foreground", children: "Challenges purchased at a discounted price are subject to a maximum of 2 payouts. Once two payouts have been made, the account will be considered fully settled and no further payouts will be processed." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This restriction applies to any challenge where a discount was applied at the point of purchase, including promotional codes, partner discounts, seasonal sales, or any other reduced-price offer. Standard-priced challenges are not affected by this limit." }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-4 py-20 md:px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-display border-primary/40 text-primary", children: "FULL DETAILS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display mt-4 text-4xl font-bold", children: "Everything else, in plain English" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 space-y-5", children: [{
          icon: TrendingUp,
          title: "Profit Targets",
          body: "Each evaluation phase requires a 10% profit on your starting balance. Phase 1 → Phase 2 → Funded. There is no time limit to reach the target — take as many days as you need, as long as you meet the minimum trading day requirement."
        }, {
          icon: Clock,
          title: "Minimum Trading Days",
          body: "All profits in each phase must be made in at least 3 min trading days. A trading day = at least one executed position on that calendar day (Africa/Lagos). The system counts calendar days where at least one trade was opened and closed."
        }, {
          icon: Zap,
          title: "Weekly Activity Requirement",
          body: "You must execute at least 1 trade every calendar week to keep the account active. Missing a full week without any trade will result in the account being closed for inactivity. This applies during evaluation and after funding. Our liquidity provider removes inactive accounts after extended inactivity — this rule keeps your account from being dropped."
        }, {
          icon: Ban,
          title: "No Weekend Holding",
          body: "Positions must be closed before the weekend market close. Holding trades over the weekend is not permitted. Markets can gap significantly over the weekend — particularly on Gold, Indices, and certain FX pairs. A gap that opens beyond your Stop Loss can breach your account before you have any chance to react. This rule protects your account from weekend gap risk that is outside your control."
        }, {
          icon: Wallet,
          title: "Profit Split & Payouts",
          body: "Funded traders keep 80% of profits. Payouts are processed within 24 hours of admin approval to your verified Nigerian bank account or USDT wallet. NGN challenges can request a payout once every 7 calendar days. USD challenges can request a payout once every 10 business days. USD payout caps: first 2 withdrawals capped at 6% of account size, subsequent withdrawals at 10%."
        }, {
          icon: TriangleAlert,
          title: "What Counts As A Breach",
          body: "Equity dropping to 20% drawdown (trailing from the highest peak) — even momentarily on a spike — is a breach. So is a 4th short-held trade, two short-held trades open at the same time, or any attempt to manipulate price, abuse evaluation-server latency, or coordinate trades across accounts."
        }, {
          icon: Ban,
          title: "Prohibited Strategies",
          body: "No HFT, no tick scalping (closing trades in less than 3 minutes — 3 warnings then breach on 4th), no arbitrage between accounts, no copy-trading from another funded account, no use of EAs that aren't disclosed. Hedging within a single account is allowed."
        }, {
          icon: Users,
          title: "No Gaming The System",
          body: "Creating or using multiple accounts to participate in free giveaway challenges, promotions, or any evaluation multiple times is strictly prohibited. All associated accounts will be permanently terminated and any pending payouts forfeited."
        }, {
          icon: ShieldCheck,
          title: "News Trading Restriction",
          body: "No new trades may be opened 5 minutes before or 5 minutes after any high-impact news event. Trades already open before the restricted window are not affected — they can remain open and close normally including via SL/TP. High-impact events are sourced from the ForexFactory economic calendar (red folder events). The wider 5-minute buffer gives more protection against post-release volatility spikes that can trigger Stop Losses unfairly."
        }, {
          icon: CircleCheck,
          title: "Allowed Instruments",
          body: "All FX pairs, Gold, Silver, Indices, and Crypto CFDs are available on the FundedNG MT5 evaluation server. Note: Indices and Gold are particularly prone to gaps and spikes — the weekend-hold and news-trading rules apply equally across all instruments to protect traders."
        }, {
          icon: Wallet,
          title: "KYC Before Payout",
          body: "First payout requires verified bank details that match your registered name. Submit them in your Profile and our team will verify within one business day."
        }].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-primary/30 bg-primary/10 p-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(r.icon, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold", children: r.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm text-muted-foreground", children: r.body })
          ] })
        ] }) }, r.title)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 py-20 text-center md:px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl font-bold", children: "Ready to put the rules to the test?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Pick a challenge size and start trading on a FundedNG MT5 evaluation account." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/buy", className: "mt-8 inline-block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "font-display", children: [
          "Start Challenge ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
        ] }) })
      ] }) })
    ] }),
    rulesTab === "USD" && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-20 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-display border-blue-400/40 text-blue-500", children: "USD CHALLENGE RULES" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display mt-4 text-4xl font-bold", children: "Tighter rules for USD challenges" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-3 max-w-2xl text-muted-foreground", children: "USD challenges are a 2-step evaluation with tighter drawdown limits and higher profit requirements — designed for experienced traders who want access to international pricing." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 grid gap-5 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border-2 border-blue-400/40 bg-card p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-6xl font-bold text-blue-400/30", children: "01" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-8 w-8 text-blue-400" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display mt-4 text-2xl font-bold", children: "10% Static Drawdown + 5% Daily" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Your account balance (realized P&L) must never drop more than 10% from your starting balance — not trailing, and based on closed balance rather than floating equity. On top of that, a 5% daily drawdown limit resets at midnight UTC — also measured from balance. Either breach closes the account permanently." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-blue-400" }),
              " 10% static drawdown from starting balance (closed balance)."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-blue-400" }),
              " 5% daily drawdown resets at midnight UTC."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-blue-400" }),
              " Either breach = permanent account closure."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border-2 border-blue-400/40 bg-card p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-6xl font-bold text-blue-400/30", children: "02" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-8 w-8 text-blue-400" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display mt-4 text-2xl font-bold", children: "5 Profitable Trading Days Per Phase" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "You need at least 5 profitable trading days in each phase. A profitable day means your net profit on that calendar day is at least 0.5% of your starting balance. This threshold is fixed — it does not roll upwards as your equity grows." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-blue-400" }),
              " ",
              ">=",
              "0.5% net profit on starting balance per day."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-blue-400" }),
              " Threshold is fixed, not rolling."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-blue-400" }),
              " Progress visible on your Trading Stats dashboard."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border-2 border-blue-400/40 bg-card p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-6xl font-bold text-blue-400/30", children: "03" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-8 w-8 text-blue-400" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display mt-4 text-2xl font-bold", children: "3-Minute Minimum Hold (4-Strike)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Every trade must stay open at least 3 minutes before closing — SL, TP, and manual closes all count. You get 3 warnings, then the 4th short-held trade is an instant breach. Two short-held trades open at the same time is also an instant breach." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-blue-400" }),
              " SL, TP, and manual closes all count toward the timer."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-blue-400" }),
              " 1st–3rd short-held = warning; 4th = instant breach."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 text-blue-400" }),
              " Two simultaneous short-held trades = instant breach."
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-center text-2xl font-bold", children: "Payout Structure" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-center text-sm text-muted-foreground", children: "5 payouts maximum per account. Account is retired after the final payout." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 overflow-x-auto rounded-xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-background/50 text-xs uppercase tracking-wide text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Payout" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Min Profit Required" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Amount Paid Out" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Trader Receives (80%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Cooldown" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: [{
            payout: "1st",
            minProfit: ">=6% of starting balance",
            amount: "6% of starting balance",
            trader: "4.8% of starting balance",
            cooldown: "—"
          }, {
            payout: "2nd",
            minProfit: ">=6% of starting balance",
            amount: "6% of starting balance",
            trader: "4.8% of starting balance",
            cooldown: "10 business days"
          }, {
            payout: "3rd",
            minProfit: ">=10% of starting balance",
            amount: "10% of starting balance",
            trader: "8% of starting balance",
            cooldown: "10 business days"
          }, {
            payout: "4th",
            minProfit: ">=10% of starting balance",
            amount: "10% of starting balance",
            trader: "8% of starting balance",
            cooldown: "10 business days"
          }, {
            payout: "5th (Final)",
            minProfit: "Any remaining profit",
            amount: "50% of remaining profit",
            trader: "40% of remaining profit",
            cooldown: "10 business days"
          }].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border last:border-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-display font-semibold", children: r.payout }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: r.minProfit }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: r.amount }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: r.trader }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: r.cooldown })
          ] }, r.payout)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-4 md:grid-cols-5", children: [{
        size: "$5k",
        sizeVal: 5e3,
        first: 240,
        later: 400
      }, {
        size: "$10k",
        sizeVal: 1e4,
        first: 480,
        later: 800
      }, {
        size: "$20k",
        sizeVal: 2e4,
        first: 960,
        later: 1600
      }, {
        size: "$50k",
        sizeVal: 5e4,
        first: 2400,
        later: 4e3
      }, {
        size: "$100k",
        sizeVal: 1e5,
        first: 4800,
        later: 8e3
      }].map((ex) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-blue-400/30 bg-card p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-bold text-blue-400", children: ex.size }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "1st/2nd:" }),
            " $",
            ex.first
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "3rd/4th:" }),
            " $",
            ex.later
          ] })
        ] })
      ] }, ex.size)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-center text-2xl font-bold", children: "Additional USD Account Rules" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-4 md:grid-cols-2", children: [{
          icon: Ban,
          title: "No Weekend Holding",
          body: "Non-crypto positions must close before Friday 21:00 UTC. Crypto CFDs are exempt from this rule. Holding over the weekend exposes your account to gap risk that is outside your control."
        }, {
          icon: TriangleAlert,
          title: "News Trading Restriction",
          body: "No new trades may be opened 5 minutes before or 5 minutes after any high-impact news event (ForexFactory red folder). Existing open trades are not affected — they can remain open and close normally including via SL/TP."
        }, {
          icon: Clock,
          title: "Inactivity — 15 Days",
          body: "Accounts with no trading activity for 15 consecutive days will be automatically closed. At least one trade per 15-day period is required to keep the account active."
        }, {
          icon: CircleCheck,
          title: "Allowed Instruments",
          body: "All FX pairs, Gold, Silver, Indices, and Crypto CFDs are available on the FundedNG MT5 evaluation server. Note: Indices and Gold are prone to gaps and spikes — applicable restrictions apply equally across all instruments."
        }, {
          icon: Ban,
          title: "Prohibited Strategies",
          body: "No HFT, arbitrage, cross-account hedging, grid trading, martingale, copy trading from other funded accounts, or automated trading (EAs). Hedging within a single account is allowed."
        }, {
          icon: Wallet,
          title: "KYC Before First Payout",
          body: "Your first payout requires verified bank or USDT wallet details that match your registered name. Submit them in your Profile dashboard and our team will verify within one business day. Payouts are sent in Naira equivalent via Nigerian bank or USDT."
        }].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-5 transition-colors hover:border-blue-400/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-blue-400/30 bg-blue-400/10 p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(r.icon, { className: "h-4 w-4 text-blue-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-sm font-semibold", children: r.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: r.body })
          ] })
        ] }) }, r.title)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-16 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/buy", search: {
        currency: "USD"
      }, className: "inline-block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "font-display", children: [
        "Get a USD Account ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "px-4 py-12 text-center md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-muted-foreground hover:text-primary", children: "Home" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/agreement", className: "text-muted-foreground hover:text-primary", children: "Agreement & Risk" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-xs text-muted-foreground/60", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " FundedNG. All rights reserved."
      ] })
    ] })
  ] });
}
export {
  RulesPage as component
};
