import { r as reactExports, V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAuth, a as useNavigate, L as Link, s as supabase, t as toast } from "./router-DudJYIfW.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-D4cmXPic.js";
import { B as Badge } from "./badge-Drtmlf7I.js";
import { I as Input } from "./input-Cg1AgxSs.js";
import { T as Textarea } from "./textarea-DHbGpYnD.js";
import { D as Dialog, f as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogFooter } from "./dialog-CVXx6z81.js";
import { u as useHasPurchase } from "./use-has-purchase-Q9m1vocb.js";
import { P as Plus } from "./plus-pXBcKkZW.js";
import { c as createLucideIcon } from "./createLucideIcon-DQobbSW9.js";
import { A as ArrowRight } from "./arrow-right-DLtychK9.js";
import { U as Users } from "./users-IaM0z4Ba.js";
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
import "./x-CGo4OehW.js";
const __iconNode$1 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
      key: "1sd12s"
    }
  ]
];
const MessageCircle = createLucideIcon("message-circle", __iconNode);
function CommunityPage() {
  const {
    user,
    isAdmin
  } = useAuth();
  const navigate = useNavigate();
  const hasPurchase = useHasPurchase();
  const [groups, setGroups] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [creating, setCreating] = reactExports.useState(false);
  const [newName, setNewName] = reactExports.useState("");
  const [newDesc, setNewDesc] = reactExports.useState("");
  const [open, setOpen] = reactExports.useState(false);
  const load = async () => {
    if (!user) return;
    const [{
      data: gs
    }, {
      data: ms
    }] = await Promise.all([supabase.from("community_groups").select("*").eq("is_active", true).order("created_at"), supabase.from("group_members").select("group_id, user_id")]);
    const memberMap = /* @__PURE__ */ new Map();
    const myGroups = /* @__PURE__ */ new Set();
    (ms ?? []).forEach((m) => {
      memberMap.set(m.group_id, (memberMap.get(m.group_id) ?? 0) + 1);
      if (m.user_id === user.id) myGroups.add(m.group_id);
    });
    setGroups((gs ?? []).map((g) => ({
      ...g,
      member_count: memberMap.get(g.id) ?? 0,
      is_member: myGroups.has(g.id)
    })));
    setLoading(false);
  };
  reactExports.useEffect(() => {
    load();
  }, [user?.id]);
  const join = async (groupId) => {
    if (!user) {
      toast.error("Please sign in to join groups.");
      return;
    }
    if (!hasPurchase) {
      toast.error("Purchase a challenge to join groups.");
      return;
    }
    setGroups((prev) => prev.map((g) => g.id === groupId ? {
      ...g,
      is_member: true,
      member_count: (g.member_count ?? 0) + 1
    } : g));
    const {
      error
    } = await supabase.from("group_members").insert({
      group_id: groupId,
      user_id: user.id
    });
    if (error) {
      if (error.code === "23505" || /duplicate|unique/i.test(error.message)) {
        const slug2 = groups.find((g) => g.id === groupId)?.slug;
        if (slug2) open_chat(slug2);
        return;
      }
      console.error("Join group failed", error);
      toast.error(error.message || "Could not join group");
      load();
      return;
    }
    toast.success("Joined group");
    const slug = groups.find((g) => g.id === groupId)?.slug;
    if (slug) open_chat(slug);
  };
  const open_chat = (slug) => navigate({
    to: "/community/$slug",
    params: {
      slug
    }
  });
  const createGroup = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const slug = newName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40);
    const {
      error
    } = await supabase.from("community_groups").insert({
      name: newName.trim(),
      slug,
      description: newDesc.trim() || null,
      created_by: user.id
    });
    setCreating(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Group created");
    setNewName("");
    setNewDesc("");
    setOpen(false);
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 py-6 md:py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold", children: "Community" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Chat with other Nigerian traders." })
      ] }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "font-display", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
          " New group"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Create a community group" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Group name", value: newName, onChange: (e) => setNewName(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "What's this group about?", value: newDesc, onChange: (e) => setNewDesc(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: createGroup, disabled: creating || !newName.trim(), children: creating ? "Creating…" : "Create group" }) })
        ] })
      ] })
    ] }),
    hasPurchase === false && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/5 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "mt-0.5 h-5 w-5 shrink-0 text-warning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-sm font-semibold", children: "Read-only mode" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Purchase a challenge to join the conversation and post in the community." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/buy", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "font-display", children: [
        "Buy now ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 h-3 w-3" })
      ] }) })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading groups…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
      groups.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "transition-colors hover:border-primary/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-lg", children: g.name }),
          g.is_member && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: "Joined" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
          g.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: g.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
              " ",
              g.member_count,
              " members"
            ] }),
            g.is_member ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "default", onClick: () => open_chat(g.slug), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "mr-1 h-4 w-4" }),
              " Open chat"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => hasPurchase ? join(g.id) : open_chat(g.slug), children: hasPurchase ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              "Join ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 h-3 w-3" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              "View ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 h-3 w-3" })
            ] }) })
          ] })
        ] })
      ] }, g.id)),
      groups.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "No groups yet. ",
        isAdmin && "Create one above."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-8 text-center text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", className: "underline", children: "Back to dashboard" }) })
  ] });
}
export {
  CommunityPage as component
};
