import { r as reactExports, V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAdminData } from "./useAdminData-BK4UWKTz.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { B as Badge } from "./badge-Drtmlf7I.js";
import { I as Input } from "./input-Cg1AgxSs.js";
import { L as Label } from "./label-BvHzfEVS.js";
import { b as formatUSD, a as formatNaira } from "./utils-vYOMvTwc.js";
import { A as Alert, a as AlertDescription } from "./alert-D-hhowZT.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-kOBQTArc.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BIdxB6Jz.js";
import { s as supabase, t as toast } from "./router-DudJYIfW.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-CVXx6z81.js";
import { T as TriangleAlert } from "./triangle-alert-CQOpTpD9.js";
import { P as Plus } from "./plus-pXBcKkZW.js";
import { E as Eye } from "./eye-CKk5fOHO.js";
import { c as createLucideIcon } from "./createLucideIcon-DQobbSW9.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./kyc.functions-Ddgzg7nS.js";
import "./client.server-B4evwzKW.js";
import "./notify-email-fIZWdIiB.js";
import "./index-BXyXc4LB.js";
import "./index-BX1kfvFW.js";
import "./index-DtbDbYbe.js";
import "./index-CYEXyF5B.js";
import "./index-DoApm__Q.js";
import "./check-CNUFRDbJ.js";
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
import "./x-CGo4OehW.js";
const __iconNode$1 = [
  ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1", key: "1wp1u1" }],
  ["path", { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8", key: "1s80jp" }],
  ["path", { d: "M10 12h4", key: "a56b0p" }]
];
const Archive = createLucideIcon("archive", __iconNode$1);
const __iconNode = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
function CountdownCell({
  created_at,
  status
}) {
  const [display, setDisplay] = reactExports.useState("");
  reactExports.useEffect(() => {
    const update = () => {
      if (status !== "available") {
        setDisplay("");
        return;
      }
      const created = new Date(created_at).getTime();
      const expiry = created + 5 * 24 * 60 * 60 * 1e3;
      const diff = expiry - Date.now();
      if (diff <= 0) {
        setDisplay("EXPIRED");
        return;
      }
      const days = Math.floor(diff / (24 * 60 * 60 * 1e3));
      const hours = Math.floor(diff % (24 * 60 * 60 * 1e3) / (60 * 60 * 1e3));
      const mins = Math.floor(diff % (60 * 60 * 1e3) / (60 * 1e3));
      setDisplay(`${days}d ${hours}h ${mins}m`);
    };
    update();
    const interval = setInterval(update, 6e4);
    return () => clearInterval(interval);
  }, [created_at, status]);
  if (!display) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-[11px] ${display === "EXPIRED" ? "font-semibold text-red-500" : "text-muted-foreground"}`, children: display });
}
function PoolPage() {
  const {
    poolAccounts,
    poolInventory,
    poolLoading,
    poolFormOpen,
    poolSaving,
    poolForm,
    viewCredsFor,
    challengeList,
    setPoolFormOpen,
    setPoolForm,
    setPoolSaving,
    setViewCredsFor,
    loadPool
  } = useAdminData();
  const [, forceTick] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const interval = setInterval(() => forceTick((n) => n + 1), 6e4);
    return () => clearInterval(interval);
  }, []);
  const handleDeletePool = async (id) => {
    if (!confirm("Delete this account from the pool? This cannot be undone.")) return;
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    const res = await fetch("/api/admin/pool", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        action: "delete",
        id
      })
    });
    const json = await res.json();
    if (json.ok) {
      toast.success("Account deleted");
      loadPool();
    } else {
      toast.error(json.error ?? "Failed to delete");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Account Pool" }),
    (() => {
      const low = Object.entries(poolInventory).filter(([, count]) => count < 3);
      if (low.length === 0) return null;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "default", className: "border-warning/40 bg-warning/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-warning" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { className: "text-warning-foreground text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold", children: "Low Stock:" }),
          " ",
          low.map(([key, count]) => {
            const isUsd = key.startsWith("usd_");
            const size = Number(key.replace(/^(usd|ngn)_/, ""));
            return `${isUsd ? formatUSD(size) : formatNaira(size)} (${count})`;
          }).join(", ")
        ] })
      ] });
    })(),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-bold", children: "Inventory" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setPoolFormOpen(true), className: "font-display", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
        " Add Account"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: challengeList.filter((c) => c.is_active).map((c) => {
      const isUsd = c.currency === "USD";
      const invKey = isUsd ? `usd_${c.account_size}` : `ngn_${c.account_size}`;
      const available = poolInventory[invKey] ?? 0;
      const color = available >= 3 ? "text-green-500" : available >= 1 ? "text-amber-500" : "text-red-500";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: c.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `font-display mt-1 text-2xl font-bold ${color}`, children: available }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: isUsd ? formatUSD(c.account_size) : formatNaira(c.account_size) })
      ] }, c.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "MT5 Login" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Currency" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Account Size" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Server" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Created" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Assigned" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Order" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-20", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
        poolAccounts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 10, className: "text-center text-sm text-muted-foreground py-8", children: poolLoading ? "Loading…" : "No accounts in pool." }) }),
        poolAccounts.map((a) => {
          const statusColor = {
            available: "text-green-500 border-green-500/40",
            assigned: "text-blue-500 border-blue-500/40",
            archived: "text-muted-foreground border-muted",
            flagged: "text-red-500 border-red-500/40"
          };
          const isUsd = a.currency === "USD";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs", children: a.mt5_login }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `font-display ${isUsd ? "border-blue-500/40 text-blue-500" : "border-green-500/40 text-green-500"}`, children: isUsd ? "USD" : "NGN" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: isUsd ? formatUSD(a.account_size_usd) : formatNaira(a.account_size_ngn) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-muted-foreground", children: a.mt5_server }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `font-display ${statusColor[a.status] ?? ""}`, children: a.status.toUpperCase() }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: new Date(a.created_at).toLocaleDateString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CountdownCell, { created_at: a.created_at, status: a.status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-muted-foreground", children: a.assigned_at ? new Date(a.assigned_at).toLocaleDateString() : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-muted-foreground", children: a.assigned_order_id ? a.assigned_order_id.slice(0, 8) + "…" : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "max-w-[120px] truncate text-xs text-muted-foreground", title: a.notes ?? "", children: a.notes ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-7 px-2 text-muted-foreground hover:text-foreground", onClick: () => setViewCredsFor(a), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" }) }),
              a.status === "available" && (() => {
                const created = new Date(a.created_at).getTime();
                const expired = Date.now() >= created + 5 * 24 * 60 * 60 * 1e3;
                return expired ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-7 px-2 text-destructive hover:text-destructive", onClick: () => handleDeletePool(a.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-7 px-2 text-muted-foreground hover:text-destructive", onClick: async () => {
                  const {
                    data: {
                      session
                    }
                  } = await supabase.auth.getSession();
                  if (!session?.access_token) return;
                  const res = await fetch("/api/admin/pool", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${session.access_token}`
                    },
                    body: JSON.stringify({
                      action: "archive",
                      id: a.id
                    })
                  });
                  const json = await res.json();
                  if (json.ok) {
                    toast.success("Account archived");
                    loadPool();
                  } else {
                    toast.error(json.error ?? "Failed to archive");
                  }
                }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "h-3.5 w-3.5" }) });
              })()
            ] }) })
          ] }, a.id);
        })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!viewCredsFor, onOpenChange: (o) => !o && setViewCredsFor(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "MT5 Credentials" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Login: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-medium text-foreground", children: viewCredsFor?.mt5_login })
        ] })
      ] }),
      viewCredsFor && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Server" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm", children: viewCredsFor.mt5_server })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Master Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm", children: viewCredsFor.mt5_password })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Investor Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm", children: viewCredsFor.investor_password })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setViewCredsFor(null), children: "Close" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: poolFormOpen, onOpenChange: (o) => !poolSaving && !o && setPoolFormOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "mx-4 w-[calc(100%-2rem)] max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add account to pool" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Enter the MT5 credentials for a demo account created in the broker terminal." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pool-login", children: "MT5 Login *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "pool-login", value: poolForm.mt5_login, onChange: (e) => setPoolForm({
            ...poolForm,
            mt5_login: e.target.value
          }), placeholder: "e.g. 12345678" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pool-password", children: "Master password *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "pool-password", value: poolForm.mt5_password, onChange: (e) => setPoolForm({
            ...poolForm,
            mt5_password: e.target.value
          }), placeholder: "Trading password" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pool-investor", children: "Investor password *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "pool-investor", value: poolForm.investor_password, onChange: (e) => setPoolForm({
            ...poolForm,
            investor_password: e.target.value
          }), placeholder: "Read-only password for VPS monitoring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Currency" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPoolForm({
              ...poolForm,
              currency: "NGN",
              account_size_ngn: "",
              account_size_usd: ""
            }), className: `rounded-md border px-3 py-2 text-sm font-display ${poolForm.currency !== "USD" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`, children: "NGN" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPoolForm({
              ...poolForm,
              currency: "USD",
              account_size_ngn: "",
              account_size_usd: ""
            }), className: `rounded-md border px-3 py-2 text-sm font-display ${poolForm.currency === "USD" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`, children: "USD" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pool-server", children: "MT5 Server" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "pool-server", value: poolForm.mt5_server, onChange: (e) => setPoolForm({
            ...poolForm,
            mt5_server: e.target.value
          }), placeholder: "Exness-MT5Trial9" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pool-size", children: "Account Size *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: poolForm.currency === "USD" ? poolForm.account_size_usd : poolForm.account_size_ngn, onValueChange: (v) => setPoolForm({
            ...poolForm,
            [poolForm.currency === "USD" ? "account_size_usd" : "account_size_ngn"]: v
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "pool-size", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select account size" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: challengeList.filter((c) => c.is_active && c.currency === poolForm.currency).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: String(c.account_size), children: [
              c.name,
              " — ",
              c.currency === "USD" ? formatUSD(c.account_size) : formatNaira(c.account_size)
            ] }, c.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pool-notes", children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "pool-notes", value: poolForm.notes, onChange: (e) => setPoolForm({
            ...poolForm,
            notes: e.target.value
          }), placeholder: "Optional admin notes" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => {
          setPoolFormOpen(false);
        }, disabled: poolSaving, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
          if (!poolForm.mt5_login.trim() || !poolForm.mt5_password.trim() || !poolForm.investor_password.trim()) {
            toast.error("Login, password, and investor password are required");
            return;
          }
          if (poolForm.currency === "USD" && !poolForm.account_size_usd) {
            toast.error("Account size is required for USD accounts");
            return;
          }
          if (poolForm.currency !== "USD" && !poolForm.account_size_ngn) {
            toast.error("Account size is required for NGN accounts");
            return;
          }
          setPoolSaving(true);
          try {
            const {
              data: {
                session
              }
            } = await supabase.auth.getSession();
            if (!session?.access_token) return;
            const body = {
              action: "add",
              mt5_login: poolForm.mt5_login.trim(),
              mt5_password: poolForm.mt5_password.trim(),
              investor_password: poolForm.investor_password.trim(),
              mt5_server: poolForm.mt5_server.trim() || "Exness-MT5Trial9",
              currency: poolForm.currency,
              notes: poolForm.notes.trim() || null
            };
            if (poolForm.currency === "USD") body.account_size_usd = Number(poolForm.account_size_usd);
            else body.account_size_ngn = Number(poolForm.account_size_ngn);
            const res = await fetch("/api/admin/pool", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`
              },
              body: JSON.stringify(body)
            });
            const json = await res.json();
            if (json.ok) {
              toast.success("Account added to pool");
              setPoolForm({
                mt5_login: "",
                mt5_password: "",
                investor_password: "",
                mt5_server: "Exness-MT5Trial9",
                account_size_ngn: "",
                account_size_usd: "",
                currency: "NGN",
                notes: ""
              });
              setPoolFormOpen(false);
              loadPool();
            } else {
              toast.error(json.error ?? "Failed to add account");
            }
          } catch (e) {
            toast.error(e?.message ?? "Failed");
          } finally {
            setPoolSaving(false);
          }
        }, disabled: poolSaving, children: poolSaving ? "Adding…" : "Add to Pool" })
      ] })
    ] }) })
  ] });
}
export {
  PoolPage as component
};
