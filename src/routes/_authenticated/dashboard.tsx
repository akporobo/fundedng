import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteNav } from "@/components/site/SiteNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatNaira, formatPercent } from "@/lib/utils";
import { toast } from "sonner";
import { LogOut, Plus, Trophy, TrendingUp, Activity, Bell } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: DashboardPage });

interface Account {
  id: string; mt5_login: string; mt5_password: string; mt5_server: string;
  starting_balance: number; current_equity: number | null; current_phase: number;
  status: "active" | "breached" | "passed" | "funded";
  challenge_id: string;
  challenges?: { name: string; profit_target_percent: number; max_drawdown_percent: number; phases: number };
}
interface Payout { id: string; amount_naira: number; status: string; payment_method: string; created_at: string; }
interface Notification { id: string; title: string; message: string; type: string; is_read: boolean; created_at: string; }

const statusVariant: Record<string, string> = {
  active: "bg-primary/15 text-primary border-primary/30",
  breached: "bg-destructive/15 text-destructive border-destructive/30",
  passed: "bg-gold/15 text-gold border-gold/30",
  funded: "bg-info/15 text-info border-info/30",
};

function DashboardPage() {
  const { user, profile, signOut } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selected, setSelected] = useState<Account | null>(null);
  const [snapshots, setSnapshots] = useState<{ snapshot_time: string; equity: number }[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [payoutMethod, setPayoutMethod] = useState<"usdt" | "bank_transfer">("usdt");
  const [walletInput, setWalletInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    if (!user) return;
    const [a, p, n] = await Promise.all([
      supabase.from("trader_accounts").select("*, challenges(name,profit_target_percent,max_drawdown_percent,phases)").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("payouts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
    ]);
    const list = (a.data as Account[]) ?? [];
    setAccounts(list);
    setPayouts((p.data as Payout[]) ?? []);
    setNotifications((n.data as Notification[]) ?? []);
    if (!selected && list.length) setSelected(list[0]);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);
  useEffect(() => {
    if (!selected) return;
    supabase.from("account_snapshots").select("snapshot_time, equity").eq("trader_account_id", selected.id).order("snapshot_time").then(({ data }) => setSnapshots((data as { snapshot_time: string; equity: number }[]) ?? []));
  }, [selected]);

  const requestPayout = async () => {
    if (!selected || !walletInput) return;
    if (!profile?.kyc_verified) return toast.error("KYC required. Contact admin to verify identity.");
    if (!["passed", "funded"].includes(selected.status)) return toast.error("Account must be passed or funded.");
    const equity = Number(selected.current_equity ?? selected.starting_balance);
    const profit = equity - selected.starting_balance;
    if (profit <= 0) return toast.error("No profit available.");
    const amount = Math.floor(profit * 0.8);
    setSubmitting(true);
    const { error } = await supabase.from("payouts").insert({
      user_id: user!.id,
      trader_account_id: selected.id,
      amount_naira: amount,
      profit_percent: Number(((profit / selected.starting_balance) * 100).toFixed(4)),
      payment_method: payoutMethod,
      wallet_address: payoutMethod === "usdt" ? walletInput : null,
      bank_details: payoutMethod === "bank_transfer" ? { account: walletInput } : null,
    } as never);
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success(`Payout of ${formatNaira(amount)} requested!`);
    setWalletInput("");
    load();
  };

  const equity = Number(selected?.current_equity ?? selected?.starting_balance ?? 0);
  const start = Number(selected?.starting_balance ?? 0);
  const profitPct = start ? ((equity - start) / start) * 100 : 0;
  const minEquity = snapshots.reduce((m, s) => Math.min(m, Number(s.equity)), equity);
  const ddPct = start ? Math.max(0, ((start - minEquity) / start) * 100) : 0;
  const target = selected?.challenges?.profit_target_percent ?? 10;
  const maxDD = selected?.challenges?.max_drawdown_percent ?? 20;
  const unread = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen">
      <SiteNav />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {profile?.full_name || user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/buy"><Button size="sm" className="font-display"><Plus className="mr-1 h-4 w-4"/>New Challenge</Button></Link>
            <Button size="sm" variant="outline" onClick={signOut}><LogOut className="mr-1 h-4 w-4"/>Sign out</Button>
          </div>
        </div>

        {accounts.length === 0 ? (
          <div className="mt-12 rounded-xl border border-border bg-card p-16 text-center">
            <Trophy className="mx-auto h-12 w-12 text-primary" />
            <h2 className="font-display mt-4 text-2xl font-bold">No challenges yet</h2>
            <p className="mt-2 text-muted-foreground">Buy your first challenge to get an MT5 account in seconds.</p>
            <Link to="/buy"><Button className="font-display mt-6">Get Funded →</Button></Link>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="mt-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="mr-1 h-3 w-3"/>Notifications {unread > 0 && <span className="ml-1 rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{unread}</span>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              {accounts.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {accounts.map((a) => (
                    <button key={a.id} onClick={() => setSelected(a)}
                      className={`font-display rounded-md border px-3 py-1.5 text-xs ${selected?.id === a.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>
                      {a.mt5_login} · {a.challenges?.name}
                    </button>
                  ))}
                </div>
              )}

              {selected && (
                <>
                  <div className="grid gap-4 md:grid-cols-5">
                    {[
                      { label: "Account Size", value: formatNaira(start) },
                      { label: "Equity", value: formatNaira(equity), color: "text-primary" },
                      { label: "P/L", value: formatNaira(equity - start), color: equity-start >= 0 ? "text-primary" : "text-destructive" },
                      { label: "Phase", value: `${selected.current_phase}/${selected.challenges?.phases ?? 2}`, color: "text-gold" },
                      { label: "Status", value: <Badge className={`${statusVariant[selected.status]} font-display`}>{selected.status.toUpperCase()}</Badge> },
                    ].map((m, i) => (
                      <div key={i} className="rounded-xl border border-border bg-card p-5">
                        <div className="text-xs text-muted-foreground">{m.label}</div>
                        <div className={`font-display mt-2 text-lg font-bold ${m.color ?? ""}`}>{m.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="font-display flex items-center gap-2 text-base font-semibold"><TrendingUp className="h-4 w-4 text-primary"/>Phase {selected.current_phase} Progress</h3>
                    <div className="mt-5 space-y-5">
                      <div>
                        <div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">Profit Target</span><span className="font-display text-primary">{formatPercent(Math.max(0, profitPct))} / {target}%</span></div>
                        <Progress value={Math.min(100, Math.max(0, (profitPct / target) * 100))} />
                      </div>
                      <div>
                        <div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">Drawdown</span><span className={`font-display ${ddPct/maxDD>0.75?"text-destructive":ddPct/maxDD>0.5?"text-warning":"text-primary"}`}>{formatPercent(ddPct)} / {maxDD}%</span></div>
                        <Progress value={Math.min(100, (ddPct/maxDD)*100)} />
                      </div>
                    </div>
                  </div>

                  {snapshots.length > 1 && (
                    <div className="rounded-xl border border-border bg-card p-6">
                      <h3 className="font-display flex items-center gap-2 text-base font-semibold"><Activity className="h-4 w-4 text-primary"/>Equity Curve</h3>
                      <div className="mt-4 h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={snapshots}>
                            <XAxis dataKey="snapshot_time" hide />
                            <YAxis tick={{ fontSize: 11, fill: "currentColor" }} stroke="currentColor" className="text-muted-foreground" domain={["auto","auto"]} />
                            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} formatter={(v) => formatNaira(Number(v))} />
                            <Line type="monotone" dataKey="equity" stroke="var(--primary)" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="font-display text-base font-semibold">MT5 Credentials</h3>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      {[["Login", selected.mt5_login],["Password", selected.mt5_password],["Server", selected.mt5_server]].map(([l, v]) => (
                        <div key={l} className="rounded-md border border-border bg-background p-3">
                          <div className="text-[11px] text-muted-foreground">{l}</div>
                          <div className="font-display mt-1 text-sm text-primary break-all">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(selected.status === "passed" || selected.status === "funded") && (
                    <div className="rounded-xl border border-primary/40 bg-primary/5 p-6">
                      <h3 className="font-display text-lg font-bold text-primary">🎉 You're funded — request payout</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Get 80% of your profits within 24 hours.</p>
                      {!profile?.kyc_verified && <Alert variant="destructive" className="mt-3"><AlertDescription>KYC verification required before payout.</AlertDescription></Alert>}
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div>
                          <Label>Method</Label>
                          <Select value={payoutMethod} onValueChange={(v) => setPayoutMethod(v as "usdt" | "bank_transfer")}>
                            <SelectTrigger className="mt-1"><SelectValue/></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="usdt">USDT (TRC20)</SelectItem>
                              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>{payoutMethod === "usdt" ? "Wallet address" : "Account number"}</Label>
                          <Input value={walletInput} onChange={(e)=>setWalletInput(e.target.value)} className="mt-1" />
                        </div>
                      </div>
                      <Button className="font-display mt-4" onClick={requestPayout} disabled={submitting || !walletInput}>
                        {submitting ? "Submitting…" : "Request payout →"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="accounts" className="mt-6 space-y-3">
              {accounts.map((a) => (
                <div key={a.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-5">
                  <div className="flex-1 min-w-[160px]">
                    <div className="font-display text-primary">{a.mt5_login}</div>
                    <div className="text-xs text-muted-foreground">{a.challenges?.name}</div>
                  </div>
                  <div className="text-sm">{formatNaira(a.starting_balance)}</div>
                  <div className="font-display text-sm text-gold">Phase {a.current_phase}/{a.challenges?.phases ?? 2}</div>
                  <Badge className={`${statusVariant[a.status]} font-display`}>{a.status.toUpperCase()}</Badge>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="payouts" className="mt-6 space-y-3">
              {payouts.length === 0 ? <p className="text-muted-foreground">No payouts yet.</p> : payouts.map((p) => (
                <div key={p.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-5">
                  <div className="flex-1">
                    <div className="font-display font-semibold">{formatNaira(p.amount_naira)}</div>
                    <div className="text-xs text-muted-foreground">{p.payment_method} · {new Date(p.created_at).toLocaleDateString()}</div>
                  </div>
                  <Badge className="font-display" variant="outline">{p.status.toUpperCase()}</Badge>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="notifications" className="mt-6 space-y-2">
              {notifications.length === 0 ? <p className="text-muted-foreground">No notifications.</p> : notifications.map((n) => (
                <div key={n.id} className={`rounded-xl border bg-card p-4 ${n.is_read ? "border-border" : "border-primary/40"}`}>
                  <div className="flex justify-between"><div className="font-semibold">{n.title}</div><div className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</div></div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
