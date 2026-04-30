import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatNaira, formatPercent } from "@/lib/utils";
import { toast } from "sonner";
import { LogOut, Plus, Trophy, TrendingUp, Activity, Bell, ShieldCheck, ShieldAlert, Landmark, Sparkles, Check, Clock } from "lucide-react";
import { CertificateCard, type Certificate } from "@/components/certificates/CertificateCard";
import { subscribeToPush } from "@/lib/push";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { NewUserInstallPrompt } from "@/components/NewUserInstallPrompt";
import { PendingAccounts } from "@/components/dashboard/PendingAccounts";
import { RefreshButton } from "@/components/ui/refresh-button";
import { listNigerianBanks, verifyKycPaystack } from "@/server/kyc.functions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: DashboardPage });

interface Account {
  id: string; mt5_login: string; mt5_password: string; mt5_server: string;
  starting_balance: number; current_equity: number | null; current_phase: number;
  status: "active" | "breached" | "passed" | "funded";
  challenge_id: string;
  phase2_requested_at: string | null;
  funded_requested_at: string | null;
  challenges?: { name: string; profit_target_percent: number; max_drawdown_percent: number; phases: number };
}
interface Payout { id: string; amount_naira: number; status: string; payment_method: string; created_at: string; trader_account_id?: string; }
interface Notification { id: string; title: string; message: string; type: string; is_read: boolean; created_at: string; }

