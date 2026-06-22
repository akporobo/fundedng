import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, CalendarDays, BarChart3, DollarSign, Target, Trophy } from "lucide-react";

export const Route = createFileRoute("/_authenticated/stats")({ component: StatsPage });

interface Account {
  id: string; mt5_login: string; starting_balance: number; current_phase: number;
  status: string; trading_days?: number; created_at: string; phase1_passed_at: string | null;
  challenges?: { name: string; min_trading_days?: number; profit_target_percent: number; max_drawdown_percent: number; phases: number };
}

interface ClosedTrade {
  ticket: number; symbol: string; profit: number; close_time: string;
  duration_seconds: number; volume: number;
}

function StatsPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selected, setSelected] = useState<Account | null>(null);
  const [trades, setTrades] = useState<ClosedTrade[]>([]);
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("trader_accounts")
      .select("*, challenges(name,min_trading_days,profit_target_percent,max_drawdown_percent,phases)")
      .eq("user_id", user.id)
      .in("status", ["active", "funded", "passed"])
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const list = (data as Account[]) ?? [];
        setAccounts(list);
        if (list.length > 0) setSelected(list[0]);
      });
  }, [user]);

  const phaseStart = useMemo(() => {
    if (!selected) return null;
    if (selected.current_phase >= 2 && selected.phase1_passed_at) {
      return selected.phase1_passed_at;
    }
    return selected.created_at;
  }, [selected]);

  useEffect(() => {
    if (!selected || !phaseStart) return;
    supabase
      .from("closed_trades")
      .select("ticket, symbol, profit, close_time, duration_seconds, volume")
      .eq("account_id", selected.id)
      .gte("close_time", phaseStart)
      .order("close_time", { ascending: true })
      .then(({ data }) => setTrades((data as ClosedTrade[]) ?? []));
  }, [selected, phaseStart]);

  useEffect(() => {
    if (!selected) return;
    const channel = supabase
      .channel(`stats-closed-trades-${selected.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "closed_trades",
          filter: `account_id=eq.${selected.id}`,
        },
        (payload) => {
          setTrades((prev) => [...prev, payload.new as ClosedTrade]);
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selected?.id]);

  const tradesByDay = useMemo(() => {
    const map = new Map<string, ClosedTrade[]>();
    for (const t of trades) {
      const day = t.close_time.slice(0, 10);
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(t);
    }
    return map;
  }, [trades]);

  const dailyPnL = useMemo(() => {
    const map = new Map<string, number>();
    for (const [day, dayTrades] of tradesByDay) {
      map.set(day, dayTrades.reduce((sum, t) => sum + t.profit, 0));
    }
    return map;
  }, [tradesByDay]);

  const calendarDays = useMemo(() => {
    if (!phaseStart) return [];
    const days: { date: Date; key: string; pnl: number | null; trades: ClosedTrade[] }[] = [];

    const year = currentYear;
    const month = currentMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startPad = firstDay.getDay();

    for (let i = 0; i < startPad; i++) {
      const d = new Date(year, month, -startPad + i + 1);
      days.push({ date: d, key: "", pnl: null, trades: [] });
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const key = date.toISOString().slice(0, 10);
      const pnl = dailyPnL.get(key) ?? null;
      const dayTrades = tradesByDay.get(key) ?? [];
      days.push({ date, key, pnl, trades: dayTrades });
    }

    return days;
  }, [currentYear, currentMonth, phaseStart, dailyPnL, tradesByDay]);

  const phaseTrades = trades;
  const totalPnL = phaseTrades.reduce((sum, t) => sum + t.profit, 0);
  const bestDay = [...dailyPnL.entries()].sort((a, b) => b[1] - a[1])[0];
  const worstDay = [...dailyPnL.entries()].sort((a, b) => a[1] - b[1])[0];

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Trading Stats</h1>
          <p className="text-sm text-muted-foreground">Your closed trades, calendar &amp; phase progress</p>
        </div>
      </div>

      {accounts.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {accounts.map((a) => (
            <button key={a.id} onClick={() => setSelected(a)}
              className={`font-display rounded-md border px-3 py-1.5 text-xs ${selected?.id === a.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>
              {a.mt5_login} · {a.challenges?.name}
            </button>
          ))}
        </div>
      )}

      {selected && phaseStart && (
        <>
          {/* Trading Calendar */}
          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display flex items-center gap-2 text-base font-semibold">
                <CalendarDays className="h-4 w-4 text-primary" />
                Trading Calendar — {selected.challenges?.name ?? "Account"}
              </h2>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
                <span className="font-display text-sm font-semibold min-w-[140px] text-center">{monthNames[currentMonth]} {currentYear}</span>
                <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
              {dayNames.map((name) => (
                <div key={name} className="bg-muted/50 px-2 py-1.5 text-center text-[11px] font-semibold text-muted-foreground">{name}</div>
              ))}
              {calendarDays.map((day, i) => {
                if (!day.key) return <div key={`pad-${i}`} className="bg-card p-2" />;
                const isToday = day.key === new Date().toISOString().slice(0, 10);
                const pnl = day.pnl;
                const color = pnl === null ? "bg-card"
                  : pnl > 0 ? "bg-green-500/10"
                  : pnl < 0 ? "bg-red-500/10"
                  : "bg-muted/30";
                const textColor = pnl === null ? ""
                  : pnl > 0 ? "text-green-600 dark:text-green-400"
                  : pnl < 0 ? "text-red-600 dark:text-red-400"
                  : "text-muted-foreground";
                const isExpanded = expandedDay === day.key;
                return (
                  <div key={day.key}>
                    <button
                      onClick={() => setExpandedDay(isExpanded ? null : day.key)}
                      className={`w-full ${color} p-2 text-center transition-colors hover:brightness-95 cursor-pointer border-0 ${isToday ? "ring-1 ring-primary" : ""}`}
                    >
                      <div className="font-display text-xs font-semibold">{day.date.getDate()}</div>
                      {pnl !== null && (
                        <div className={`text-[10px] font-medium leading-tight ${textColor}`}>
                          {pnl > 0 ? "+" : ""}{formatNaira(pnl)}
                        </div>
                      )}
                    </button>
                    {isExpanded && day.trades.length > 0 && (
                      <div className="col-span-7 bg-muted/20 border-t border-border px-3 py-2 text-xs space-y-1">
                        {day.trades.map((t) => (
                          <div key={t.ticket} className="flex items-center justify-between gap-4">
                            <span className="font-mono text-muted-foreground">#{t.ticket}</span>
                            <span className="font-display">{t.symbol}</span>
                            <span className="text-muted-foreground">{t.duration_seconds}s</span>
                            <span className={t.profit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                              {t.profit >= 0 ? "+" : ""}{formatNaira(t.profit)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-green-500/20" /> Green = profitable day</span>
              <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-red-500/20" /> Red = losing day</span>
              <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-muted/30" /> Grey = breakeven</span>
              <span>Click a day to see individual trades</span>
            </div>
          </div>

          {/* Phase Summary Stats */}
          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            <h2 className="font-display flex items-center gap-2 text-base font-semibold mb-5">
              <BarChart3 className="h-4 w-4 text-primary" />
              Phase Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="text-[11px] text-muted-foreground flex items-center gap-1"><CalendarDays className="h-3 w-3" /> Trading Days</div>
                <div className="font-display mt-1 text-lg font-bold">{selected.trading_days ?? 0}</div>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="text-[11px] text-muted-foreground flex items-center gap-1"><Target className="h-3 w-3" /> Min Required</div>
                <div className="font-display mt-1 text-lg font-bold">{selected.challenges?.min_trading_days ?? 3}</div>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="text-[11px] text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Closed Trades</div>
                <div className="font-display mt-1 text-lg font-bold">{phaseTrades.length}</div>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="text-[11px] text-muted-foreground flex items-center gap-1"><DollarSign className="h-3 w-3" /> Net P&amp;L</div>
                <div className={`font-display mt-1 text-lg font-bold ${totalPnL >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {totalPnL >= 0 ? "+" : ""}{formatNaira(totalPnL)}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="text-[11px] text-muted-foreground flex items-center gap-1"><Trophy className="h-3 w-3 text-green-500" /> Best Day</div>
                <div className="font-display mt-1 text-lg font-bold text-green-600 dark:text-green-400">
                  {bestDay ? formatNaira(bestDay[1]) : "—"}
                </div>
                {bestDay && <div className="text-[10px] text-muted-foreground">{new Date(bestDay[0]).toLocaleDateString()}</div>}
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="text-[11px] text-muted-foreground flex items-center gap-1"><TrendingDown className="h-3 w-3 text-red-500" /> Worst Day</div>
                <div className="font-display mt-1 text-lg font-bold text-red-600 dark:text-red-400">
                  {worstDay ? formatNaira(worstDay[1]) : "—"}
                </div>
                {worstDay && <div className="text-[10px] text-muted-foreground">{new Date(worstDay[0]).toLocaleDateString()}</div>}
              </div>
            </div>
          </div>
        </>
      )}

      {!selected && (
        <div className="mt-10 rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <BarChart3 className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="font-display mt-3 text-base font-semibold">No active accounts</p>
          <p className="mt-1 text-sm text-muted-foreground">Purchase a challenge to start tracking your stats.</p>
          <Link to="/buy"><Button className="mt-4 font-display">Buy a challenge</Button></Link>
        </div>
      )}
    </div>
  );
}
