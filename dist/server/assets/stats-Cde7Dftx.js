import { r as reactExports, V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAuth, s as supabase, L as Link } from "./router-DudJYIfW.js";
import { b as formatUSD, a as formatNaira } from "./utils-vYOMvTwc.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-CVXx6z81.js";
import { c as createLucideIcon } from "./createLucideIcon-DQobbSW9.js";
import { C as ChevronRight } from "./chevron-right-CVZD1doD.js";
import { C as ChartColumn } from "./chart-column-BfljMbKU.js";
import { T as TrendingUp } from "./trending-up-kxjckc06.js";
import { T as Trophy } from "./trophy-Cp5bM5_K.js";
import { T as TrendingDown } from "./trending-down-El-mNyUB.js";
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
import "./index-BXyXc4LB.js";
import "./x-CGo4OehW.js";
const __iconNode$3 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
];
const CalendarDays = createLucideIcon("calendar-days", __iconNode$3);
const __iconNode$2 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$2);
const __iconNode$1 = [
  ["line", { x1: "12", x2: "12", y1: "2", y2: "22", key: "7eqyqh" }],
  ["path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", key: "1b0p4s" }]
];
const DollarSign = createLucideIcon("dollar-sign", __iconNode$1);
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
];
const Target = createLucideIcon("target", __iconNode);
function StatsPage() {
  const {
    user
  } = useAuth();
  const [accounts, setAccounts] = reactExports.useState([]);
  const [selected, setSelected] = reactExports.useState(null);
  const [trades, setTrades] = reactExports.useState([]);
  const [currentMonth, setCurrentMonth] = reactExports.useState(() => (/* @__PURE__ */ new Date()).getMonth());
  const [currentYear, setCurrentYear] = reactExports.useState(() => (/* @__PURE__ */ new Date()).getFullYear());
  const [selectedDay, setSelectedDay] = reactExports.useState(null);
  const [selectedPhase, setSelectedPhase] = reactExports.useState("phase1");
  const todayLocal = reactExports.useMemo(() => {
    const d = /* @__PURE__ */ new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);
  const localDateKey = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  reactExports.useEffect(() => {
    if (!user) return;
    supabase.from("trader_accounts").select("*, challenges(name,min_trading_days,profit_target_percent,phase2_profit_target_percent,max_drawdown_percent,phases,drawdown_type)").eq("user_id", user.id).in("status", ["active", "funded", "passed"]).order("created_at", {
      ascending: false
    }).then(({
      data
    }) => {
      const list = data ?? [];
      setAccounts(list);
      if (list.length > 0) setSelected(list[0]);
    });
  }, [user]);
  const phaseInfo = reactExports.useMemo(() => {
    if (!selected) return [];
    const info = [];
    info.push({
      key: "phase1",
      label: "Phase 1",
      start: selected.created_at,
      end: selected.phase1_passed_at ?? null
    });
    if (selected.phase1_passed_at) {
      info.push({
        key: "phase2",
        label: "Phase 2",
        start: selected.phase1_passed_at,
        end: selected.phase2_passed_at ?? selected.funded_at ?? null
      });
    }
    if (selected.phase2_passed_at || selected.funded_at) {
      info.push({
        key: "funded",
        label: "Funded",
        start: selected.phase2_passed_at ?? selected.funded_at,
        end: null
      });
    }
    return info;
  }, [selected]);
  const filteredTrades = reactExports.useMemo(() => {
    const active = phaseInfo.find((p) => p.key === selectedPhase);
    if (!active || !trades.length) return trades;
    return trades.filter((t) => {
      const ct = t.close_time;
      return ct >= active.start && (!active.end || ct < active.end);
    });
  }, [trades, phaseInfo, selectedPhase]);
  const activePhase = phaseInfo.find((p) => p.key === selectedPhase);
  reactExports.useEffect(() => {
    if (!selected) return;
    supabase.from("closed_trades").select("ticket, symbol, profit, close_time, duration_seconds, volume").eq("account_id", selected.id).order("close_time", {
      ascending: true
    }).then(({
      data
    }) => setTrades(data ?? []));
    const last = phaseInfo[phaseInfo.length - 1];
    if (last) setSelectedPhase(last.key);
  }, [selected]);
  reactExports.useEffect(() => {
    if (!selected) return;
    const tradesChannel = supabase.channel(`stats-closed-trades-${selected.id}`).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "closed_trades",
      filter: `account_id=eq.${selected.id}`
    }, (payload) => {
      setTrades((prev) => [...prev, payload.new]);
    }).subscribe();
    const snapChannel = supabase.channel(`stats-snapshots-${selected.id}`).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "account_snapshots",
      filter: `trader_account_id=eq.${selected.id}`
    }, () => {
      supabase.from("closed_trades").select("ticket, symbol, profit, close_time, duration_seconds, volume").eq("account_id", selected.id).order("close_time", {
        ascending: true
      }).then(({
        data
      }) => setTrades(data ?? []));
    }).subscribe();
    return () => {
      supabase.removeChannel(tradesChannel);
      supabase.removeChannel(snapChannel);
    };
  }, [selected?.id]);
  const tradesByDay = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const t of filteredTrades) {
      const day = t.close_time.slice(0, 10);
      if (!map.has(day)) map.set(day, []);
      map.get(day).push(t);
    }
    return map;
  }, [filteredTrades]);
  const dailyPnL = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const [day, dayTrades] of tradesByDay) {
      map.set(day, dayTrades.reduce((sum, t) => sum + t.profit, 0));
    }
    return map;
  }, [tradesByDay]);
  const profitableTradingDays = reactExports.useMemo(() => {
    if (!selected) return 0;
    const isUSD = selected.currency === "USD";
    if (!isUSD) return tradesByDay.size;
    const threshold = Number(selected.starting_balance) * 5e-3;
    let count = 0;
    for (const [, dayPnL] of dailyPnL.entries()) {
      if (dayPnL >= threshold) count++;
    }
    return count;
  }, [dailyPnL, tradesByDay, selected]);
  const calendarDays = reactExports.useMemo(() => {
    if (!activePhase) return [];
    const days = [];
    const year = currentYear;
    const month = currentMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = firstDay.getDay();
    for (let i = 0; i < startPad; i++) {
      const d = new Date(year, month, -startPad + i + 1);
      days.push({
        date: d,
        key: "",
        pnl: null,
        trades: []
      });
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const key = localDateKey(year, month, d);
      const pnl = dailyPnL.get(key) ?? null;
      const dayTrades = tradesByDay.get(key) ?? [];
      days.push({
        date,
        key,
        pnl,
        trades: dayTrades
      });
    }
    return days;
  }, [currentYear, currentMonth, activePhase, dailyPnL, tradesByDay]);
  const phaseTrades = filteredTrades;
  const shortHeldTrades = phaseTrades.filter((t) => t.duration_seconds < 180);
  const shortHeldCount = shortHeldTrades.length;
  const totalPnL = phaseTrades.reduce((sum, t) => sum + t.profit, 0);
  const bestDay = [...dailyPnL.entries()].sort((a, b) => b[1] - a[1])[0];
  const worstDay = [...dailyPnL.entries()].sort((a, b) => a[1] - b[1])[0];
  const fmt = selected?.currency === "USD" ? formatUSD : formatNaira;
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-end justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold", children: "Trading Stats" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Your closed trades, calendar & phase progress" })
    ] }) }),
    accounts.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: accounts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelected(a), className: `font-display rounded-md border px-3 py-1.5 text-xs ${selected?.id === a.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`, children: [
      a.mt5_login,
      " · ",
      a.challenges?.name
    ] }, a.id)) }),
    selected && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      phaseInfo.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex flex-wrap gap-2", children: phaseInfo.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedPhase(p.key), className: `font-display rounded-md border px-3 py-1.5 text-xs ${selectedPhase === p.key ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`, children: p.label }, p.key)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display flex items-center gap-2 text-base font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-4 w-4 text-primary" }),
            "Trading Calendar — ",
            selected.challenges?.name ?? "Account"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: prevMonth, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-sm font-semibold min-w-[140px] text-center", children: [
              monthNames[currentMonth],
              " ",
              currentYear
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: nextMonth, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden", children: [
          dayNames.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/50 px-2 py-1.5 text-center text-[11px] font-semibold text-muted-foreground", children: name }, name)),
          calendarDays.map((day, i) => {
            if (!day.key) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card p-2" }, `pad-${i}`);
            const isToday = day.key === todayLocal;
            const pnl = day.pnl;
            const color = pnl === null ? "bg-card" : pnl > 0 ? "bg-green-500/10" : pnl < 0 ? "bg-red-500/10" : "bg-muted/30";
            const textColor = pnl === null ? "" : pnl > 0 ? "text-green-600 dark:text-green-400" : pnl < 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedDay(day.trades.length > 0 ? day.key : null), className: `w-full ${color} p-2 pb-3 pt-2.5 text-center transition-colors hover:brightness-95 cursor-pointer border-0 ${isToday ? "ring-1 ring-primary" : ""}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xs font-semibold", children: day.date.getDate() }),
              pnl !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-[10px] font-medium leading-tight ${textColor}`, children: [
                pnl > 0 ? "+" : "",
                fmt(pnl)
              ] })
            ] });
          })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: selectedDay !== null, onOpenChange: (open) => {
          if (!open) setSelectedDay(null);
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-lg max-h-[80vh] flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display", children: [
            "Trades — ",
            selectedDay ? (/* @__PURE__ */ new Date(selectedDay + "T00:00:00")).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric"
            }) : ""
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto -mx-6 px-6", children: selectedDay && (tradesByDay.get(selectedDay) ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-4 text-center", children: "No trades this day" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 pb-2", children: (tradesByDay.get(selectedDay ?? "") ?? []).map((t) => {
            const isShort = t.duration_seconds < 180;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center justify-between gap-4 rounded-md px-3 py-2 border-l-2 ${isShort ? "border-red-400 bg-red-500/5" : "border-transparent hover:bg-muted/30"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground w-16", children: [
                "#",
                t.ticket
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm flex-1", children: t.symbol }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs w-16 text-right ${isShort ? "text-red-500 font-semibold" : "text-muted-foreground"}`, children: [
                t.duration_seconds,
                "s"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs w-24 text-right font-medium ${t.profit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`, children: [
                t.profit >= 0 ? "+" : "",
                fmt(t.profit)
              ] })
            ] }, t.ticket);
          }) }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-4 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-3 h-3 rounded bg-green-500/20" }),
            " Green = profitable day"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-3 h-3 rounded bg-red-500/20" }),
            " Red = losing day"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-3 h-3 rounded bg-muted/30" }),
            " Grey = breakeven"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Click a day to see individual trades" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display flex items-center gap-2 text-base font-semibold mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-primary" }),
          activePhase?.label ?? "Phase",
          " Summary"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-3 w-3" }),
              " ",
              selected?.currency === "USD" ? "Profitable Days" : "Trading Days"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display mt-1 text-lg font-bold", children: profitableTradingDays })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-3 w-3" }),
              " Min Required"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display mt-1 text-lg font-bold", children: selected.currency === "USD" ? "5" : selected.challenges?.min_trading_days ?? 3 }),
            selected?.currency === "USD" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-0.5", children: "≥0.5% profit each" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }),
              " Closed Trades"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display mt-1 text-lg font-bold", children: phaseTrades.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-3 w-3" }),
              " Net P&L"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `font-display mt-1 text-lg font-bold ${totalPnL >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`, children: [
              totalPnL >= 0 ? "+" : "",
              fmt(totalPnL)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-3 w-3 text-green-500" }),
              " Best Day"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display mt-1 text-lg font-bold text-green-600 dark:text-green-400", children: bestDay ? fmt(bestDay[1]) : "—" }),
            bestDay && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: new Date(bestDay[0]).toLocaleDateString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3 w-3 text-red-500" }),
              " Worst Day"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display mt-1 text-lg font-bold text-red-600 dark:text-red-400", children: worstDay ? fmt(worstDay[1]) : "—" }),
            worstDay && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: new Date(worstDay[0]).toLocaleDateString() })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display flex items-center gap-2 text-base font-semibold mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-primary" }),
          "Scalping Tracker"
        ] }),
        shortHeldCount === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-green-600 dark:text-green-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "✓" }),
          " No scalping violations in ",
          activePhase?.label ?? "this phase"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
                shortHeldCount,
                " / 4 short-held trades"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "4th short-held trade triggers automatic breach" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full rounded-full transition-all ${shortHeldCount >= 4 ? "bg-red-500" : shortHeldCount >= 3 ? "bg-orange-500" : "bg-amber-500"}`, style: {
              width: `${Math.min(shortHeldCount / 4 * 100, 100)}%`
            } }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-muted-foreground border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 pr-3 font-semibold", children: "Ticket" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 pr-3 font-semibold", children: "Symbol" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 pr-3 font-semibold", children: "Duration" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-2 font-semibold", children: "P&L" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: shortHeldTrades.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-1.5 pr-3 font-mono text-muted-foreground", children: [
                "#",
                t.ticket
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 pr-3 font-display", children: t.symbol }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-1.5 pr-3 text-muted-foreground", children: [
                t.duration_seconds,
                "s"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: `py-1.5 text-right ${t.profit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`, children: [
                t.profit >= 0 ? "+" : "",
                fmt(t.profit)
              ] })
            ] }, t.ticket)) })
          ] }) })
        ] })
      ] })
    ] }),
    !selected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 rounded-xl border border-dashed border-border bg-card p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "mx-auto h-10 w-10 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display mt-3 text-base font-semibold", children: "No active accounts" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Purchase a challenge to start tracking your stats." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/buy", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-4 font-display", children: "Buy a challenge" }) })
    ] })
  ] });
}
export {
  StatsPage as component
};
