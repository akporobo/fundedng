import { V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAuth, a as useNavigate, L as Link } from "./router-DudJYIfW.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-D4cmXPic.js";
import { B as Badge } from "./badge-Drtmlf7I.js";
import { L as LayoutDashboard } from "./layout-dashboard-Cz7kIasr.js";
import { C as ChartColumn } from "./chart-column-BfljMbKU.js";
import { L as LifeBuoy } from "./life-buoy-vP14qBbi.js";
import { c as createLucideIcon } from "./createLucideIcon-DQobbSW9.js";
import { S as ShieldCheck } from "./shield-check-CoWiH9kN.js";
import { L as LogOut } from "./log-out-C92pR5mz.js";
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
import "./utils-vYOMvTwc.js";
const __iconNode = [
  ["path", { d: "M16 10a4 4 0 0 1-8 0", key: "1ltviw" }],
  ["path", { d: "M3.103 6.034h17.794", key: "awc11p" }],
  [
    "path",
    {
      d: "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",
      key: "o988cm"
    }
  ]
];
const ShoppingBag = createLucideIcon("shopping-bag", __iconNode);
function ProfilePage() {
  const {
    profile,
    user,
    isAdmin,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const initials = (profile?.full_name || user?.email || "U").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-2xl px-4 py-8 md:py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-16 w-16 place-items-center rounded-full bg-primary text-xl font-bold text-primary-foreground", children: initials }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "truncate font-display text-xl", children: profile?.full_name || "Trader" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm text-muted-foreground", children: user?.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap gap-1", children: [
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "default", className: "text-[10px]", children: "Admin" }),
          profile?.kyc_verified ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-success text-primary-foreground text-[10px]", children: "KYC verified" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: "KYC pending" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full justify-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "mr-2 h-4 w-4" }),
        " Dashboard"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/stats", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full justify-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "mr-2 h-4 w-4" }),
        " Stats"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/support", className: "md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full justify-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LifeBuoy, { className: "mr-2 h-4 w-4" }),
        " Support"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/buy", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full justify-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "mr-2 h-4 w-4" }),
        " Buy a challenge"
      ] }) }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full justify-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "mr-2 h-4 w-4" }),
        " Admin console"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "destructive", className: "mt-2 w-full justify-start", onClick: async () => {
        await signOut();
        navigate({
          to: "/"
        });
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "mr-2 h-4 w-4" }),
        " Sign out"
      ] })
    ] })
  ] }) });
}
export {
  ProfilePage as component
};
