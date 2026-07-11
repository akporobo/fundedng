import { r as reactExports, V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { b as useLocation, L as Link } from "./router-DudJYIfW.js";
import { B as Brand } from "./Brand-DUbFz4ZD.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { T as ThemeToggle } from "./ThemeToggle-DWCK5KFm.js";
import { c as cn } from "./utils-vYOMvTwc.js";
import { D as Download } from "./download-C5vXGTlG.js";
import { X } from "./x-CGo4OehW.js";
import { M as Menu } from "./menu-DSFmR6XS.js";
const PUBLIC_NAV = [
  { to: "/", label: "Home" },
  { to: "/rules", label: "Rules" },
  { to: "/agreement", label: "Agreement" }
];
function PublicHeader() {
  const { pathname } = useLocation();
  const [open, setOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setOpen(false);
  }, [pathname]);
  reactExports.useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden items-center gap-1 md:flex", children: PUBLIC_NAV.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: item.to,
            className: cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active ? "text-primary" : "text-foreground/70 hover:text-foreground"
            ),
            children: item.label
          },
          item.to
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden items-center gap-2 md:flex", children: [
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/auth/login",
            className: "text-sm font-medium text-foreground/80 transition-colors hover:text-primary",
            children: "Sign In"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", className: "font-display", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/register", children: "Get Funded" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 md:hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "aria-label": open ? "Close menu" : "Open menu",
            "aria-expanded": open,
            onClick: () => setOpen((v) => !v),
            className: "grid h-10 w-10 place-items-center rounded-md text-foreground hover:bg-muted",
            children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" })
          }
        )
      ] })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-background md:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-col gap-1 px-4 pt-4", children: PUBLIC_NAV.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: item.to,
            className: cn(
              "rounded-lg px-4 py-3 text-base font-medium transition-colors",
              active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
            ),
            children: item.label
          },
          item.to
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto flex flex-col gap-3 border-t border-border p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", size: "lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/login", children: "Sign In" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "font-display", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/register", children: "Get Funded" }) })
      ] })
    ] })
  ] });
}
export {
  PublicHeader as P
};
