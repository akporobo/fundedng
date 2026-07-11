import { r as reactExports, V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAdminData } from "./useAdminData-BK4UWKTz.js";
import { t as toast, s as supabase } from "./router-DudJYIfW.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { B as Badge } from "./badge-Drtmlf7I.js";
import { L as Label } from "./label-BvHzfEVS.js";
import { a as formatNaira } from "./utils-vYOMvTwc.js";
import { C as CertificateCard } from "./CertificateCard-CdYnQtt5.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-CVXx6z81.js";
import { T as Textarea } from "./textarea-DHbGpYnD.js";
import { C as Copy } from "./copy-C8-365PD.js";
import { D as Download } from "./download-C5vXGTlG.js";
import { c as createLucideIcon } from "./createLucideIcon-DQobbSW9.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./kyc.functions-Ddgzg7nS.js";
import "./client.server-B4evwzKW.js";
import "./notify-email-fIZWdIiB.js";
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
import "./index-BX1kfvFW.js";
import "./index-DtbDbYbe.js";
import "./index-CYEXyF5B.js";
import "./chevron-right-CVZD1doD.js";
import "./check-CNUFRDbJ.js";
import "./x-CGo4OehW.js";
const __iconNode = [
  ["path", { d: "M12 10h.01", key: "1nrarc" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M12 6h.01", key: "1vi96p" }],
  ["path", { d: "M16 10h.01", key: "1m94wz" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M16 6h.01", key: "1x0f13" }],
  ["path", { d: "M8 10h.01", key: "19clt8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M8 6h.01", key: "1dz90k" }],
  ["path", { d: "M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3", key: "cabbwy" }],
  ["rect", { x: "4", y: "2", width: "16", height: "20", rx: "2", key: "1uxh74" }]
];
const Building = createLucideIcon("building", __iconNode);
function BankDetails({
  details
}) {
  if (!details) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 rounded-lg border border-border bg-muted/30 p-3 text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { className: "h-3 w-3" }),
      " Bank Details"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Bank" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: details.bank_name ?? "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Account Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: details.account_name ?? "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Account Number" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 font-mono font-bold text-foreground", children: [
          details.account_number ?? "—",
          details.account_number && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
            navigator.clipboard.writeText(details.account_number);
            toast.success("Copied");
          }, className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" }) })
        ] })
      ] })
    ] })
  ] });
}
function PayoutsPage() {
  const {
    payouts,
    updatePayout,
    payoutRejectTarget,
    payoutRejectReason,
    payoutRejecting,
    setPayoutRejectTarget,
    setPayoutRejectReason,
    openPayoutRejectDialog,
    submitPayoutReject
  } = useAdminData();
  const [certTarget, setCertTarget] = reactExports.useState(null);
  const [certLoading, setCertLoading] = reactExports.useState(null);
  async function openPayoutCertificate(p) {
    setCertLoading(p.id);
    try {
      const {
        data
      } = await supabase.from("certificates").select("*").eq("payout_id", p.id).eq("kind", "payout").order("issued_at", {
        ascending: false
      }).limit(1).maybeSingle();
      if (data) {
        setCertTarget(data);
      } else {
        setCertTarget({
          id: p.id,
          kind: "payout",
          certificate_number: `FNG-PAY-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          full_name: p.profiles?.full_name ?? "Trader",
          account_size: p.trader_accounts?.account_size ?? 0,
          challenge_name: p.trader_accounts?.challenges?.name ?? "Challenge",
          mt5_login: p.trader_accounts?.mt5_login ?? "",
          payout_amount: p.amount_naira,
          issued_at: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    } catch {
      setCertTarget({
        id: p.id,
        kind: "payout",
        certificate_number: `FNG-PAY-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        full_name: p.profiles?.full_name ?? "Trader",
        account_size: p.trader_accounts?.account_size ?? 0,
        challenge_name: p.trader_accounts?.challenges?.name ?? "Challenge",
        mt5_login: p.trader_accounts?.mt5_login ?? "",
        payout_amount: p.amount_naira,
        issued_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    } finally {
      setCertLoading(null);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Trader Payouts" }),
    payouts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No payout requests yet." }),
    payouts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[200px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: p.profiles?.full_name ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          p.trader_accounts?.mt5_login,
          " · ",
          p.payment_method,
          " ",
          p.trader_accounts?.currency === "USD" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "ml-1 border-blue-400/40 text-blue-500 text-[10px]", children: "USD" })
        ] }),
        p.payment_method === "usdt" && p.wallet_address && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-1.5 text-xs text-muted-foreground/70 break-all", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: p.wallet_address }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
            navigator.clipboard.writeText(p.wallet_address);
            toast.success("Copied");
          }, className: "text-muted-foreground hover:text-foreground shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3 w-3" }) })
        ] }),
        p.payment_method === "bank_transfer" && /* @__PURE__ */ jsxRuntimeExports.jsx(BankDetails, { details: p.bank_details })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-primary", children: formatNaira(p.amount_naira) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-display", children: p.status.toUpperCase() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        p.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => updatePayout(p, "approved"), children: "Approve" }),
        p.status === "approved" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => updatePayout(p, "paid"), children: "Mark Paid" }),
        (p.status === "paid" || p.status === "approved") && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-8 w-8 p-0", disabled: certLoading === p.id, onClick: () => openPayoutCertificate(p), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }) }),
        p.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => openPayoutRejectDialog(p), children: "Reject" })
      ] })
    ] }) }, p.id)),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!payoutRejectTarget, onOpenChange: (o) => !payoutRejecting && !o && setPayoutRejectTarget(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "mx-4 w-[calc(100%-2rem)] max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Reject Payout" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Rejecting payout for ",
          payoutRejectTarget?.profiles?.full_name ?? "trader",
          " (",
          formatNaira(payoutRejectTarget?.amount_naira ?? 0),
          ")."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "payout-reject-reason", children: "Reason for breach" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "payout-reject-reason", placeholder: "State the reason for breach...", value: payoutRejectReason, onChange: (e) => setPayoutRejectReason(e.target.value), rows: 4 })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => {
          setPayoutRejectTarget(null);
          setPayoutRejectReason("");
        }, disabled: payoutRejecting, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: submitPayoutReject, disabled: payoutRejecting || !payoutRejectReason.trim(), children: payoutRejecting ? "Rejecting…" : "Reject Payout" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!certTarget, onOpenChange: (o) => {
      if (!o) setCertTarget(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Payout Certificate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Preview and download the same certificate traders see." })
      ] }),
      certTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(CertificateCard, { cert: certTarget })
    ] }) })
  ] });
}
export {
  PayoutsPage as component
};
