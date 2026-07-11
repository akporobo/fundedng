import { r as reactExports, V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAuth, a as useNavigate, b as useLocation } from "./router-DudJYIfW.js";
import { a as AppShell } from "./AppShell-DrZPR5s_.js";
import { L as LoaderCircle } from "./loader-circle-DcDrkJ-1.js";
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
import "./Brand-DUbFz4ZD.js";
import "./NotificationBell-DuD70SE4.js";
import "./createLucideIcon-DQobbSW9.js";
import "./utils-vYOMvTwc.js";
import "./check-CNUFRDbJ.js";
import "./bell-Y6F42UIG.js";
import "./ThemeToggle-DWCK5KFm.js";
import "./button-CVkRzbLJ.js";
import "./life-buoy-vP14qBbi.js";
import "./gift-DxQj5ZIr.js";
import "./chart-column-BfljMbKU.js";
import "./shield-check-CoWiH9kN.js";
import "./log-out-C92pR5mz.js";
import "./download-C5vXGTlG.js";
function AuthLayout() {
  const {
    isAuthenticated,
    isLoading,
    isAdmin
  } = useAuth();
  const navigate = useNavigate();
  const {
    pathname
  } = useLocation();
  reactExports.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({
        to: "/auth/register",
        replace: true
      });
    }
    if (!isLoading && isAuthenticated && isAdmin && pathname === "/dashboard") {
      navigate({
        to: "/admin",
        replace: true
      });
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate, pathname]);
  if (isLoading || !isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid min-h-screen place-items-center bg-background text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-7 w-7 animate-spin text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs tracking-[0.3em]", children: "LOADING…" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, {});
}
export {
  AuthLayout as component
};
