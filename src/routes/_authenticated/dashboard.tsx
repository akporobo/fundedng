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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatNaira, formatPercent } from "@/lib/utils";
import { toast } from "sonner";
import { LogOut, Plus, Trophy, TrendingUp, Activity, Bell, Sparkles, ShieldCheck, ShieldAlert, Landmark } from "lucide-react";
import { CertificateCard, type Certificate } from "@/components/certificates/CertificateCard";

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
  const { user, profile, signOut, refresh } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selected, setSelected] = useState<Account | null>(null);
  const [snapshots, setSnapshots] = useState<{ snapshot_time: string; equity: number }[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [savingKyc, setSavingKyc] = useState(false);

  useEffect(() => {
    setBankAccountNumber(profile?.bank_account_number ?? "");
    setBankName(profile?.bank_name ?? "");
    setBankAccountName(profile?.bank_account_name ?? profile?.full_name ?? "");
  }, [profile]);

  const saveBankDetails = async () => {
    const acct = bankAccountNumber.replace(/\s+/g, "");
    if (!/^\d{10}$/.test(acct)) return toast.error("Account number must be 10 digits.");
    if (!bankName.trim()) return toast.error("Bank name is required.");
    if (!bankAccountName.trim()) return toast.error("Account holder name is required.");
    setSavingKyc(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        bank_account_number: acct,
        bank_name: bankName.trim(),
        bank_account_name: bankAccountName.trim(),
        kyc_verified: false, // re-verification required when changed
      } as never)
      .eq("id", user!.id);
    setSavingKyc(false);
    if (error) return toast.error(error.message);
    toast.success("Bank details saved. Awaiting admin verification.");
    await refresh();
  };

  const seedDemo = async () => {
    setSeeding(true);
    const { error } = await supabase.rpc("seed_demo_data");
    setSeeding(false);
    if (error) return toast.error(error.message);
    toast.success("Demo data loaded.");
    setSelected(null);
    load();
  };

  const load = async () => {
    if (!user) return;
    const [a, p, n, c] = await Promise.all([
      supabase.from("trader_accounts").select("*, challenges(name,profit_target_percent,max_drawdown_percent,phases)").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("payouts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
      supabase.from("certificates").select("*").eq("user_id", user.id).order("issued_at", { ascending: false }),
    ]);
    const list = (a.data as Account[]) ?? [];
    setAccounts(list);
    setPayouts((p.data as Payout[]) ?? []);
    setNotifications((n.data as Notification[]) ?? []);
    setCertificates((c.data as Certificate[]) ?? []);
    if (!selected && list.length) setSelected(list[0]);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);
  useEffect(() => {
    if (!selected) return;
    supabase.from("account_snapshots").select("snapshot_time, equity").eq("trader_account_id", selected.id).order("snapshot_time").then(({ data }) => setSnapshots((data as { snapshot_time: string; equity: number }[]) ?? []));
  }, [selected]);

  const requestPayout = async () => {
    if (!selected) return;
    if (!profile?.bank_account_number) return toast.error("Add your bank account in the KYC card first.");
    if (!profile?.kyc_verified) return toast.error("Bank account pending admin verification.");
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
      payment_method: "bank_transfer",
      wallet_address: null,
      bank_details: {
        account_number: profile.bank_account_number,
        bank_name: profile.bank_name,
        account_name: profile.bank_account_name,
      },
    } as never);
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success(`Payout of ${formatNaira(amount)} requested!`);
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
            <Button size="sm" variant="outline" onClick={seedDemo} disabled={seeding}>
              <Sparkles className="mr-1 h-4 w-4"/>{seeding ? "Loading…" : "Load demo data"}
            </Button>
            <Link to="/buy"><Button size="sm" className="font-display"><Plus className="mr-1 h-4 w-4"/>New Challenge</Button></Link>
            <Button size="sm" variant="outline" onClick={signOut}><LogOut className="mr-1 h-4 w-4"/>Sign out</Button>
          </div>
        </div>

        {accounts.length === 0 ? (
          <div className="mt-12 rounded-xl border border-border bg-card p-16 text-center">
            <Trophy className="mx-auto h-12 w-12 text-primary" />
            <h2 className="font-display mt-4 text-2xl font-bold">No challenges yet</h2>
            <p className="mt-2 text-muted-foreground">Buy your first challenge to get an MT5 account in seconds.</p>
            <div className="mt-6 flex justify-center gap-2">
              <Link to="/buy"><Button className="font-display">Get Funded →</Button></Link>
              <Button variant="outline" onClick={seedDemo} disabled={seeding}>
                <Sparkles className="mr-1 h-4 w-4"/>{seeding ? "Loading…" : "Load demo data"}
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="mt-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
              <TabsTrigger value="certificates">
                <Trophy className="mr-1 h-3 w-3"/>Certificates {certificates.length > 0 && <span className="ml-1 rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{certificates.length}</span>}
              </TabsTrigger>
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

                  {/* KYC: bank account on file (only KYC field) */}
                  <div className={`rounded-xl border p-6 ${profile?.kyc_verified ? "border-primary/30 bg-primary/5" : "border-warning/40 bg-warning/5"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display flex items-center gap-2 text-base font-semibold">
                          {profile?.kyc_verified ? <ShieldCheck className="h-4 w-4 text-primary"/> : <ShieldAlert className="h-4 w-4 text-warning"/>}
                          KYC — Payout Bank Account
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          The account holder name must match the name registered on your trader account. Payouts are sent only to this account.
                        </p>
                      </div>
                      <Badge className={`font-display ${profile?.kyc_verified ? "bg-primary/15 text-primary border-primary/30" : "bg-warning/15 text-warning border-warning/30"}`}>
                        {profile?.kyc_verified ? "VERIFIED" : "PENDING"}
                      </Badge>
                    </div>
                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      <div>
                        <Label htmlFor="bank-acct">Account number</Label>
                        <Input id="bank-acct" inputMode="numeric" maxLength={10} placeholder="10-digit NUBAN" className="mt-1 font-mono" value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value.replace(/\D/g, ""))} />
                      </div>
                      <div>
                        <Label htmlFor="bank-name">Bank</Label>
                        <Input id="bank-name" placeholder="e.g. GTBank" className="mt-1" value={bankName} onChange={(e) => setBankName(e.target.value)} maxLength={60} />
                      </div>
                      <div>
                        <Label htmlFor="acct-name">Account holder name</Label>
                        <Input id="acct-name" placeholder="As registered on trader account" className="mt-1" value={bankAccountName} onChange={(e) => setBankAccountName(e.target.value)} maxLength={120} />
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="mt-4" onClick={saveBankDetails} disabled={savingKyc}>
                      <Landmark className="mr-1 h-4 w-4"/>{savingKyc ? "Saving…" : "Save bank details"}
                    </Button>
                  </div>

                  {(selected.status === "passed" || selected.status === "funded") && (
                    <div className="rounded-xl border border-primary/40 bg-primary/5 p-6">
                      <h3 className="font-display text-lg font-bold text-primary">🎉 You're funded — request payout</h3>
                      <p className="mt-1 text-sm text-muted-foreground">80% of profits paid to your verified bank account within 24 hours.</p>
                      {!profile?.kyc_verified && (
                        <Alert variant="destructive" className="mt-3">
                          <AlertDescription>Your bank account is awaiting admin verification before payouts are released.</AlertDescription>
                        </Alert>
                      )}
                      {profile?.kyc_verified && profile.bank_account_number && (
                        <div className="mt-4 rounded-md border border-border bg-background p-3 text-sm">
                          <div className="text-[11px] text-muted-foreground">Payout destination</div>
                          <div className="font-display mt-1 text-primary">
                            {profile.bank_account_number} · {profile.bank_name} · {profile.bank_account_name}
                          </div>
                        </div>
                      )}
                      <Button className="font-display mt-4" onClick={requestPayout} disabled={submitting || !profile?.kyc_verified}>
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
