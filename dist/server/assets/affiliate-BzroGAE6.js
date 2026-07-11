import { r as reactExports, V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAuth, t as toast, s as supabase } from "./router-DudJYIfW.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { I as Input } from "./input-Cg1AgxSs.js";
import { B as Badge } from "./badge-Drtmlf7I.js";
import { a as formatNaira } from "./utils-vYOMvTwc.js";
import { R as RefreshButton } from "./refresh-button-AmVH5llR.js";
import { C as Copy } from "./copy-C8-365PD.js";
import { S as Share2 } from "./share-2-Cw7Dc8OK.js";
import { U as Users } from "./users-IaM0z4Ba.js";
import { W as Wallet } from "./wallet-C6DygIpk.js";
import { S as Send } from "./send-DLdGIVO8.js";
import { G as Gift } from "./gift-DxQj5ZIr.js";
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
import "./createLucideIcon-DQobbSW9.js";
function AffiliatePage() {
  const {
    user,
    profile
  } = useAuth();
  const [ap, setAp] = reactExports.useState(null);
  const [referrals, setReferrals] = reactExports.useState([]);
  const [commissions, setCommissions] = reactExports.useState([]);
  const [payouts, setPayouts] = reactExports.useState([]);
  const [freeAccounts, setFreeAccounts] = reactExports.useState([]);
  const [pendingReserved, setPendingReserved] = reactExports.useState(0);
  const [amount, setAmount] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [claiming, setClaiming] = reactExports.useState(false);
  const load = async () => {
    if (!user) return;
    const [a, r, c, p, fa] = await Promise.all([supabase.from("affiliate_profiles").select("code,total_earned_naira,total_paid_naira,free_accounts_credited,free_accounts_claimed").eq("user_id", user.id).maybeSingle(), supabase.from("referrals").select("*").eq("referrer_id", user.id).order("created_at", {
      ascending: false
    }), supabase.from("affiliate_commissions").select("*").eq("affiliate_user_id", user.id).order("created_at", {
      ascending: false
    }), supabase.from("affiliate_payouts").select("*").eq("user_id", user.id).order("requested_at", {
      ascending: false
    }), supabase.from("affiliate_free_accounts").select("*").eq("affiliate_id", user.id).order("created_at", {
      ascending: false
    })]);
    setAp(a.data ?? null);
    setReferrals(r.data ?? []);
    setCommissions(c.data ?? []);
    const list = p.data ?? [];
    setPayouts(list);
    setPendingReserved(list.filter((x) => ["pending", "approved"].includes(x.status)).reduce((s, x) => s + Number(x.amount_naira), 0));
    setFreeAccounts(fa.data ?? []);
  };
  reactExports.useEffect(() => {
    load();
  }, [user]);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const refLink = ap ? `${origin}/?ref=${ap.code}` : "";
  const copy = async (text, label = "Copied!") => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(label);
    } catch {
      toast.error("Copy failed");
    }
  };
  const share = async () => {
    if (!refLink) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join FundedNG",
          text: "Get funded to trade — use my referral link",
          url: refLink
        });
        return;
      } catch {
      }
    }
    copy(refLink, "Referral link copied!");
  };
  const balance = ap ? ap.total_earned_naira - ap.total_paid_naira - pendingReserved : 0;
  const freeAvailable = ap ? ap.free_accounts_credited - ap.free_accounts_claimed : 0;
  const paidReferrals = referrals.filter((r) => r.first_paid_at).length;
  const requestPayout = async () => {
    const amt = Number(amount.replace(/[^0-9]/g, ""));
    if (!amt || amt < 5e3) return toast.error("Minimum payout is ₦5,000");
    if (amt > balance) return toast.error("Amount exceeds available balance");
    if (!profile?.bank_account_number) return toast.error("Add your bank details on the dashboard first.");
    setSubmitting(true);
    const {
      error
    } = await supabase.rpc("request_affiliate_payout", {
      _amount: amt
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Payout requested. Processed within 24hrs of approval.");
    setAmount("");
    load();
  };
  const claimFree = async () => {
    if (freeAvailable <= 0) return;
    setClaiming(true);
    const {
      error
    } = await supabase.rpc("claim_free_account");
    setClaiming(false);
    if (error) return toast.error(error.message);
    toast.success("Free 200k account requested. Admin will provision it shortly.");
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-8 md:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold", children: "Affiliate Program" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Earn 10% on every sale you refer. Get a free 200k challenge for every 5 paid referrals." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshButton, { onRefresh: async () => {
        await load();
        toast.success("Affiliate data updated");
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-primary/40 bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-sm font-semibold text-primary", children: "YOUR REFERRAL LINK" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-col gap-2 sm:flex-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { readOnly: true, value: refLink, className: "flex-1 font-mono text-xs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => copy(refLink, "Link copied!"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "mr-1 h-4 w-4" }),
            "Copy"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: share, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "mr-1 h-4 w-4" }),
            "Share"
          ] })
        ] })
      ] }),
      ap && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-xs text-muted-foreground", children: [
        "Your code: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-foreground", children: ap.code }),
        " · Works on every domain we use, now and in the future."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Users, label: "Paid Referrals", value: paidReferrals.toString(), sub: `${referrals.length} total referred` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Wallet, label: "Available", value: formatNaira(Math.max(0, balance)), sub: "Min ₦5,000 to withdraw" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Send, label: "Total earned", value: formatNaira(ap?.total_earned_naira ?? 0), sub: `Paid: ${formatNaira(ap?.total_paid_naira ?? 0)}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Gift, label: "Free 200k accounts", value: `${freeAvailable}`, sub: `${ap?.free_accounts_claimed ?? 0} claimed · 5 per 5 referrals` })
    ] }),
    freeAvailable > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 rounded-2xl border border-gold/40 bg-gold/5 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-base font-bold", children: [
          "🎁 You have ",
          freeAvailable,
          " free 200k challenge account",
          freeAvailable > 1 ? "s" : "",
          " available"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "1 free account per 5 paid referrals · max 5 lifetime · admin will deliver MT5 credentials shortly after you claim." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: claimFree, disabled: claiming, className: "font-display", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "mr-1 h-4 w-4" }),
        claiming ? "Claiming..." : "Claim 1 Free Account"
      ] })
    ] }) }),
    freeAccounts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base font-bold", children: "Your Free Account Claims" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 divide-y divide-border", children: freeAccounts.map((fa) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display font-semibold", children: [
            "Batch #",
            fa.referral_batch,
            " · ",
            formatNaira(fa.account_size ?? 2e5)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "capitalize", children: fa.status })
        ] }),
        fa.status === "fulfilled" && fa.mt5_login ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 grid gap-1 rounded-md border border-border bg-background p-3 font-mono text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Login: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: fa.mt5_login })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Server: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: fa.mt5_server })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Password: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: fa.mt5_password })
          ] }),
          fa.investor_password && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Investor pw: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: fa.investor_password })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: fa.status === "pending" ? "Waiting for admin to deliver MT5 credentials." : `Status: ${fa.status}` })
      ] }, fa.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base font-bold", children: "Request a Payout" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Minimum ₦5,000 · processed within 24hrs of admin approval · one request per 7 days." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-col gap-2 sm:flex-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", inputMode: "numeric", placeholder: `Up to ${formatNaira(Math.max(0, balance))}`, value: amount, onChange: (e) => setAmount(e.target.value), className: "flex-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: requestPayout, disabled: submitting || balance < 5e3, className: "font-display", children: submitting ? "Requesting..." : "Request Payout" })
      ] }),
      balance < 5e3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-muted-foreground", children: [
        "You need at least ",
        formatNaira(5e3),
        " available balance to request a payout."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base font-bold", children: "Recent Commissions" }),
      commissions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "No commissions yet. Share your link to start earning." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 divide-y divide-border", children: commissions.slice(0, 10).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: new Date(c.created_at).toLocaleDateString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-primary", children: formatNaira(c.amount_naira) })
      ] }, c.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base font-bold", children: "Payout History" }),
      payouts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "No payouts yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 divide-y divide-border", children: payouts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: new Date(p.requested_at).toLocaleDateString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "capitalize", children: p.status }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold", children: formatNaira(p.amount_naira) })
        ] })
      ] }, p.id)) })
    ] })
  ] });
}
function Stat({
  icon: Icon,
  label,
  value,
  sub
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
      " ",
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display mt-2 text-2xl font-bold", children: value }),
    sub && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[11px] text-muted-foreground", children: sub })
  ] });
}
export {
  AffiliatePage as component
};
