import { V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAdminData } from "./useAdminData-BK4UWKTz.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { B as Badge } from "./badge-Drtmlf7I.js";
import { I as Input } from "./input-Cg1AgxSs.js";
import { L as Label } from "./label-BvHzfEVS.js";
import { b as formatUSD, a as formatNaira } from "./utils-vYOMvTwc.js";
import { s as supabase, t as toast } from "./router-DudJYIfW.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-CVXx6z81.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BIdxB6Jz.js";
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
import "./x-CGo4OehW.js";
import "./createLucideIcon-DQobbSW9.js";
import "./index-BX1kfvFW.js";
import "./index-DtbDbYbe.js";
import "./index-CYEXyF5B.js";
import "./index-DoApm__Q.js";
import "./check-CNUFRDbJ.js";
function PartnersPage() {
  const {
    partners,
    partnerPayouts,
    partnerSaving,
    newPartnerEmail,
    newPartnerRate,
    newPartnerChallengeId,
    newPartnerPromoCode,
    addingPartner,
    editingPartner,
    editRateValue,
    editChallengeId,
    editPromoCode,
    partnerFreeAccounts,
    deliverPartnerFreeFor,
    partnerFreeForm,
    deliveringPartnerFree,
    setEditingPartner,
    setEditRateValue,
    setEditChallengeId,
    setEditPromoCode,
    setNewPartnerEmail,
    setNewPartnerRate,
    setNewPartnerChallengeId,
    setNewPartnerPromoCode,
    addPartner,
    saveCommissionRate,
    togglePartnerActive,
    deletePartner,
    setPartnerPayoutStatus,
    setDeliverPartnerFreeFor,
    setPartnerFreeForm,
    openDeliverPartnerFree,
    submitDeliverPartnerFree,
    challengeList,
    loadPartners
  } = useAdminData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Partner Management" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base font-bold", children: "Assign Partner Role" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Enter the user's email and commission rate. Promo code is auto-generated from their name if left blank." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid gap-2 sm:grid-cols-[1fr,140px,200px,160px,auto]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "user@example.com", value: newPartnerEmail, onChange: (e) => setNewPartnerEmail(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0, max: 100, step: 0.5, placeholder: "Rate %", value: newPartnerRate, onChange: (e) => setNewPartnerRate(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: newPartnerChallengeId, onValueChange: setNewPartnerChallengeId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Free account" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__none__", children: "No free account" }),
            challengeList.filter((c) => c.is_active).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: c.id, children: [
              c.name,
              " (",
              (c.currency === "USD" ? formatUSD : formatNaira)(c.account_size),
              ")"
            ] }, c.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Promo code (optional)", value: newPartnerPromoCode, onChange: (e) => setNewPartnerPromoCode(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: addPartner, disabled: addingPartner, children: addingPartner ? "Adding…" : "Add Partner" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground", children: "All Partners" }),
      partners.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground", children: "No partners yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: partners.map((p) => {
        const pendingForThis = partnerPayouts.filter((pp) => pp.partner_id === p.user_id && pp.status === "pending").length;
        const balance = Math.max(0, Number(p.total_earned_naira ?? 0) - Number(p.total_paid_naira ?? 0));
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display font-semibold", children: [
              p.profiles?.full_name ?? "—",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 font-mono text-xs text-primary", children: p.promo_code })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
              "Commission: ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
                p.commission_rate,
                "%"
              ] }),
              " · Earned: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: formatNaira(p.total_earned_naira) }),
              " · Paid: ",
              formatNaira(p.total_paid_naira),
              " · Available: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: formatNaira(balance) }),
              pendingForThis > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 rounded-full bg-warning/20 px-2 py-0.5 text-[10px] text-warning", children: [
                pendingForThis,
                " pending payout"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 text-[11px] text-muted-foreground/70", children: [
              "Free account: ",
              p.free_challenge ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground/80", children: [
                p.free_challenge.name,
                " (",
                (p.free_challenge.currency === "USD" ? formatUSD : formatNaira)(p.free_challenge.account_size),
                ")"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic", children: "None" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => {
              setEditingPartner(p);
              setEditRateValue(String(p.commission_rate));
              setEditChallengeId(p.free_account_challenge_id ?? "");
              setEditPromoCode(p.promo_code ?? "");
            }, children: "Edit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: p.is_active ? "outline" : "default", onClick: () => togglePartnerActive(p), disabled: partnerSaving === p.id, children: p.is_active ? "Deactivate" : "Activate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "destructive", onClick: () => deletePartner(p), disabled: partnerSaving === p.id, children: "Delete" })
          ] })
        ] }) }, p.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground", children: "Partner Free Account Requests" }),
      partnerFreeAccounts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground", children: "No partner free-account requests yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: partnerFreeAccounts.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: c.profiles?.full_name ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              "Free ",
              c.challenges ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                c.challenges.name,
                " (",
                (c.challenges.currency === "USD" ? formatUSD : formatNaira)(c.challenges.account_size),
                ")"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                c.challenge_name ?? "Challenge",
                " (",
                formatNaira(c.account_size),
                ")"
              ] }),
              " · Requested ",
              new Date(c.requested_at).toLocaleString(),
              c.mt5_login && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                " · Login ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: c.mt5_login })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "capitalize", children: c.status })
        ] }),
        c.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => openDeliverPartnerFree(c), disabled: partnerSaving === c.id, children: "Deliver account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: async () => {
            setPartnerSaving(c.id);
            const {
              error
            } = await supabase.from("partner_free_accounts").update({
              status: "rejected"
            }).eq("id", c.id);
            setPartnerSaving(null);
            if (error) toast.error(error.message);
            else {
              toast.success("Rejected");
              loadPartners();
            }
          }, disabled: partnerSaving === c.id, children: "Reject" })
        ] }),
        c.status === "fulfilled" && c.challenges && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-xs text-muted-foreground", children: [
          "Delivered: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: c.mt5_login }),
          " on ",
          c.mt5_server,
          " · Phase ",
          c.challenges.phases,
          "-step · Target ",
          c.challenges.profit_target_percent,
          "% · Max DD ",
          c.challenges.max_drawdown_percent,
          "%"
        ] })
      ] }, c.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground", children: "Partner Payout Requests" }),
      partnerPayouts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground", children: "No payout requests yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: partnerPayouts.map((pp) => {
        const bd = pp.bank_details ?? {};
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
                pp.profiles?.full_name ?? "—",
                " · ",
                formatNaira(pp.amount_naira)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                "Requested ",
                new Date(pp.requested_at).toLocaleString()
              ] }),
              bd.account_number && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
                bd.bank_name,
                " · ",
                bd.account_number,
                " · ",
                bd.account_name
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "capitalize", children: pp.status })
          ] }),
          pp.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => setPartnerPayoutStatus(pp.id, "approved"), disabled: partnerSaving === pp.id, children: "Approve" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => setPartnerPayoutStatus(pp.id, "paid"), disabled: partnerSaving === pp.id, children: "Mark Paid" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "destructive", onClick: () => setPartnerPayoutStatus(pp.id, "rejected"), disabled: partnerSaving === pp.id, children: "Reject" })
          ] }),
          pp.status === "approved" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => setPartnerPayoutStatus(pp.id, "paid"), disabled: partnerSaving === pp.id, children: "Mark Paid" }) })
        ] }, pp.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editingPartner, onOpenChange: (o) => {
      if (!o) setEditingPartner(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Partner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          editingPartner?.profiles?.full_name,
          " · ",
          editingPartner?.promo_code
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-rate", children: "Commission %" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "edit-rate", type: "number", min: 0, max: 100, step: 0.5, value: editRateValue, onChange: (e) => setEditRateValue(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-promo", children: "Promo Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "edit-promo", value: editPromoCode, onChange: (e) => setEditPromoCode(e.target.value), placeholder: "e.g. JOHN4F3A" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Free Account Challenge" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: editChallengeId || "__none__", onValueChange: (v) => setEditChallengeId(v === "__none__" ? "" : v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select free account" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__none__", children: "No free account" }),
              challengeList.filter((c) => c.is_active).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: c.id, children: [
                c.name,
                " (",
                (c.currency === "USD" ? formatUSD : formatNaira)(c.account_size),
                ")"
              ] }, c.id))
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setEditingPartner(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveCommissionRate, disabled: !!partnerSaving, children: "Save" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!deliverPartnerFreeFor, onOpenChange: (o) => !o && setDeliverPartnerFreeFor(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Deliver free partner account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: deliverPartnerFreeFor && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Partner: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: deliverPartnerFreeFor.profiles?.full_name ?? "—" }),
          " · Free ",
          () => {
            const ch = deliverPartnerFreeFor.challenges;
            return ch ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              ch.name,
              " (",
              (ch.currency === "USD" ? formatUSD : formatNaira)(ch.account_size),
              ")"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              deliverPartnerFreeFor.challenge_name ?? "Challenge",
              " (",
              deliverPartnerFreeFor.account_size ? formatNaira(deliverPartnerFreeFor.account_size) : "—",
              ")"
            ] });
          }
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "partner-free-login", children: "MT5 Login" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "partner-free-login", value: partnerFreeForm.login, onChange: (e) => setPartnerFreeForm({
            ...partnerFreeForm,
            login: e.target.value
          }), placeholder: "e.g. 12345678" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "partner-free-server", children: "Server" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "partner-free-server", value: partnerFreeForm.server, onChange: (e) => setPartnerFreeForm({
            ...partnerFreeForm,
            server: e.target.value
          }), placeholder: "e.g. Exness-MT5Demo" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "partner-free-password", children: "Master password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "partner-free-password", value: partnerFreeForm.password, onChange: (e) => setPartnerFreeForm({
            ...partnerFreeForm,
            password: e.target.value
          }), placeholder: "Trading password" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "partner-free-investor", children: "Investor password (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "partner-free-investor", value: partnerFreeForm.investor, onChange: (e) => setPartnerFreeForm({
            ...partnerFreeForm,
            investor: e.target.value
          }), placeholder: "Read-only password" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDeliverPartnerFreeFor(null), disabled: deliveringPartnerFree, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submitDeliverPartnerFree, disabled: deliveringPartnerFree, children: deliveringPartnerFree ? "Delivering…" : "Deliver to partner" })
      ] })
    ] }) })
  ] });
}
export {
  PartnersPage as component
};
