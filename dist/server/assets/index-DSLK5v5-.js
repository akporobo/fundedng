import { V as jsxRuntimeExports, r as reactExports } from "./worker-entry-DS7H0w4O.js";
import { s as supabase, L as Link } from "./router-DudJYIfW.js";
import { P as PublicHeader } from "./PublicHeader-sTgvg8bT.js";
import { B as Brand } from "./Brand-DUbFz4ZD.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { B as Badge } from "./badge-Drtmlf7I.js";
import { c as cn, f as formatCompactSize, a as formatNaira, b as formatUSD } from "./utils-vYOMvTwc.js";
import { A as ArrowRight } from "./arrow-right-DLtychK9.js";
import { S as ShieldCheck } from "./shield-check-CoWiH9kN.js";
import { C as Clock } from "./clock-BmFxWi-H.js";
import { Z as Zap } from "./zap-CzElhQjl.js";
import { T as Trophy } from "./trophy-Cp5bM5_K.js";
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
import "./download-C5vXGTlG.js";
import "./x-CGo4OehW.js";
import "./menu-DSFmR6XS.js";
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("animate-pulse rounded-md bg-primary/10", className), ...props });
}
const categoryConfig = {
  payout: { label: "PAYOUT", className: "bg-green-500/20 text-green-500 border-green-500/40" },
  certificate: { label: "CERTIFIED", className: "bg-blue-500/20 text-blue-500 border-blue-500/40" },
  dashboard: { label: "LIVE DASHBOARD", className: "bg-purple-500/20 text-purple-500 border-purple-500/40" },
  funded: { label: "FUNDED", className: "bg-amber-500/20 text-amber-500 border-amber-500/40" }
};
function SocialProofGallery() {
  const [items, setItems] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [hovered, setHovered] = reactExports.useState(false);
  reactExports.useEffect(() => {
    supabase.from("social_proof_items").select("id, label, image_url, category, display_order").eq("is_visible", true).order("display_order", { ascending: true }).then(({ data }) => {
      setItems(data ?? []);
      setLoading(false);
    });
  }, []);
  if (!loading && items.length === 0) return null;
  const doubled = [...items, ...items];
  const renderCard = (item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0 w-[280px] md:w-[360px] h-[180px] md:h-[220px] rounded-2xl overflow-hidden border border-border group hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-default", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: item.image_url,
        alt: item.label,
        className: "h-full w-full object-cover",
        loading: "lazy"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `absolute top-2 right-2 rounded-md border px-2 py-0.5 text-[10px] font-display font-semibold ${categoryConfig[item.category]?.className ?? ""}`,
        children: categoryConfig[item.category]?.label ?? item.category.toUpperCase()
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-white", children: item.label }) })
  ] });
  const renderSkeleton = (key) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-[280px] md:w-[360px] h-[180px] md:h-[220px] rounded-2xl overflow-hidden border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-full w-full rounded-none" }) }, key);
  const hasMinItems = items.length >= 4;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "py-16 overflow-hidden bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10 px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display inline-block text-xs tracking-[0.4em] text-primary opacity-80 mb-4", children: "REAL RESULTS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl font-bold", children: "Nigerian Traders. Real Payouts." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Join traders already passing challenges and earning from FundedNG" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 px-4 overflow-hidden", children: Array.from({ length: 4 }).map((_, i) => renderSkeleton(`s1-${i}`)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 px-4 overflow-hidden", children: Array.from({ length: 4 }).map((_, i) => renderSkeleton(`s2-${i}`)) })
    ] }) : hasMinItems ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `space-y-4 ${hovered ? "paused" : ""}`,
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex overflow-hidden",
              style: {
                mask: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                WebkitMask: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 animate-scroll-left", style: { animationDuration: "30s" }, children: doubled.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: renderCard(item) }, `r1-${item.id}-${i}`)) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex overflow-hidden",
              style: {
                mask: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                WebkitMask: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 animate-scroll-right", style: { animationDuration: "30s" }, children: doubled.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: renderCard(item) }, `r2-${item.id}-${i}`)) })
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-4 px-4", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: renderCard(item) }, item.id)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
        }
        .paused .animate-scroll-left,
        .paused .animate-scroll-right {
          animation-play-state: paused;
        }
      ` })
  ] });
}
const tradingChartHero = "/assets/trading-chart-hero-DN7cwFjE.jpg";
const tradingChartHeroDark = "/assets/trading-chart-hero-dark-DsYxoUSD.jpg";
function Index() {
  const [challenges, setChallenges] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(display-mode: standalone)").matches) {
      window.location.replace("/dashboard");
      return;
    }
    supabase.from("challenges").select("*").eq("is_active", true).order("account_size").then(({
      data
    }) => setChallenges(data ?? []));
  }, []);
  const standardChallenges = challenges.filter((c) => c.challenge_type !== "instant");
  const instantChallenges = challenges.filter((c) => c.challenge_type === "instant");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: tradingChartHero, alt: "Live trading candlestick chart with upward trend", width: 1920, height: 1080, className: "absolute inset-0 h-full w-full object-cover opacity-60 dark:hidden" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: tradingChartHeroDark, alt: "", "aria-hidden": "true", width: 1920, height: 1080, className: "absolute inset-0 hidden h-full w-full object-cover opacity-80 dark:block" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 gradient-radial-primary opacity-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-5xl px-4 py-24 text-center md:px-6 md:py-32", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display mb-6 text-xs tracking-[0.4em] text-primary opacity-80", children: "NIGERIA'S PROP TRADING FIRM" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl font-bold leading-[1.05] md:text-7xl lg:text-8xl", children: [
          "Trade Big.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary text-glow", children: "Get Paid." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-4 max-w-xl text-base font-display tracking-wide text-primary md:text-lg", children: "The Best Prop-Firm for 9ja traders wey sabi" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base", children: "Pass two phases. Get funded. Withdraw 24 hours after your payout is approved — no wahala." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-6 md:grid-cols-4", children: [["24h", "Payouts"], ["80%", "Profit Split"], ["3", "Simple Rules"], ["₦2M", "Max Funding"]].map(([v, l]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl font-bold text-primary", children: v }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: l })
        ] }, l)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap items-center justify-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/buy", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "font-display animate-pulse-glow", children: [
            "Start Challenge ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/register", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "outline", children: "Create Account" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SocialProofGallery, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-20 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-display border-primary/40 text-primary", children: "FIND YOUR MATCH" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display mt-4 text-4xl font-bold", children: "Find Your Perfect Challenge" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Select your preferences and get started in minutes" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HomepageConfigurator, { standardChallenges, instantChallenges })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-20 text-center md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-display border-primary/40 text-primary", children: "THE RULES" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display mt-4 text-4xl font-bold", children: "Just 3 Rules. That's It." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-5 md:grid-cols-3", children: [{
        num: "01",
        title: "Max 20% Drawdown (Trailing)",
        desc: "Your equity must never drop more than 20% from the highest peak reached. No daily loss limit.",
        icon: ShieldCheck
      }, {
        num: "02",
        title: "No Tick Scalping",
        desc: "Each trade must be held at least 3 minutes — breached on the 4th detection. Two short trades at the same time is an instant breach.",
        icon: Clock
      }, {
        num: "03",
        title: "Trade at Least Once a Week",
        desc: "At least 1 trade every calendar week to stay active. Profits across 3+ trading days per phase.",
        icon: Zap
      }].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-8 text-left transition-colors hover:border-primary/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-5xl font-bold text-primary/30", children: r.num }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(r.icon, { className: "h-6 w-6 text-primary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 text-xl font-semibold", children: r.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: r.desc })
      ] }, r.num)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 text-center text-sm text-muted-foreground", children: [
        "See our",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/rules", className: "text-primary font-semibold hover:underline", children: "full rules" }),
        " ",
        "to learn more about weekend holding, news trading restrictions, allowed instruments, and more."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 py-20 text-center md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "mx-auto h-12 w-12 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display mt-6 text-4xl font-bold", children: "Ready to get funded?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Join hundreds of Nigerian traders earning real payouts." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/buy", className: "mt-8 inline-block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "font-display", children: [
        "Start Now ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "px-4 py-12 text-center md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-4 max-w-2xl text-xs text-muted-foreground", children: "FundedNG is a proprietary trading evaluation platform. Challenge fees fund operational costs. All evaluations run on FundedNG MT5 evaluation accounts — you trade real-market prices in a controlled evaluation environment. Past performance does not guarantee future results." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/rules", className: "text-muted-foreground hover:text-primary", children: "Rules" }),
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
const fallbackStandard = [{
  id: "1",
  name: "Starter",
  account_size: 2e5,
  price_naira: 7500,
  profit_target_percent: 10,
  max_drawdown_percent: 20,
  phases: 2
}, {
  id: "2",
  name: "Growth",
  account_size: 5e5,
  price_naira: 17500,
  profit_target_percent: 10,
  max_drawdown_percent: 20,
  phases: 2
}, {
  id: "3",
  name: "Pro",
  account_size: 1e6,
  price_naira: 32e3,
  profit_target_percent: 10,
  max_drawdown_percent: 20,
  phases: 2
}, {
  id: "4",
  name: "Elite",
  account_size: 2e6,
  price_naira: 6e4,
  profit_target_percent: 10,
  max_drawdown_percent: 20,
  phases: 2
}];
const fallbackInstant = [{
  id: "i1",
  name: "Instant 1.5M",
  account_size: 15e5,
  price_naira: 12e4,
  profit_target_percent: 15,
  max_drawdown_percent: 20,
  phases: 1,
  max_daily_drawdown_percent: 10,
  max_trading_days: 45
}, {
  id: "i2",
  name: "Instant 2M",
  account_size: 2e6,
  price_naira: 155e3,
  profit_target_percent: 15,
  max_drawdown_percent: 20,
  phases: 1,
  max_daily_drawdown_percent: 10,
  max_trading_days: 45
}, {
  id: "i3",
  name: "Instant 3M",
  account_size: 3e6,
  price_naira: 225e3,
  profit_target_percent: 15,
  max_drawdown_percent: 20,
  phases: 1,
  max_daily_drawdown_percent: 10,
  max_trading_days: 45
}];
const usdSizes = {
  "2-step": [5e3, 1e4, 25e3, 5e4, 1e5],
  instant: [5e3, 1e4, 25e3, 5e4]
};
const usdPrices = {
  5e3: 19,
  1e4: 45,
  25e3: 99,
  5e4: 199,
  1e5: 349
};
function HomepageConfigurator({
  standardChallenges,
  instantChallenges
}) {
  const [currency, setCurrency] = reactExports.useState("NGN");
  const [challengeType, setChallengeType] = reactExports.useState("2-step");
  const [selectedSize, setSelectedSize] = reactExports.useState(0);
  const stdList = standardChallenges.length > 0 ? standardChallenges : fallbackStandard;
  const instList = instantChallenges.length > 0 ? instantChallenges : fallbackInstant;
  const sizes = currency === "NGN" ? (challengeType === "2-step" ? stdList : instList).map((c) => Number(c.account_size)) : usdSizes[challengeType];
  reactExports.useEffect(() => {
    if (sizes.length === 0) return;
    const def = currency === "NGN" ? sizes.includes(4e5) ? 4e5 : sizes[0] : 1e4;
    if (selectedSize === 0 || !sizes.includes(selectedSize)) {
      setSelectedSize(def);
    }
  }, [currency, challengeType, sizes.length]);
  const selectedChallenge = currency === "NGN" ? (challengeType === "2-step" ? stdList : instList).find((c) => Number(c.account_size) === selectedSize) : null;
  const fee = currency === "NGN" ? selectedChallenge?.price_naira ?? 0 : selectedSize ? usdPrices[selectedSize] ?? 0 : 0;
  const searchParams = {
    currency,
    type: challengeType === "2-step" ? "2step" : "instant",
    size: String(selectedSize)
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-display mb-3 block text-xs tracking-widest text-muted-foreground", children: "CURRENCY" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center rounded-full border border-border bg-card p-1", children: ["NGN", "USD"].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setCurrency(c), className: `font-display rounded-full px-6 py-2 text-xs tracking-wider transition-all ${currency === c ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`, children: c }, c)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-display mb-3 block text-xs tracking-widest text-muted-foreground", children: "CHALLENGE TYPE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center rounded-full border border-border bg-card p-1", children: [["2-step", "2-STEP"], ["instant", "INSTANT"]].map(([val, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setChallengeType(val), className: `font-display rounded-full px-5 py-2 text-xs tracking-wider transition-all ${challengeType === val ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`, children: label }, val)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-display mb-3 block text-xs tracking-widest text-muted-foreground", children: "ACCOUNT SIZE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: sizes.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSelectedSize(s), className: `font-display rounded-full border px-5 py-2 text-xs tracking-wider transition-all ${selectedSize === s ? "border-primary bg-primary text-primary-foreground shadow" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`, children: formatCompactSize(s, currency) }, s)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display mb-5 text-lg font-bold text-center", children: "Challenge Summary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Account Size" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold", children: currency === "NGN" ? formatNaira(selectedSize) : formatUSD(selectedSize) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Challenge Fee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-primary", children: currency === "NGN" ? formatNaira(fee) : formatUSD(fee) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Profit Split" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold", children: "80%" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Payouts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold", children: "Weekly" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/buy", search: searchParams, className: "mt-5 block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full font-display", size: "lg", children: [
        "Start This Challenge ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
      ] }) })
    ] }) })
  ] });
}
export {
  Index as component
};
