import { V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAdminData } from "./useAdminData-BK4UWKTz.js";
import { a as formatNaira } from "./utils-vYOMvTwc.js";
import { A as Alert, a as AlertDescription } from "./alert-D-hhowZT.js";
import { T as TriangleAlert } from "./triangle-alert-CQOpTpD9.js";
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
import "./createLucideIcon-DQobbSW9.js";
function OverviewPage() {
  const {
    stats,
    unprovisionedOrders
  } = useAdminData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
    unprovisionedOrders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", className: "mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { children: [
        "⚠️ ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
          unprovisionedOrders.length,
          " paid order(s)"
        ] }),
        " have no account delivered.",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/admin/pending", className: "cursor-pointer underline", children: "Check the Pending tab immediately." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-4", children: [["Traders", stats.traders], ["Accounts Sold (Funded Value)", formatNaira(stats.sold), "text-primary"], ["Accounts Delivered", stats.accounts], ["Active", stats.active], ["Passed", stats.passed], ["Funded", stats.funded, "text-primary"], ["Breached", stats.breached], ["Pass Rate", `${stats.passRate}%`, "text-gold"], ["Pending Payouts", stats.pending, "text-warning"], ["Revenue", formatNaira(stats.revenue), "text-primary"], ["Payouts Paid", formatNaira(stats.paid), "text-destructive"]].map(([l, v, c]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: l }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `font-display mt-2 text-2xl font-bold ${c ?? ""}`, children: v })
    ] }, l)) })
  ] });
}
export {
  OverviewPage as component
};
