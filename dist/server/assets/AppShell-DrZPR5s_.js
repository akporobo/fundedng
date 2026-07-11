import { V as jsxRuntimeExports, a0 as Outlet } from "./worker-entry-DS7H0w4O.js";
import { b as useLocation, u as useAuth, L as Link } from "./router-DudJYIfW.js";
import { B as Brand } from "./Brand-DUbFz4ZD.js";
import { H as Handshake, N as NotificationBell } from "./NotificationBell-DuD70SE4.js";
import { T as ThemeToggle } from "./ThemeToggle-DWCK5KFm.js";
import { c as cn } from "./utils-vYOMvTwc.js";
import { c as createLucideIcon } from "./createLucideIcon-DQobbSW9.js";
import { L as LifeBuoy } from "./life-buoy-vP14qBbi.js";
import { G as Gift } from "./gift-DxQj5ZIr.js";
import { C as ChartColumn } from "./chart-column-BfljMbKU.js";
import { S as ShieldCheck } from "./shield-check-CoWiH9kN.js";
import { L as LogOut } from "./log-out-C92pR5mz.js";
import { D as Download } from "./download-C5vXGTlG.js";
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "r6nss1"
    }
  ]
];
const House = createLucideIcon("house", __iconNode$1);
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: House, match: (p) => p.startsWith("/dashboard") },
  { to: "/buy", label: "Buy", icon: CirclePlus, match: (p) => p.startsWith("/buy") },
  { to: "/support", label: "Support", icon: LifeBuoy, match: (p) => p.startsWith("/support") },
  { to: "/affiliate", label: "Affiliate", icon: Gift, match: (p) => p.startsWith("/affiliate") },
  { to: "/stats", label: "Stats", icon: ChartColumn, match: (p) => p.startsWith("/stats") },
  { to: "/profile", label: "Profile", icon: User, match: (p) => p.startsWith("/profile") }
];
function AppSidebar() {
  const { pathname } = useLocation();
  const { user, profile, isAdmin, isPartner, signOut } = useAuth();
  const initials = (profile?.full_name || user?.email || "U").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  const navItems = isPartner ? NAV.filter((n) => n.label !== "Affiliate") : NAV;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden w-60 shrink-0 flex-col border-r border-border bg-background/60 md:flex md:fixed md:inset-y-0 md:left-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 items-center px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex-1 space-y-1 px-3 py-4", children: [
      navItems.map((item) => {
        const active = item.match(pathname);
        const Icon = item.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: item.to,
            className: cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
              item.label
            ]
          },
          item.label
        );
      }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/admin",
          className: cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname.startsWith("/admin") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }),
            " Admin"
          ]
        }
      ),
      isPartner && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/partner",
          className: cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname.startsWith("/partner") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Handshake, { className: "h-4 w-4" }),
            " Partner"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-md p-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 font-display text-xs font-bold text-primary", children: initials }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display truncate text-sm font-semibold", children: profile?.full_name || "Trader" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[10px] text-muted-foreground", children: user?.email })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: signOut,
          className: "grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
          "aria-label": "Sign out",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" })
        }
      )
    ] }) })
  ] });
}
function MobileBottomNav() {
  const { pathname } = useLocation();
  const { isPartner } = useAuth();
  const mobileItems = NAV.filter((n) => n.label !== "Support");
  const mobileNav = isPartner ? [...mobileItems.filter((n) => n.label !== "Affiliate"), { to: "/partner", label: "Partner", icon: Handshake, match: (p) => p.startsWith("/partner") }] : mobileItems;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex h-16 max-w-lg items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]", children: mobileNav.map((item) => {
    const active = item.match(pathname);
    const Icon = item.icon;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: item.to,
        className: cn(
          "flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
          active ? "text-primary" : "text-muted-foreground"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-5 w-5", active && "scale-110") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display tracking-wide", children: item.label })
        ]
      },
      item.label
    );
  }) }) });
}
function AppShell() {
  const { pathname } = useLocation();
  const isChat = /^\/community\/[^/]+/.test(pathname);
  if (isChat) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen md:flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 md:ml-60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: "/fundedng.apk",
              download: true,
              className: "flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90",
              title: "Download the FundedNG App",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "App" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationBell, {})
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "pb-24 md:pb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MobileBottomNav, {})
  ] });
}
export {
  AppSidebar as A,
  MobileBottomNav as M,
  AppShell as a
};
