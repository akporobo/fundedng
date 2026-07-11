import { M as useRouter, r as reactExports, V as jsxRuntimeExports, a0 as Outlet } from "./worker-entry-DS7H0w4O.js";
import { b as useLocation, L as Link, u as useAuth, a as useNavigate } from "./router-DudJYIfW.js";
import { B as Brand } from "./Brand-DUbFz4ZD.js";
import { N as NotificationBell, H as Handshake } from "./NotificationBell-DuD70SE4.js";
import { T as ThemeToggle } from "./ThemeToggle-DWCK5KFm.js";
import { c as cn } from "./utils-vYOMvTwc.js";
import { M as Menu } from "./menu-DSFmR6XS.js";
import { X } from "./x-CGo4OehW.js";
import { A as ArrowLeft } from "./arrow-left-IAqqIALJ.js";
import { D as Download } from "./download-C5vXGTlG.js";
import { L as LayoutDashboard } from "./layout-dashboard-Cz7kIasr.js";
import { c as createLucideIcon } from "./createLucideIcon-DQobbSW9.js";
import { C as Clock } from "./clock-BmFxWi-H.js";
import { T as Trophy } from "./trophy-Cp5bM5_K.js";
import { L as LifeBuoy } from "./life-buoy-vP14qBbi.js";
import { G as Gift } from "./gift-DxQj5ZIr.js";
import { S as ShieldCheck } from "./shield-check-CoWiH9kN.js";
import { L as LogOut } from "./log-out-C92pR5mz.js";
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
import "./check-CNUFRDbJ.js";
import "./bell-Y6F42UIG.js";
import "./button-CVkRzbLJ.js";
function useRouterState(opts) {
  const contextRouter = useRouter();
  const router = contextRouter;
  {
    const state = router.stores.__store.get();
    return state;
  }
}
const __iconNode$4 = [
  ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2", key: "9lu3g6" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "M6 12h.01M18 12h.01", key: "113zkx" }]
];
const Banknote = createLucideIcon("banknote", __iconNode$4);
const __iconNode$3 = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
];
const Database = createLucideIcon("database", __iconNode$3);
const __iconNode$2 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image = createLucideIcon("image", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
      key: "vktsd0"
    }
  ],
  ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor", key: "kqv944" }]
];
const Tag = createLucideIcon("tag", __iconNode$1);
const __iconNode = [
  ["path", { d: "M18 21a8 8 0 0 0-16 0", key: "3ypg7q" }],
  ["circle", { cx: "10", cy: "8", r: "5", key: "o932ke" }],
  ["path", { d: "M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3", key: "10s06x" }]
];
const UsersRound = createLucideIcon("users-round", __iconNode);
const ADMIN_NAV = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard },
  { label: "Accounts", to: "/admin/accounts", icon: UsersRound },
  { label: "Pending", to: "/admin/pending", icon: Clock },
  { label: "Payouts", to: "/admin/payouts", icon: Banknote },
  { label: "Challenges", to: "/admin/challenges", icon: Trophy },
  { label: "Discounts", to: "/admin/discounts", icon: Tag },
  { label: "Tickets", to: "/admin/tickets", icon: LifeBuoy },
  { label: "Affiliate", to: "/admin/affiliate", icon: Gift },
  { label: "Partners", to: "/admin/partners", icon: Handshake },
  { label: "Account Pool", to: "/admin/pool", icon: Database },
  { label: "Social Proof", to: "/admin/social", icon: Image },
  { label: "Settings", to: "/admin/settings", icon: ShieldCheck }
];
function AdminSidebarNav({ onNavClick }) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 space-y-1 px-3 py-4", children: ADMIN_NAV.map((item) => {
    const active = currentPath === item.to || item.to === "/admin" && currentPath === "/admin";
    const Icon = item.icon;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: item.to,
        onClick: onNavClick,
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
  }) });
}
function AdminSidebarUserCard() {
  const { user, profile, signOut } = useAuth();
  const initials = (profile?.full_name || user?.email || "U").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-md p-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 font-display text-xs font-bold text-primary", children: initials }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display truncate text-sm font-semibold", children: profile?.full_name || "Admin" }),
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
  ] });
}
function AdminSidebar() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden w-60 shrink-0 flex-col border-r border-border bg-background/60 md:flex md:fixed md:inset-y-0 md:left-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 items-center px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebarNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/dashboard",
          className: "mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
            "Back to Dashboard"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebarUserCard, {})
    ] })
  ] });
}
function AdminShell() {
  const [mobileNavOpen, setMobileNavOpen] = reactExports.useState(false);
  const { pathname } = useLocation();
  reactExports.useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);
  reactExports.useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
  const closeNav = () => setMobileNavOpen(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen md:flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl md:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setMobileNavOpen(true),
            className: "grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
            "aria-label": "Open navigation",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "fixed inset-0 z-50 md:hidden transition-opacity duration-300",
          mobileNavOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
              onClick: closeNav
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "aside",
            {
              className: cn(
                "absolute top-0 left-0 flex h-full w-60 flex-col border-r border-border bg-background transition-transform duration-300",
                mobileNavOpen ? "translate-x-0" : "-translate-x-full"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-16 items-center justify-between px-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: closeNav,
                      className: "grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
                      "aria-label": "Close navigation",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebarNav, { onNavClick: closeNav }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Link,
                    {
                      to: "/dashboard",
                      onClick: closeNav,
                      className: "mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
                        "Back to Dashboard"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebarUserCard, {})
                ] })
              ]
            }
          )
        ]
      }
    ),
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "pb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] })
  ] });
}
function AdminLayout() {
  const {
    isAuthenticated,
    isLoading,
    isAdmin
  } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({
        to: "/auth/login",
        replace: true
      });
    }
    if (!isLoading && isAuthenticated && !isAdmin) {
      navigate({
        to: "/dashboard",
        replace: true
      });
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate]);
  if (isLoading || !isAuthenticated || !isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid min-h-screen place-items-center bg-background text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-7 w-7 animate-spin text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs tracking-[0.3em]", children: "LOADING…" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminShell, {});
}
export {
  AdminLayout as component
};
