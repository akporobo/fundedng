import { r as reactExports, V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAuth, s as supabase, t as toast } from "./router-DudJYIfW.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { B as Badge } from "./badge-Drtmlf7I.js";
import { I as Input } from "./input-Cg1AgxSs.js";
import { L as Label } from "./label-BvHzfEVS.js";
import { T as Textarea } from "./textarea-DHbGpYnD.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BIdxB6Jz.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-CVXx6z81.js";
import { P as Plus } from "./plus-pXBcKkZW.js";
import { L as LifeBuoy } from "./life-buoy-vP14qBbi.js";
import { c as createLucideIcon } from "./createLucideIcon-DQobbSW9.js";
import { A as ArrowLeft } from "./arrow-left-IAqqIALJ.js";
import { S as Send } from "./send-DLdGIVO8.js";
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
import "./index-BXyXc4LB.js";
import "./index-BX1kfvFW.js";
import "./index-DtbDbYbe.js";
import "./index-CYEXyF5B.js";
import "./index-DoApm__Q.js";
import "./check-CNUFRDbJ.js";
import "./x-CGo4OehW.js";
const __iconNode = [
  [
    "path",
    {
      d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
      key: "18887p"
    }
  ]
];
const MessageSquare = createLucideIcon("message-square", __iconNode);
const CATEGORIES = ["Account Issue", "Payout Issue", "Technical Problem", "Rule Clarification", "Other"];
const statusBadge = {
  open: "bg-warning/15 text-warning border-warning/30",
  in_progress: "bg-info/15 text-info border-info/30",
  resolved: "bg-primary/15 text-primary border-primary/30"
};
function SupportPage() {
  const {
    user,
    profile
  } = useAuth();
  const [tickets, setTickets] = reactExports.useState([]);
  const [showNewForm, setShowNewForm] = reactExports.useState(false);
  const [subject, setSubject] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [selectedTicket, setSelectedTicket] = reactExports.useState(null);
  const [messages, setMessages] = reactExports.useState([]);
  const [replyText, setReplyText] = reactExports.useState("");
  const [sendingReply, setSendingReply] = reactExports.useState(false);
  const loadTickets = async () => {
    if (!user) return;
    const {
      data
    } = await supabase.from("tickets").select("*").eq("user_id", user.id).order("created_at", {
      ascending: false
    });
    setTickets(data ?? []);
  };
  reactExports.useEffect(() => {
    loadTickets();
  }, [user]);
  const loadMessages = async (ticketId) => {
    const {
      data
    } = await supabase.from("ticket_messages").select("*").eq("ticket_id", ticketId).order("created_at", {
      ascending: true
    });
    setMessages(data ?? []);
  };
  const openTicket = (t) => {
    setSelectedTicket(t);
    setReplyText("");
    loadMessages(t.id);
  };
  const createTicket = async () => {
    if (!user) return toast.error("Please sign in");
    if (!subject.trim()) return toast.error("Subject is required");
    if (!category) return toast.error("Category is required");
    if (message.trim().length < 20) return toast.error("Message must be at least 20 characters");
    setSubmitting(true);
    const {
      data: ticket,
      error: ticketErr
    } = await supabase.from("tickets").insert({
      user_id: user.id,
      subject: subject.trim(),
      category,
      status: "open"
    }).select().single();
    if (ticketErr) {
      setSubmitting(false);
      return toast.error(ticketErr.message);
    }
    const {
      error: msgErr
    } = await supabase.from("ticket_messages").insert({
      ticket_id: ticket.id,
      sender_id: user.id,
      sender_role: "trader",
      message: message.trim()
    });
    setSubmitting(false);
    if (msgErr) return toast.error(msgErr.message);
    const traderName = profile?.full_name || user.email || "Trader";
    await supabase.rpc("send_telegram", {
      p_message: `<b>New Support Ticket</b>
Trader: ${traderName}
Subject: ${subject.trim()}
Category: ${category}`
    });
    toast.success("Ticket created");
    setShowNewForm(false);
    setSubject("");
    setCategory("");
    setMessage("");
    loadTickets();
  };
  const sendReply = async () => {
    if (!selectedTicket || !user) return;
    const text = replyText.trim();
    if (!text) return toast.error("Type a reply");
    setSendingReply(true);
    const {
      error
    } = await supabase.from("ticket_messages").insert({
      ticket_id: selectedTicket.id,
      sender_id: user.id,
      sender_role: "trader",
      message: text
    });
    setSendingReply(false);
    if (error) return toast.error(error.message);
    setReplyText("");
    await loadMessages(selectedTicket.id);
    loadTickets();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-4 py-8 md:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold", children: "Support" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Get help from the FundedNG team" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setShowNewForm(true), className: "font-display shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
        " New Ticket"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showNewForm, onOpenChange: setShowNewForm, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "mx-4 w-[calc(100%-2rem)] max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Create Support Ticket" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Describe your issue and our team will get back to you." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "subject", children: "Subject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "subject", value: subject, onChange: (e) => setSubject(e.target.value), placeholder: "Brief title" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "category", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: category, onValueChange: setCategory, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "category", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a category" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "message", children: "Message" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "message", rows: 5, value: message, onChange: (e) => setMessage(e.target.value), placeholder: "Describe your issue in detail (min 20 characters)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
            message.length,
            "/20 characters"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: createTicket, disabled: submitting, className: "font-display", children: submitting ? "Submitting…" : "Submit Ticket" })
      ] })
    ] }) }),
    !selectedTicket && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 space-y-3", children: tickets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-dashed border-border bg-card p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LifeBuoy, { className: "mx-auto h-10 w-10 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display mt-3 text-base font-semibold", children: "No tickets yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: 'Click "New Ticket" above to get started.' })
    ] }) : tickets.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[200px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-semibold", children: t.subject }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(t.created_at).toLocaleDateString() })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `font-display ${statusBadge[t.status] ?? ""}`, children: t.status === "in_progress" ? "In Progress" : t.status.charAt(0).toUpperCase() + t.status.slice(1) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => openTicket(t), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "mr-1 h-3 w-3" }),
        " View"
      ] })
    ] }, t.id)) }),
    selectedTicket && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedTicket(null), className: "mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Back to tickets"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: selectedTicket.subject }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: selectedTicket.category }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Created ",
                new Date(selectedTicket.created_at).toLocaleDateString()
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `font-display ${statusBadge[selectedTicket.status] ?? ""}`, children: selectedTicket.status === "in_progress" ? "In Progress" : selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4", children: [
          messages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-6 text-center text-sm text-muted-foreground", children: "Loading messages…" }),
          messages.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${m.sender_role === "trader" ? "justify-start" : "justify-end"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[85%] rounded-xl p-4 ${m.sender_role === "trader" ? "bg-muted" : "bg-primary/10 border border-primary/20"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold", children: m.sender_role === "trader" ? "You" : "Admin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(m.created_at).toLocaleString() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 whitespace-pre-wrap text-sm", children: m.message })
          ] }) }, m.id))
        ] }),
        selectedTicket.status !== "resolved" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-end gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: replyText, onChange: (e) => setReplyText(e.target.value), placeholder: "Type your reply…", className: "min-h-[60px]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: sendReply, disabled: sendingReply || !replyText.trim(), className: "shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "mr-1 h-4 w-4" }),
            " ",
            sendingReply ? "Sending…" : "Send"
          ] })
        ] }),
        selectedTicket.status === "resolved" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-lg border border-border bg-muted/50 p-4 text-center text-sm text-muted-foreground", children: [
          "This ticket is resolved. ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setSelectedTicket(null);
            setShowNewForm(true);
          }, className: "text-primary underline", children: "Create a new ticket" }),
          " if you need further assistance."
        ] })
      ] })
    ] })
  ] });
}
export {
  SupportPage as component
};
