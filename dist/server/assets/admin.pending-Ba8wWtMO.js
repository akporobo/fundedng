import { V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAdminData } from "./useAdminData-BK4UWKTz.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { B as Badge } from "./badge-Drtmlf7I.js";
import { b as formatUSD, a as formatNaira } from "./utils-vYOMvTwc.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-CVXx6z81.js";
import { I as Input } from "./input-Cg1AgxSs.js";
import { L as Label } from "./label-BvHzfEVS.js";
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
function PendingPage() {
  const {
    pendingRequests,
    deliverFor,
    form,
    delivering,
    setDeliverFor,
    setForm,
    openDeliver,
    submitDelivery,
    deleteRequest
  } = useAdminData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Pending Account Delivery" }),
    pendingRequests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground", children: "No pending accounts. New paid orders will appear here for manual delivery." }) : pendingRequests.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[200px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: r.profiles?.full_name ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            r.challenges?.name,
            " · ",
            r.orders?.currency === "USD" ? formatUSD(r.challenges?.account_size ?? 0) : formatNaira(r.challenges?.account_size ?? 0),
            " ",
            r.orders?.currency === "USD" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "ml-1 border-blue-400/40 text-blue-500 text-[10px]", children: "USD" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `font-display ${r.status === "failed" ? "border-destructive/40 text-destructive" : "border-warning/40 text-warning"}`, children: r.status.toUpperCase() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => openDeliver(r), children: "Deliver manually" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "text-destructive border-destructive/30 hover:bg-destructive/10", onClick: () => deleteRequest(r), children: "Delete" })
      ] }),
      r.failure_reason && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 rounded-md border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive", children: r.failure_reason })
    ] }, r.id)),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!deliverFor, onOpenChange: (o) => !o && setDeliverFor(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Deliver MT5 account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: deliverFor && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Trader: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: deliverFor.profiles?.full_name ?? "—" }),
          " · ",
          deliverFor.challenges?.name,
          " (",
          deliverFor.orders?.currency === "USD" ? formatUSD(deliverFor.challenges?.account_size ?? 0) : formatNaira(deliverFor.challenges?.account_size ?? 0),
          ")"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "login", children: "MT5 Login" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "login", value: form.login, onChange: (e) => setForm({
            ...form,
            login: e.target.value
          }), placeholder: "e.g. 12345678" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "server", children: "Server" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "server", value: form.server, onChange: (e) => setForm({
            ...form,
            server: e.target.value
          }), placeholder: "e.g. ICMarketsSC-Demo" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Master password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", value: form.password, onChange: (e) => setForm({
            ...form,
            password: e.target.value
          }), placeholder: "Trading password" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "investor", children: "Investor password (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "investor", value: form.investor, onChange: (e) => setForm({
            ...form,
            investor: e.target.value
          }), placeholder: "Read-only password" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDeliverFor(null), disabled: delivering, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submitDelivery, disabled: delivering, children: delivering ? "Delivering…" : "Deliver to trader" })
      ] })
    ] }) })
  ] });
}
export {
  PendingPage as component
};