function PayoutCountdown({ nextPayoutDate }: { nextPayoutDate: Date }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = nextPayoutDate.getTime() - Date.now();
  const isReady = diff <= 0;
  const days = Math.max(0, Math.floor(diff / 86400000));
  const hours = Math.max(0, Math.floor((diff % 86400000) / 3600000));
  const minutes = Math.max(0, Math.floor((diff % 3600000) / 60000));
  const seconds = Math.max(0, Math.floor((diff % 60000) / 1000));
  return (
    <div className="rounded-xl border border-primary/40 bg-primary/5 p-6">
      <div className="font-display flex items-center gap-2 text-base font-bold text-primary">
        <Clock className="h-4 w-4" />
        {isReady ? "🎉 Payout Window Open!" : "⏳ Next Payout Window"}
      </div>
      {isReady ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Your 7-day window is open. Request your payout now — processed within 24hrs of approval.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
          {[
            { label: "Days", value: days },
            { label: "Hours", value: hours },
            { label: "Mins", value: minutes },
            { label: "Secs", value: seconds },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border border-border bg-background p-2 text-center sm:p-3">
              <div className="font-display text-xl font-bold text-primary sm:text-2xl">
                {String(value).padStart(2, "0")}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      )}
      <p className="mt-4 text-[11px] text-muted-foreground">
        Payout rules: min 10% of account size · max 50% per cycle · processed within 24hrs of approval
      </p>
    </div>
  );
}

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
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [banks, setBanks] = useState<{ name: string; code: string }[]>([]);
  const [verifyingKyc, setVerifyingKyc] = useState(false);

  useEffect(() => {
    setBankAccountNumber(profile?.bank_account_number ?? "");
    setBankName(profile?.bank_name ?? "");
    setBankAccountName(profile?.bank_account_name ?? profile?.full_name ?? "");
  }, [profile]);

  // Load Nigerian bank list (Paystack) once.
  useEffect(() => {
    let alive = true;
    listNigerianBanks()
      .then((res) => {
        if (!alive) return;
        if (res.ok) setBanks(res.banks);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const verifyBankWithPaystack = async () => {
    const acct = bankAccountNumber.replace(/\s+/g, "");
    if (!/^\d{10}$/.test(acct)) return toast.error("Account number must be 10 digits.");
    if (!bankCode) return toast.error("Select your bank.");
    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) return toast.error("Please sign in again.");
    const bank = banks.find((b) => b.code === bankCode);
    setVerifyingKyc(true);
    try {
      const res = await verifyKycPaystack({
        data: {
          accessToken: sess.session.access_token,
          accountNumber: acct,
          bankCode,
          bankName: bank?.name ?? bankName.trim() ?? "",
        },
      });
      if (!res.ok) return toast.error(res.error);
      toast.success(`Verified · ${res.accountName}`);
      await refresh();
    } finally {
      setVerifyingKyc(false);
    }
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
  const refreshDashboard = async () => {
    await load();
    if (selected) {
      const { data } = await supabase
        .from("account_snapshots")
        .select("snapshot_time, equity")
        .eq("trader_account_id", selected.id)
        .order("snapshot_time");
      setSnapshots((data as { snapshot_time: string; equity: number }[]) ?? []);
    }
    toast.success("Dashboard updated");
  };
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
    const minPayout = selected.starting_balance * 0.1;
    const maxPayout = selected.starting_balance * 0.5;
    const traderShare = Math.floor(profit * 0.8);
    if (profit <= 0) return toast.error("No profit available to withdraw.");

    // First payout for this account is capped at 10% of the 50% max
    // (i.e., 5% of starting balance) — paid 80/20 like all subsequent payouts.
    const hasPriorPayout = payouts.some(
      (p) =>
        ["approved", "paid"].includes(p.status) &&
        (p as Payout & { trader_account_id?: string }).trader_account_id === selected.id,
    );
    const cap = hasPriorPayout
      ? Math.floor(maxPayout) // standard 50% cap
      : Math.floor(maxPayout * 0.1); // first payout: 10% of the 50% max

    if (traderShare < minPayout)
      return toast.error(`Minimum payout is ${formatNaira(minPayout)} (10% of account size).`);
    const amount = Math.min(traderShare, cap);
    if (!hasPriorPayout) {
      toast.message(
        `First payout is capped at ${formatNaira(cap)} (10% of your 50% profit cap). Subsequent payouts use the full 50% cap.`,
      );
    }
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

  const canRequestPhase2 =
    !!selected &&
    selected.status === "active" &&
    selected.current_phase < 2 &&
    profitPct >= target;
  const phase2Requested = !!selected?.phase2_requested_at;

  const canRequestFunded =
    !!selected &&
    selected.status === "active" &&
    selected.current_phase >= 2 &&
    profitPct >= target;
  const fundedRequested = !!selected?.funded_requested_at;

  const requestPhase2 = async () => {
    if (!selected) return;
    const { error } = await supabase.rpc("request_phase2", { _account_id: selected.id });
    if (error) return toast.error(error.message);
    toast.success("Phase 2 approval requested. An admin will review shortly.");
    load();
  };

  const requestFunded = async () => {
    if (!selected) return;
    const { error } = await supabase.rpc("request_funded", { _account_id: selected.id });
    if (error) return toast.error(error.message);
    toast.success("Funded approval requested. An admin will review shortly.");
    load();
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {profile?.full_name || user?.email}</p>
          </div>
          <div className="flex gap-2">
            <RefreshButton onRefresh={refreshDashboard} />
            {typeof window !== "undefined" && "Notification" in window && Notification.permission !== "granted" && (
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  const ok = await subscribeToPush(user!.id, supabase);
                  if (ok) toast.success("Notifications enabled");
                  else toast.error("Could not enable notifications");
                }}
              >
                <Bell className="mr-1 h-4 w-4" />Enable Push
              </Button>
            )}
            <Link to="/buy"><Button size="sm" className="font-display"><Plus className="mr-1 h-4 w-4"/>New Challenge</Button></Link>
            <Button size="sm" variant="outline" onClick={signOut}><LogOut className="mr-1 h-4 w-4"/>Sign out</Button>
          </div>
        </div>

        {user && <PendingAccounts userId={user.id} />}

        {accounts.length === 0 ? (
          <div className="mt-10 overflow-hidden rounded-2xl border border-primary/40 bg-card p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-display tracking-wider text-primary">
                  <Sparkles className="h-3 w-3" /> GET STARTED
                </div>
                <h2 className="font-display mt-4 text-3xl font-bold leading-tight md:text-4xl">
                  You don't have an active challenge yet
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Pick an account size, pass two simple phases, and get funded up to ₦2,000,000 — with payouts processed within 24hrs of approval.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                  {[
                    "Instant FundedNG MT5 evaluation account",
                    "Just 3 trading rules — 20% drawdown, trade every 7 days, 3-min minimum hold",
                    "80% profit split, paid in Naira",
                    "Full equity & drawdown tracking on this dashboard",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap gap-2">
                  <Link to="/buy">
                    <Button size="lg" className="font-display animate-pulse-glow">
                      Get Your First Account →
                    </Button>
                  </Link>
                  <Link to="/rules">
                    <Button size="lg" variant="outline" className="font-display">
                      Read the rules
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative hidden rounded-xl border border-border bg-background/60 p-6 md:block">
                <Trophy className="mx-auto h-16 w-16 text-primary" />
                <p className="font-display mt-4 text-center text-lg font-semibold">From ₦7,500</p>
                <p className="mt-1 text-center text-xs text-muted-foreground">One-time challenge fee</p>
              </div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="mt-8">
            <div className="-mx-4 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
              <TabsList className="w-max min-w-full">
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
            </div>

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
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
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
                    {selected.current_phase < 2 && selected.status === "active" && (
                      <div className="mt-5 rounded-md border border-primary/30 bg-primary/5 p-4">
                        {phase2Requested ? (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-warning" />
                            <span className="font-display">Phase 2 approval requested — awaiting admin review.</span>
                          </div>
                        ) : canRequestPhase2 ? (
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="text-sm">
                              <div className="font-display font-semibold text-primary">🎯 You hit the {target}% target!</div>
                              <p className="text-xs text-muted-foreground">Request phase 2 approval — an admin will review and progress your account.</p>
                            </div>
                            <Button size="sm" onClick={requestPhase2}>Request Phase 2 Approval</Button>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Reach {target}% profit ({formatNaira(Math.ceil(start * (1 + target / 100)))} equity) to request phase 2 approval.
                          </p>
                        )}
                      </div>
                    )}
                    {selected.current_phase >= 2 && selected.status === "active" && (
                      <div className="mt-5 rounded-md border border-gold/30 bg-gold/5 p-4">
                        {fundedRequested ? (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-warning" />
                            <span className="font-display">Funded approval requested — awaiting admin review.</span>
                          </div>
                        ) : canRequestFunded ? (
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="text-sm">
                              <div className="font-display font-semibold text-gold">🏆 You hit the {target}% target!</div>
                              <p className="text-xs text-muted-foreground">Request funded approval — an admin will review and fund your account.</p>
                            </div>
                            <Button size="sm" onClick={requestFunded}>Request Funded Approval</Button>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Reach {target}% profit ({formatNaira(Math.ceil(start * (1 + target / 100)))} equity) to request funded approval.
                          </p>
                        )}
                      </div>
                    )}
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
                    <>
                      {(() => {
                        // Account-scoped: only count payouts for THIS funded account.
                        const lastPayout = payouts.find(
                          (p) => ["approved", "paid"].includes(p.status) &&
                                 (p as Payout & { trader_account_id?: string }).trader_account_id === selected.id
                        );
                        // Cooldown only kicks in AFTER the first approved/paid payout.
                        // Before that, the trader can request immediately (assuming KYC verified + profit).
                        const next = lastPayout
                          ? new Date(new Date(lastPayout.created_at).getTime() + 7 * 86400000)
                          : null;
                        const ready = !next || next.getTime() <= Date.now();
                        return (
                          <>
                            {next && <PayoutCountdown nextPayoutDate={next} />}
                            <div className="rounded-xl border border-primary/40 bg-primary/5 p-6">
                              <h3 className="font-display text-lg font-bold text-primary">🎉 You're funded — request payout</h3>
                              <p className="mt-1 text-sm text-muted-foreground">
                                80% of profits paid to your verified bank account, processed within 24hrs of approval. You can request once every 7 days, min 10% / max 50% of account size.
                              </p>
                              {!profile?.kyc_verified && (
                                <Alert variant="destructive" className="mt-3">
                                  <AlertDescription>Your bank account is awaiting admin verification before payouts are released.</AlertDescription>
                                </Alert>
                              )}
                              {profile?.kyc_verified && profile.bank_account_number && (
                                <div className="mt-4 rounded-md border border-border bg-background p-3 text-sm">
                                  <div className="text-[11px] text-muted-foreground">Payout destination</div>
                                  <div className="font-display mt-1 text-primary break-words">
                                    {profile.bank_account_number} · {profile.bank_name} · {profile.bank_account_name}
                                  </div>
                                </div>
                              )}
                              {ready ? (
                                <Button className="font-display mt-4" onClick={requestPayout} disabled={submitting || !profile?.kyc_verified}>
                                  {submitting ? "Submitting…" : "Request payout →"}
                                </Button>
                              ) : (
                                <p className="mt-4 text-xs text-muted-foreground">
                                  Request button unlocks when the countdown above hits zero.
                                </p>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </>
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

            <TabsContent value="certificates" className="mt-6 space-y-4">
              {certificates.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
                  <Trophy className="mx-auto h-10 w-10 text-muted-foreground"/>
                  <p className="font-display mt-3 text-base font-semibold">No certificates yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">Pass your evaluation or receive a payout to earn one.</p>
                </div>
              ) : (
                certificates.map((c) => <CertificateCard key={c.id} cert={c} />)
              )}
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
      <PWAInstallButton />
      <NewUserInstallPrompt />
    </div>
  );
}
