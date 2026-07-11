import { c as createLucideIcon } from "./createLucideIcon-DQobbSW9.js";
import { r as reactExports, V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAuth, s as supabase } from "./router-DudJYIfW.js";
import { c as cn } from "./utils-vYOMvTwc.js";
import { C as Check } from "./check-CNUFRDbJ.js";
import { B as Bell } from "./bell-Y6F42UIG.js";
const __iconNode$1 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742",
      key: "178tsu"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ["path", { d: "M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05", key: "1hqiys" }]
];
const BellOff = createLucideIcon("bell-off", __iconNode$1);
const __iconNode = [
  ["path", { d: "m11 17 2 2a1 1 0 1 0 3-3", key: "efffak" }],
  [
    "path",
    {
      d: "m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4",
      key: "9pr0kb"
    }
  ],
  ["path", { d: "m21 3 1 11h-2", key: "1tisrp" }],
  ["path", { d: "M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3", key: "1uvwmv" }],
  ["path", { d: "M3 4h8", key: "1ep09j" }]
];
const Handshake = createLucideIcon("handshake", __iconNode);
function timeAgo(iso) {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const s = Math.floor(diff / 1e3);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}
function NotificationBell() {
  const { user } = useAuth();
  const [unread, setUnread] = reactExports.useState(0);
  const [items, setItems] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const loadCount = async () => {
      const { count } = await supabase.from("notifications").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("is_read", false);
      const c = count ?? 0;
      if (!cancelled) {
        setUnread(c);
        try {
          if (c > 0 && "setAppBadge" in navigator) await navigator.setAppBadge(c);
          else if ("clearAppBadge" in navigator) await navigator.clearAppBadge();
        } catch {
        }
      }
    };
    loadCount();
    const channel = supabase.channel(`bell:${user.id}`).on(
      "postgres_changes",
      { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
      () => loadCount()
    ).subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user?.id]);
  reactExports.useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onTouch = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onTouch);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onTouch);
    };
  }, [open]);
  const fetchItems = async () => {
    if (!user) return;
    const { data } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10);
    setItems(data ?? []);
  };
  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
    setUnread(0);
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      if ("clearAppBadge" in navigator) await navigator.clearAppBadge();
    } catch {
    }
  };
  const handleOpen = async () => {
    setOpen(true);
    await fetchItems();
    await markAllRead();
  };
  const Panel = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex max-h-[70vh] flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-sm font-semibold", children: "Notifications" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: markAllRead,
          className: "text-[11px] text-primary hover:underline disabled:opacity-50",
          disabled: items.every((n) => n.is_read),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mr-1 inline h-3 w-3" }),
            "Mark all read"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid place-items-center px-6 py-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "h-10 w-10 text-muted-foreground/50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm font-medium", children: "No notifications yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "You'll see updates about your account here." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: items.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "li",
      {
        className: cn(
          "flex gap-3 px-4 py-3 text-sm",
          !n.is_read && "bg-primary/5"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                n.is_read ? "bg-transparent" : "bg-primary"
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display truncate text-sm font-semibold", children: n.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 text-[10px] text-muted-foreground", children: timeAgo(n.created_at) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 line-clamp-2 text-xs text-muted-foreground", children: n.message })
          ] })
        ]
      },
      n.id
    )) }) })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref, className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => open ? setOpen(false) : handleOpen(),
        className: "relative grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        "aria-label": "Notifications",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }),
          unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground", children: unread > 9 ? "9+" : unread })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          "absolute right-0 top-12 z-[60] overflow-hidden rounded-xl border border-border bg-background shadow-2xl",
          // Mobile: anchor to right of bell, span most of viewport width.
          // Desktop: fixed 360px panel.
          "w-[min(22rem,calc(100vw-1.5rem))] md:w-[360px]"
        ),
        children: Panel
      }
    )
  ] });
}
export {
  Handshake as H,
  NotificationBell as N
};
