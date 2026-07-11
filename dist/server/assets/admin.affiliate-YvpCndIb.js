import { V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAdminData } from "./useAdminData-BK4UWKTz.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { B as Badge } from "./badge-Drtmlf7I.js";
import { I as Input } from "./input-Cg1AgxSs.js";
import { L as Label } from "./label-BvHzfEVS.js";
import { a as formatNaira } from "./utils-vYOMvTwc.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-CVXx6z81.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-DudJYIfW.js";
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
import "./kyc.functions-Ddgzg7nS.js";
import "./notify-email-fIZWdIiB.js";
import "./index-BXyXc4LB.js";
import "./x-CGo4OehW.js";
import "./createLucideIcon-DQobbSW9.js";
function AffiliatePage() {
  const {
    affiliateStats,
    affiliateSummary,
    affPayouts,
    freeClaims,
    affSaving,
    tgBotToken,
    tgChatId,
    tgSaving,
    tgTesting,
    setAffPayoutStatus,
    setFreeClaimStatus,
    openDeliverClaim,
    submitDeliverClaim,
    deliverClaimFor,
    claimForm,
    deliveringClaim,
    setDeliverClaimFor,
    setClaimForm,
    setTgBotToken,
    setTgChatId,
    saveTelegram,
    testTelegram
  } = useAdminData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Affiliate Management" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-6", children: [["Total Affiliates", affiliateSummary.total, ""], ["Total Referrals", affiliateSummary.referrals, ""], ["Total Earned (₦)", formatNaira(affiliateSummary.earned), "text-primary"], ["Total Paid (₦)", formatNaira(affiliateSummary.paid), "text-green-500"], ["Pending (₦)", formatNaira(affiliateSummary.pending), "text-warning"], ["Revenue Generated (₦)", formatNaira(affiliateSummary.revenue), "text-primary"]].map(([l, v, c]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: l }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `font-display mt-1 text-lg font-bold ${c ?? ""}`, children: v })
    ] }, l)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-bold", children: "All Affiliates" }),
      affiliateStats.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground", children: "No affiliates yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-2", children: affiliateStats.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[160px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: a.profile?.full_name ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            "Code: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-primary", children: a.code })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-4 gap-y-1 text-xs md:grid-cols-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Refs: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display", children: a.referralCount }),
            a.paidReferralCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground/60", children: [
              " (",
              a.paidReferralCount,
              " paid)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Earned: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-primary", children: formatNaira(Number(a.total_earned_naira)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Paid: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-green-500", children: formatNaira(Number(a.total_paid_naira)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Pending: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-display ${a.pendingCommissions > 0 ? "text-warning" : ""}`, children: formatNaira(a.pendingCommissions) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Revenue: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-primary", children: formatNaira(a.totalRevenue) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Acct Size: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display", children: formatNaira(a.totalAccountSize) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Free Accts: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display", children: [
              a.free_accounts_credited,
              " credited / ",
              a.free_accounts_claimed,
              " claimed"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Orders: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display", children: a.ordersCount })
          ] })
        ] })
      ] }) }, a.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-bold", children: "Payout Requests" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-3", children: affPayouts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground", children: "No affiliate payout requests yet." }) : affPayouts.map((p) => {
        const bd = p.bank_details ?? {};
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
                p.profiles?.full_name ?? "—",
                " · ",
                formatNaira(p.amount_naira)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                "Requested ",
                new Date(p.requested_at).toLocaleString()
              ] }),
              bd.account_number && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
                bd.bank_name,
                " · ",
                bd.account_number,
                " · ",
                bd.account_name
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "capitalize", children: p.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
            p.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => setAffPayoutStatus(p.id, "approved"), disabled: affSaving === p.id, children: "Approve" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => setAffPayoutStatus(p.id, "rejected"), disabled: affSaving === p.id, children: "Reject" })
            ] }),
            p.status === "approved" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => setAffPayoutStatus(p.id, "paid"), disabled: affSaving === p.id, children: "Mark as paid" })
          ] })
        ] }, p.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-bold", children: "Free Account Claims" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-3", children: freeClaims.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground", children: "No free-account claims yet." }) : freeClaims.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
              c.profiles?.full_name ?? "—",
              " · Free ",
              formatNaira(c.account_size),
              " challenge"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              "Batch #",
              c.referral_batch,
              " · Claimed ",
              new Date(c.created_at).toLocaleString(),
              c.mt5_login && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                " · Login ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: c.mt5_login })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "capitalize", children: c.status })
        ] }),
        c.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => openDeliverClaim(c), disabled: affSaving === c.id, children: "Deliver account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => setFreeClaimStatus(c.id, "rejected"), disabled: affSaving === c.id, children: "Reject" })
        ] })
      ] }, c.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-bold", children: "Telegram Admin Notifications" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
        "Get realtime pings for new orders, payout requests, free-account claims, support tickets and account-delivery requests. Create a bot via ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-primary underline", href: "https://t.me/BotFather", target: "_blank", rel: "noreferrer", children: "@BotFather" }),
        ", then send your bot a message and find your ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: "chat_id" }),
        " at",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-primary underline", href: "https://api.telegram.org/bot<TOKEN>/getUpdates", target: "_blank", rel: "noreferrer", children: "api.telegram.org" }),
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-3 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "tg-token", children: "Bot token" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "tg-token", type: "password", value: tgBotToken, onChange: (e) => setTgBotToken(e.target.value), placeholder: "123456:ABC..." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "tg-chat", children: "Chat ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "tg-chat", value: tgChatId, onChange: (e) => setTgChatId(e.target.value), placeholder: "e.g. 123456789 or -100123..." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveTelegram, disabled: tgSaving, children: tgSaving ? "Saving…" : "Save settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: testTelegram, disabled: tgTesting || !tgBotToken || !tgChatId, children: tgTesting ? "Sending…" : "Send test message" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!deliverClaimFor, onOpenChange: (o) => !o && setDeliverClaimFor(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Deliver free affiliate account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: deliverClaimFor && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Affiliate: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: deliverClaimFor.profiles?.full_name ?? "—" }),
          " · Free ",
          formatNaira(deliverClaimFor.account_size ?? 2e5),
          " challenge (batch #",
          deliverClaimFor.referral_batch,
          ")"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "claim-login", children: "MT5 Login" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "claim-login", value: claimForm.login, onChange: (e) => setClaimForm({
            ...claimForm,
            login: e.target.value
          }), placeholder: "e.g. 12345678" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "claim-server", children: "Server" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "claim-server", value: claimForm.server, onChange: (e) => setClaimForm({
            ...claimForm,
            server: e.target.value
          }), placeholder: "e.g. Exness-MT5Demo" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "claim-password", children: "Master password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "claim-password", value: claimForm.password, onChange: (e) => setClaimForm({
            ...claimForm,
            password: e.target.value
          }), placeholder: "Trading password" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "claim-investor", children: "Investor password (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "claim-investor", value: claimForm.investor, onChange: (e) => setClaimForm({
            ...claimForm,
            investor: e.target.value
          }), placeholder: "Read-only password" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDeliverClaimFor(null), disabled: deliveringClaim, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submitDeliverClaim, disabled: deliveringClaim, children: deliveringClaim ? "Delivering…" : "Deliver to affiliate" })
      ] })
    ] }) })
  ] });
}
export {
  AffiliatePage as component
};
