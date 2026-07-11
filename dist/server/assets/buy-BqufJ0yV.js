import { r as reactExports, V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAuth, a as useNavigate, R as Route, s as supabase, L as Link, t as toast } from "./router-DudJYIfW.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { I as Input } from "./input-Cg1AgxSs.js";
import { B as Badge } from "./badge-Drtmlf7I.js";
import { A as Alert, a as AlertDescription } from "./alert-D-hhowZT.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-CVXx6z81.js";
import { f as formatCompactSize, a as formatNaira, b as formatUSD } from "./utils-vYOMvTwc.js";
import { B as Brand } from "./Brand-DUbFz4ZD.js";
import { T as ThemeToggle } from "./ThemeToggle-DWCK5KFm.js";
import { N as NotificationBell } from "./NotificationBell-DuD70SE4.js";
import { A as AppSidebar, M as MobileBottomNav } from "./AppShell-DrZPR5s_.js";
import { A as ArrowRight } from "./arrow-right-DLtychK9.js";
import { c as createLucideIcon } from "./createLucideIcon-DQobbSW9.js";
import { S as ShieldCheck } from "./shield-check-CoWiH9kN.js";
import { Z as Zap } from "./zap-CzElhQjl.js";
import { T as TriangleAlert } from "./triangle-alert-CQOpTpD9.js";
import { C as Clock } from "./clock-BmFxWi-H.js";
import { W as Wallet } from "./wallet-C6DygIpk.js";
import { T as TrendingUp } from "./trending-up-kxjckc06.js";
import { B as Ban } from "./ban-Dliy2Bex.js";
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
import "./index-BXyXc4LB.js";
import "./x-CGo4OehW.js";
import "./check-CNUFRDbJ.js";
import "./bell-Y6F42UIG.js";
import "./life-buoy-vP14qBbi.js";
import "./gift-DxQj5ZIr.js";
import "./chart-column-BfljMbKU.js";
import "./log-out-C92pR5mz.js";
import "./download-C5vXGTlG.js";
const __iconNode = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode);
function BuyPage() {
  const {
    isAuthenticated,
    user,
    session,
    profile
  } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [challenges, setChallenges] = reactExports.useState([]);
  const [selected, setSelected] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [confirmOpen, setConfirmOpen] = reactExports.useState(false);
  const [agreed, setAgreed] = reactExports.useState(false);
  const [planType, setPlanType] = reactExports.useState("standard");
  const [promoCode, setPromoCode] = reactExports.useState("");
  const [promoDiscount, setPromoDiscount] = reactExports.useState(null);
  const [partnerCode, setPartnerCode] = reactExports.useState(null);
  const [currency, setCurrency] = reactExports.useState("NGN");
  const [challengeType, setChallengeType] = reactExports.useState("2-step");
  const [selectedSize, setSelectedSize] = reactExports.useState(null);
  const [exchangeRate, setExchangeRate] = reactExports.useState(null);
  const [rateUpdatedAt, setRateUpdatedAt] = reactExports.useState(null);
  const [rateLoading, setRateLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    supabase.from("challenges").select("*").eq("is_active", true).order("account_size").then(({
      data
    }) => {
      const list = data ?? [];
      setChallenges(list);
      if (search.challenge) {
        const found = list.find((c) => c.id === search.challenge);
        if (found) {
          setSelected(found);
          setSelectedSize(Number(found.account_size));
          setChallengeType(found.challenge_type === "instant" ? "instant" : "2-step");
          setPlanType(found.challenge_type === "instant" ? "instant" : "standard");
          return;
        }
      }
      const hasParams = search.currency || search.type || search.size;
      if (hasParams) {
        if (search.currency === "USD" || search.currency === "NGN") setCurrency(search.currency);
        if (search.type === "instant") {
          setChallengeType("instant");
          setPlanType("instant");
        } else if (search.type === "2step") {
          setChallengeType("2-step");
          setPlanType("standard");
        }
        if (search.size) {
          const size = Number(search.size);
          setSelectedSize(size);
          const cur = search.currency || "NGN";
          const match = list.find((c) => c.currency === cur && Number(c.account_size) === size && (search.type === "instant" ? c.challenge_type === "instant" : c.challenge_type !== "instant"));
          if (match) setSelected(match);
        }
        return;
      }
      const std = list.filter((c) => c.currency === currency && c.challenge_type !== "instant");
      if (std.length > 0) {
        const target = currency === "NGN" ? std.find((c) => Number(c.account_size) === 4e5) || std[0] : std[0];
        setSelectedSize(Number(target.account_size));
        setSelected(target);
      }
    });
  }, [search.challenge, search.currency, search.type, search.size]);
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setPartnerCode(localStorage.getItem("fng-partner-ref"));
    } catch {
    }
  }, []);
  reactExports.useEffect(() => {
    if (currency !== "USD") return;
    let cancelled = false;
    const fetchRate = async () => {
      setRateLoading(true);
      try {
        const res = await fetch("/api/exchange-rate");
        const data = await res.json();
        if (!cancelled && data?.rate) {
          setExchangeRate(data.rate);
          setRateUpdatedAt(data.updatedAt ?? null);
        }
      } catch {
        if (!cancelled) setExchangeRate(1550);
      } finally {
        if (!cancelled) setRateLoading(false);
      }
    };
    fetchRate();
    const interval = setInterval(fetchRate, 5 * 60 * 1e3);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [currency]);
  reactExports.useEffect(() => {
    if (profile?.partner_referred_by) setPartnerCode("attached");
  }, [profile?.partner_referred_by]);
  const effectivePlanType = challengeType === "2-step" ? "standard" : "instant";
  const handleCurrencyChange = (c) => {
    setCurrency(c);
    setSelectedSize(null);
    setSelected(null);
    setPromoDiscount(null);
    setError("");
  };
  const handleChallengeTypeChange = (t) => {
    setChallengeType(t);
    setPlanType(t === "2-step" ? "standard" : "instant");
    setSelectedSize(null);
    setSelected(null);
    setPromoDiscount(null);
    setError("");
  };
  const visibleChallenges = challenges.filter((c) => c.currency === currency && (effectivePlanType === "instant" ? c.challenge_type === "instant" : c.challenge_type !== "instant"));
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setError("");
    const match = visibleChallenges.find((c) => Number(c.account_size) === size);
    if (match) setSelected(match);
  };
  const handleGetFunded = () => {
    if (!selectedSize) return;
    if (!isAuthenticated) {
      navigate({
        to: "/auth/register"
      });
      return;
    }
    setError("");
    setAgreed(false);
    setConfirmOpen(true);
  };
  const validatePromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return setPromoDiscount(null);
    if (!selected) return toast.error("Select a challenge first");
    const {
      data,
      error: error2
    } = await supabase.rpc("validate_discount_code", {
      _code: code,
      _challenge_id: selected.id
    });
    const row = Array.isArray(data) ? data[0] : null;
    if (!error2 && row) {
      setPromoDiscount({
        code: row.code,
        percent: Number(row.percent_off)
      });
      toast.success(`${row.percent_off}% discount applied`);
      return;
    }
    if (!partnerCode) {
      const {
        data: partnerValid
      } = await supabase.rpc("validate_partner_code", {
        _code: code
      });
      if (partnerValid) {
        setPromoDiscount(null);
        setPartnerCode(code);
        toast.success("Partner code applied: 15% off");
        return;
      }
    }
    setPromoDiscount(null);
    toast.error("Promo code is invalid or expired");
  };
  const effectivePrice = currency === "USD" ? selected?.usd_price ?? 0 : selected?.price_naira ?? 0;
  const partnerDiscountPercent = partnerCode ? 15 : 0;
  const promoDiscountPercent = promoDiscount?.percent ?? 0;
  const challengeDiscountPercent = selected?.discount_percent ?? 0;
  const discountPercent = promoDiscountPercent > 0 ? promoDiscountPercent : partnerDiscountPercent > 0 ? partnerDiscountPercent : challengeDiscountPercent;
  const discountAmount = selected ? Math.floor(Number(effectivePrice) * discountPercent / 100) : 0;
  const payable = selected ? Math.max(0, Number(effectivePrice) - discountAmount) : 0;
  const handleBuy = async () => {
    if (!selected) return;
    if (!user?.email) {
      setError("You need to be signed in with an email.");
      return;
    }
    if (!session?.access_token) {
      setError("Your session expired. Please sign in again.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const challengeId = selected.id;
      const res = await fetch("/api/initialize-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          challenge_id: challengeId,
          discount_code: promoDiscount?.code,
          partner_promo_code: partnerCode,
          currency,
          exchange_rate: exchangeRate
        })
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.ok) {
        setLoading(false);
        setError(result.error ?? "Could not start payment");
        return;
      }
      if (result.free && result.order_id) {
        setLoading(false);
        setConfirmOpen(false);
        toast.success("Challenge acquired! Your account is being prepared.");
        fetch("/api/notify-new-purchase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            order_id: result.order_id
          }),
          keepalive: true
        }).catch(() => {
        });
        navigate({
          to: "/dashboard"
        });
        return;
      }
      if (!result.authorization_url) {
        setLoading(false);
        setError("Could not start payment");
        return;
      }
      toast.message("Redirecting to checkout…");
      window.location.href = result.authorization_url;
    } catch (e) {
      setLoading(false);
      setError(e instanceof Error ? e.message : "Could not start payment");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen md:flex", children: [
    isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `min-w-0 flex-1 ${isAuthenticated ? "md:ml-60" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: isAuthenticated ? "md:hidden" : "", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, {}) }),
        isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 md:gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
          isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationBell, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/login", className: "text-sm font-medium text-foreground/80 transition-colors hover:text-primary", children: "Sign In" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", className: "font-display", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/register", children: "Get Funded" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: isAuthenticated ? "pb-24 md:pb-0" : "", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 py-10 md:px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-display border-primary/40 text-primary", children: "SELECT YOUR CHALLENGE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display mt-4 text-4xl font-bold", children: "Get Funded Today" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Choose your challenge parameters and get funded to trade." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-col gap-8 lg:flex-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-display mb-3 block text-xs tracking-widest text-muted-foreground", children: "CURRENCY" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center rounded-full border border-border bg-card p-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleCurrencyChange("NGN"), className: `font-display rounded-full px-6 py-2 text-xs tracking-wider transition-all ${currency === "NGN" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`, children: "NGN" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleCurrencyChange("USD"), className: `font-display rounded-full px-6 py-2 text-xs tracking-wider transition-all ${currency === "USD" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`, children: "USD" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-display mb-3 block text-xs tracking-widest text-muted-foreground", children: "CHALLENGE TYPE" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center rounded-full border border-border bg-card p-1", children: ["instant", "1-step", "2-step"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleChallengeTypeChange(t), className: `font-display rounded-full px-5 py-2 text-xs tracking-wider transition-all ${challengeType === t ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`, children: t === "instant" ? "INSTANT" : t === "1-step" ? "1-STEP" : "2-STEP" }, t)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-display mb-3 block text-xs tracking-widest text-muted-foreground", children: "ACCOUNT SIZE" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: visibleChallenges.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleSizeSelect(Number(c.account_size)), className: `font-display rounded-full border px-5 py-2 text-xs tracking-wider transition-all ${selectedSize === Number(c.account_size) ? "border-primary bg-primary text-primary-foreground shadow" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`, children: formatCompactSize(Number(c.account_size), currency) }, c.id)) })
            ] }),
            selected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/30 bg-card p-6 animate-fade-in", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Challenge" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                    selected.name,
                    " — ",
                    currency === "NGN" ? formatNaira(selected.account_size) : formatUSD(selected.account_size)
                  ] })
                ] }),
                currency === "USD" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-t border-border pt-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Exchange Rate" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm", children: rateLoading ? "Loading..." : exchangeRate ? `₦${exchangeRate.toLocaleString()}/$` : "—" })
                ] }),
                partnerCode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-t border-border pt-3 text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Partner link discount" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-primary", children: "15% off" })
                ] }),
                challengeDiscountPercent > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-t border-border pt-3 text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Challenge discount" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-primary", children: [
                    challengeDiscountPercent,
                    "% off"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: promoCode, onChange: (e) => setPromoCode(e.target.value.toUpperCase()), placeholder: "Promo code", className: "h-9" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "sm", variant: "outline", onClick: validatePromo, children: "Apply" })
                  ] }),
                  promoDiscount && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-primary", children: [
                    promoDiscount.code,
                    ": ",
                    promoDiscount.percent,
                    "% off applied"
                  ] })
                ] }),
                discountAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-t border-border pt-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Discount" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-primary", children: currency === "NGN" ? `-${formatNaira(discountAmount)}` : `-${formatUSD(discountAmount)}` })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-t border-border pt-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: currency === "USD" ? "Total (USD)" : "Total" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold text-primary", children: currency === "NGN" ? formatNaira(payable) : formatUSD(payable) })
                ] }),
                currency === "USD" && exchangeRate && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "NGN equivalent" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatNaira(Math.ceil(payable * exchangeRate)) })
                ] })
              ] }),
              currency === "USD" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-center text-[11px] text-muted-foreground", children: "Price shown in Naira equivalent at today's live USD/NGN rate. Paid via Squad." }),
              error && /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { variant: "destructive", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: error }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "font-display mt-5 w-full", size: "lg", onClick: handleGetFunded, disabled: loading || currency === "USD" && rateLoading, children: loading ? "Processing..." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                currency === "NGN" ? `Pay ${formatNaira(payable)} Now` : "Continue",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-center text-xs text-muted-foreground", children: [
                "By continuing you agree to our ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/agreement", className: "text-primary hover:underline", children: "trader agreement" }),
                " and acknowledge the risk disclosure."
              ] })
            ] }),
            !selected && visibleChallenges.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground", children: [
              "No ",
              currency,
              " ",
              effectivePlanType === "instant" ? "Instant" : "Standard",
              " challenges available right now."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full lg:w-80 xl:w-96", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-24 rounded-xl border border-border bg-card p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display mb-4 text-lg font-bold", children: "Account Summary" }),
            !selectedSize ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-8 text-center text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "mb-2 h-8 w-8 opacity-40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Select your options above to see the summary" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border pb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Account Size" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold", children: currency === "NGN" ? formatNaira(selectedSize) : formatUSD(selectedSize) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border pb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Challenge Fee" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-primary", children: selected ? currency === "NGN" ? formatNaira(payable) : formatUSD(payable) : currency === "NGN" ? formatNaira(0) : formatUSD(0) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border pb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Profit Target Phase 1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold", children: `${selected?.profit_target_percent ?? 0}%` })
              ] }),
              challengeType === "2-step" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border pb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Profit Target Phase 2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold", children: `${selected?.phase2_profit_target_percent ?? selected?.profit_target_percent ?? 0}%` })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border pb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Max Drawdown (Trailing)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold", children: `${selected?.max_drawdown_percent ?? 0}%` })
              ] }),
              effectivePlanType === "instant" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border pb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Daily Drawdown" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold", children: `${selected?.max_daily_drawdown_percent ?? 5}%` })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border pb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Min Trading Days" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold", children: currency === "USD" ? "5" : `${selected?.min_trading_days ?? 3}` })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border pb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Profit Split" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold", children: "80%" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border pb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Payouts" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold", children: currency === "USD" ? "Max 5 (10 business day cooldown)" : "Within 24 hrs" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "font-display mt-4 w-full", size: "lg", onClick: handleGetFunded, disabled: !selectedSize || loading, children: [
                currency === "NGN" ? "Get Funded" : "Get Funded",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: "You will be redirected to complete payment via Squad." })
            ] })
          ] }) })
        ] })
      ] }) })
    ] }),
    isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(MobileBottomNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: confirmOpen, onOpenChange: (o) => !loading && setConfirmOpen(o), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "mx-4 w-[calc(100%-2rem)] max-w-lg", children: (() => {
      const confirmSize = selectedSize;
      const confirmPrice = currency === "NGN" ? payable : exchangeRate ? Math.ceil(payable * exchangeRate) : 0;
      const confirmLabel = currency === "NGN" ? formatNaira(confirmSize ?? 0) : formatUSD(confirmSize ?? 0);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-2xl", children: selected?.name ?? "Challenge" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display block text-3xl font-bold text-primary", children: confirmLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "account size" })
          ] })
        ] }),
        selected !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 rounded-lg border border-border bg-background/50 p-4 text-sm", children: (selected?.challenge_type === "instant" ? [{
          icon: ShieldCheck,
          label: "Profit target",
          value: `${selected?.profit_target_percent ?? 0}%`
        }, {
          icon: Zap,
          label: "Max total drawdown",
          value: `${selected?.max_drawdown_percent ?? 0}%`
        }, {
          icon: TriangleAlert,
          label: "Daily drawdown",
          value: `${selected?.max_daily_drawdown_percent ?? 5}%`
        }, {
          icon: Clock,
          label: "Trading window",
          value: `5 – ${selected?.max_trading_days ?? 45} days`
        }, {
          icon: Layers,
          label: "Phases",
          value: "1-Step (Instant)"
        }, {
          icon: Wallet,
          label: "Profit split",
          value: "80%"
        }] : currency === "USD" ? [{
          icon: ShieldCheck,
          label: "Profit target Phase 1",
          value: "10%"
        }, {
          icon: ShieldCheck,
          label: "Profit target Phase 2",
          value: "5%"
        }, {
          icon: Zap,
          label: "Max drawdown (static)",
          value: "10%"
        }, {
          icon: TriangleAlert,
          label: "Daily drawdown",
          value: "5%"
        }, {
          icon: Clock,
          label: "Min hold time",
          value: "3 minutes"
        }, {
          icon: TrendingUp,
          label: "Profitable days required",
          value: "5 days (>=0.5% each)"
        }, {
          icon: Wallet,
          label: "Profit split",
          value: "80/20"
        }, {
          icon: Clock,
          label: "Payout cooldown",
          value: "10 business days"
        }, {
          icon: Layers,
          label: "Max payouts",
          value: "5 total"
        }, {
          icon: Ban,
          label: "Weekend holding",
          value: "Not allowed"
        }, {
          icon: Ban,
          label: "News trading",
          value: "+/-5 min blackout"
        }] : [{
          icon: ShieldCheck,
          label: "Profit target / phase",
          value: selected?.phase2_profit_target_percent ? `${selected?.profit_target_percent ?? 0}% / ${selected?.phase2_profit_target_percent}%` : `${selected?.profit_target_percent ?? 0}%`
        }, {
          icon: Zap,
          label: "Max drawdown",
          value: `${selected?.max_drawdown_percent ?? 0}%`
        }, {
          icon: Layers,
          label: "Phases to funded",
          value: `${selected?.phases ?? 2}`
        }, {
          icon: Clock,
          label: "Min trading days",
          value: `${selected?.min_trading_days ?? 3}`
        }, {
          icon: Wallet,
          label: "Profit split",
          value: "80%"
        }, {
          icon: Clock,
          label: "Payout processing",
          value: "Within 24 hrs"
        }]).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(r.icon, { className: "h-4 w-4 text-primary" }),
            " ",
            r.label
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold", children: r.value })
        ] }, r.label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-warning/30 bg-warning/5 p-3 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display block font-semibold text-warning", children: "Rules reminder" }),
          currency === "USD" ? "USD accounts: Min 3-minute hold on all trades (SL, TP, manual). 10% static drawdown from starting balance (based on closed balance, not floating equity). 5% daily drawdown (resets midnight UTC). No weekend holding — all positions must close before Friday 21:00 UTC (crypto exempt). News blackout: 5 minutes before/after high-impact events. 5 profitable trading days required per phase — each day must show >=0.5% net profit on your starting balance. Max 5 payouts per account. 10 business days between payouts. Inactivity limit: 15 days." : "Trade only on your FundedNG MT5 evaluation account. No automated trading. No copy trading. All trades must be held at least 3 minutes (manual, SL, and TP closes all count). 20% trailing drawdown from highest equity peak."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-background/50 p-3 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: agreed, onChange: (e) => setAgreed(e.target.checked), className: "mt-0.5 h-4 w-4 accent-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            "I have read and agree to the",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/agreement", className: "text-primary hover:underline", target: "_blank", children: "FundedNG trader agreement & risk disclosure" }),
            "."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t border-border pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Total due" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl font-bold text-primary", children: currency === "NGN" ? formatNaira(confirmPrice) : `${formatUSD(payable)} (${formatNaira(confirmPrice)})` })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { variant: "destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: error }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setConfirmOpen(false), disabled: loading, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "font-display", onClick: handleBuy, disabled: loading || !agreed, children: loading ? "Processing…" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Confirm & Pay ",
            currency === "NGN" ? formatNaira(confirmPrice) : formatUSD(payable),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
          ] }) })
        ] })
      ] });
    })() }) })
  ] });
}
export {
  BuyPage as component
};
