import { V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAdminData } from "./useAdminData-BK4UWKTz.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { B as Badge } from "./badge-Drtmlf7I.js";
import { I as Input } from "./input-Cg1AgxSs.js";
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
import "./utils-vYOMvTwc.js";
import "./kyc.functions-Ddgzg7nS.js";
import "./notify-email-fIZWdIiB.js";
function DiscountsPage() {
  const {
    discountCodes,
    discountForm,
    discountSaving,
    challengeList,
    setDiscountForm,
    saveDiscountCode,
    toggleDiscountActive
  } = useAdminData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Promo Discounts" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base font-bold", children: "Create Promo Discount" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Create percentage-off promo codes for checkout. Partner links already apply 15% off automatically." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid gap-2 sm:grid-cols-[1fr,120px,140px,180px,180px,auto]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "CODE", value: discountForm.code, onChange: (e) => setDiscountForm({
          ...discountForm,
          code: e.target.value.toUpperCase()
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 1, max: 100, step: 0.5, placeholder: "% off", value: discountForm.percent_off, onChange: (e) => setDiscountForm({
          ...discountForm,
          percent_off: e.target.value
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 1, placeholder: "Max uses", value: discountForm.max_redemptions, onChange: (e) => setDiscountForm({
          ...discountForm,
          max_redemptions: e.target.value
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "datetime-local", value: discountForm.expires_at, onChange: (e) => setDiscountForm({
          ...discountForm,
          expires_at: e.target.value
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: discountForm.challenge_id, onChange: (e) => setDiscountForm({
          ...discountForm,
          challenge_id: e.target.value
        }), className: "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Any Challenge" }),
          challengeList.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: c.id, children: [
            c.name,
            " — ",
            Number(c.account_size).toLocaleString()
          ] }, c.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveDiscountCode, disabled: discountSaving === "new", children: discountSaving === "new" ? "Saving…" : "Save" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: discountCodes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground", children: "No promo codes yet." }) : discountCodes.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-primary", children: d.code }),
          " · ",
          d.percent_off,
          "% off",
          d.challenge_id ? ` · ${challengeList.find((c) => c.id === d.challenge_id)?.name ?? "Specific challenge"}` : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          "Used ",
          d.redemption_count ?? 0,
          d.max_redemptions ? ` / ${d.max_redemptions}` : "",
          d.expires_at ? ` · Expires ${new Date(d.expires_at).toLocaleString()}` : " · No expiry"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "capitalize", children: d.is_active ? "active" : "inactive" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => toggleDiscountActive(d), disabled: discountSaving === d.id, children: d.is_active ? "Deactivate" : "Activate" })
      ] })
    ] }, d.id)) })
  ] });
}
export {
  DiscountsPage as component
};
