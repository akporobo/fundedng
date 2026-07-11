import { V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAdminData } from "./useAdminData-BK4UWKTz.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { B as Badge } from "./badge-Drtmlf7I.js";
import { L as Label } from "./label-BvHzfEVS.js";
import { T as Textarea } from "./textarea-DHbGpYnD.js";
import { A as ArrowLeft } from "./arrow-left-IAqqIALJ.js";
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
import "./createLucideIcon-DQobbSW9.js";
function TicketsPage() {
  const {
    tickets,
    selectedTicket,
    ticketMessages,
    replyText,
    replySaving,
    statusFilter,
    statusUpdating,
    setReplyText,
    setStatusFilter,
    selectTicket,
    closeTicketDetail,
    sendAdminReply,
    updateTicketStatus,
    statusFlow
  } = useAdminData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold mb-4", children: "Support Tickets" }),
    !selectedTicket ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex flex-wrap gap-2", children: ["all", "open", "in_progress", "resolved"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStatusFilter(s), className: `rounded-md px-3 py-1.5 text-xs font-display font-medium transition-colors ${statusFilter === s ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`, children: s === "all" ? "All" : s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1) }, s)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: tickets.filter((t) => statusFilter === "all" || t.status === statusFilter).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground", children: "No support tickets yet." }) : tickets.filter((t) => statusFilter === "all" || t.status === statusFilter).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[200px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: t.subject }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            t.profiles?.full_name ?? "—",
            " · ",
            t.category,
            " · ",
            new Date(t.created_at).toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `font-display ${t.status === "open" ? "border-warning/40 text-warning" : t.status === "in_progress" ? "border-info/40 text-info" : "border-primary/40 text-primary"}`, children: t.status === "in_progress" ? "IN PROGRESS" : t.status.toUpperCase() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          "Updated ",
          new Date(t.updated_at).toLocaleDateString()
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => selectTicket(t), children: "View" })
      ] }) }, t.id)) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: closeTicketDetail, className: "mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Back to all tickets"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: selectedTicket.subject }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
              selectedTicket.profiles?.full_name ?? "—",
              " · ",
              selectedTicket.category,
              " · Created ",
              new Date(selectedTicket.created_at).toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `font-display ${selectedTicket.status === "open" ? "border-warning/40 text-warning" : selectedTicket.status === "in_progress" ? "border-info/40 text-info" : "border-primary/40 text-primary"}`, children: selectedTicket.status === "in_progress" ? "IN PROGRESS" : selectedTicket.status.toUpperCase() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4", children: [
          ticketMessages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-6 text-center text-sm text-muted-foreground", children: "No messages yet." }),
          ticketMessages.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${m.sender_role === "trader" ? "justify-start" : "justify-end"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[85%] rounded-xl p-4 ${m.sender_role === "trader" ? "bg-muted" : "bg-primary/10 border border-primary/20"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold", children: m.sender_role === "trader" ? selectedTicket.profiles?.full_name ?? "Trader" : "Admin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(m.created_at).toLocaleString() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 whitespace-pre-wrap text-sm", children: m.message })
          ] }) }, m.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap items-end gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[240px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "admin-reply", className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: "Reply as Admin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "admin-reply", rows: 2, value: replyText, onChange: (e) => setReplyText(e.target.value), placeholder: "Type your reply…", className: "mt-1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
            (statusFlow[selectedTicket.status] ?? []).map((nextStatus) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: nextStatus === "resolved" ? "default" : "outline", onClick: () => updateTicketStatus(selectedTicket, nextStatus), disabled: statusUpdating === selectedTicket.id, children: statusUpdating === selectedTicket.id ? "…" : `Mark ${nextStatus.replace("_", " ")}` }, nextStatus)),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: sendAdminReply, disabled: replySaving || !replyText.trim(), children: replySaving ? "Sending…" : "Send Reply" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  TicketsPage as component
};
