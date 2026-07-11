import { V as jsxRuntimeExports, a0 as Outlet } from "./worker-entry-DS7H0w4O.js";
import { A as AdminDataProvider, u as useAdminData } from "./useAdminData-BK4UWKTz.js";
import { R as RefreshButton } from "./refresh-button-AmVH5llR.js";
import { t as toast } from "./router-DudJYIfW.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./utils-vYOMvTwc.js";
import "./kyc.functions-Ddgzg7nS.js";
import "./client.server-B4evwzKW.js";
import "./notify-email-fIZWdIiB.js";
import "./button-CVkRzbLJ.js";
import "./createLucideIcon-DQobbSW9.js";
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
function AdminLayout() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminDataProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminPageInner, {}) });
}
function AdminPageInner() {
  const {
    load,
    loadPool
  } = useAdminData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-8 md:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold", children: "Admin Console" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshButton, { onRefresh: async () => {
        await load();
        await loadPool();
        toast.success("Admin data updated");
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {})
  ] });
}
export {
  AdminLayout as component
};
