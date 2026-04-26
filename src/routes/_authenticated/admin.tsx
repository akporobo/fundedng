import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/site/SiteNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNaira } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { verifyKycServer } from "@/server/kyc.functions";

export const Route = createFileRoute("/_authenticated/admin")({ component: AdminPage });

function AdminPage() {
  const { isAdmin, isLoading } = useAuth();
  if (isLoading) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <SiteNav />
        <div className="mx-auto max-w-xl px-4 py-16 text-center md:px-6">
          <h1 className="font-display text-3xl font-bold">Admins only</h1>
          <p className="mt-2 text-muted-foreground">You don't have admin access.</p>
        </div>
      </div>
    );
  }
  return <AdminConsole />;
}

function AdminConsole() {
  const [stats, setStats] = useState({
    traders: 0,
    accounts: 0,
    funded: 0,
    active: 0,
    passed: 0,
    breached: 0,
    pending: 0,
    revenue: 0,
    paid: 0,
    sold: 0,
    passRate: 0,
  });
  const [payouts, setPayouts] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [delivering, setDelivering] = useState(false);
  const [deliverFor, setDeliverFor] = useState<any | null>(null);
  const [form, setForm] = useState({ login: "", password: "", investor: "", server: "" });

  // ---- Challenges management ----
  const [challengeList, setChallengeList] = useState<any[]>([]);
  const [challengeEditOpen, setChallengeEditOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<any | null>(null);
  const blankChallenge = {
    id: "",
    name: "",
    account_size: 200000,
    price_naira: 12000,
    profit_target_percent: 10,
    max_drawdown_percent: 20,
    phases: 2,
    is_active: true,
  };
  const [challengeForm, setChallengeForm] = useState<any>(blankChallenge);
  const [savingChallenge, setSavingChallenge] = useState(false);

  const loadChallenges = async () => {
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .order("account_size");
    if (error) return console.error("[admin] challenges load failed:", error);
    setChallengeList((data ?? []) as any[]);
  };

  const openNewChallenge = () => {
    setEditingChallenge(null);
    setChallengeForm(blankChallenge);
    setChallengeEditOpen(true);
  };

  const openEditChallenge = (c: any) => {
    setEditingChallenge(c);
    setChallengeForm({ ...c });
    setChallengeEditOpen(true);
  };

  const saveChallenge = async () => {
    if (!challengeForm.name.trim()) return toast.error("Name is required");
    setSavingChallenge(true);
    const payload: any = {
      name: challengeForm.name.trim(),
      account_size: Number(challengeForm.account_size),
      price_naira: Number(challengeForm.price_naira),
      profit_target_percent: Number(challengeForm.profit_target_percent),
      max_drawdown_percent: Number(challengeForm.max_drawdown_percent),
      phases: Number(challengeForm.phases),
      is_active: !!challengeForm.is_active,
    };
    let error;
    if (editingChallenge?.id) {
      ({ error } = await supabase.from("challenges").update(payload).eq("id", editingChallenge.id));
    } else {
      ({ error } = await supabase.from("challenges").insert(payload));
    }
    setSavingChallenge(false);
    if (error) return toast.error(error.message);
    toast.success(editingChallenge?.id ? "Challenge updated" : "Challenge added");
    setChallengeEditOpen(false);
    loadChallenges();
  };

  const toggleChallengeActive = async (c: any) => {
    const { error } = await supabase.from("challenges").update({ is_active: !c.is_active }).eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success(c.is_active ? "Deactivated" : "Activated");
    loadChallenges();
  };

  const load = async () => {
    const [pr, ord, accRaw, poRaw, req] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("amount_paid,status,challenge_id"),
      supabase.from("trader_accounts").select("*").order("created_at", { ascending: false }),
      supabase.from("payouts").select("*").order("created_at", { ascending: false }),
      supabase.from("account_requests").select("*").in("status", ["pending", "failed"]).order("created_at", { ascending: false }),
    ]);
    if (accRaw.error) console.error("[admin] trader_accounts load failed:", accRaw.error);
    if (poRaw.error) console.error("[admin] payouts load failed:", poRaw.error);
    if (req.error) console.error("[admin] account_requests load failed:", req.error);

    const accRows = (accRaw.data ?? []) as any[];
    const poRows = (poRaw.data ?? []) as any[];
    const reqRows = (req.data ?? []) as any[];

    // Collect ids across all three lists, hydrate in one go.
    const userIds = Array.from(new Set([
      ...accRows.map((a) => a.user_id),
      ...poRows.map((p) => p.user_id),
      ...reqRows.map((r) => r.user_id),
    ]));
    const challengeIds = Array.from(new Set([
      ...accRows.map((a) => a.challenge_id),
      ...reqRows.map((r) => r.challenge_id),
      ...((ord.data ?? []) as any[]).map((o) => o.challenge_id),
    ]));
    const orderIds = Array.from(new Set(reqRows.map((r) => r.order_id)));
    const accountIds = poRows.map((p) => p.trader_account_id).filter(Boolean);

    const [profRes, chRes, ordRes, taRes] = await Promise.all([
      userIds.length
        ? supabase.from("profiles").select("id, full_name, bank_account_number, bank_name, bank_account_name, kyc_verified").in("id", userIds)
        : Promise.resolve({ data: [] as any[] }),
      challengeIds.length
        ? supabase.from("challenges").select("id, name, account_size").in("id", challengeIds)
        : Promise.resolve({ data: [] as any[] }),
      orderIds.length
        ? supabase.from("orders").select("id, status").in("id", orderIds)
        : Promise.resolve({ data: [] as any[] }),
      accountIds.length
        ? supabase.from("trader_accounts").select("id, mt5_login").in("id", accountIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);
    const profMap = new Map((profRes.data ?? []).map((p: any) => [p.id, p]));
    const chMap = new Map((chRes.data ?? []).map((c: any) => [c.id, c]));
    const ordMap = new Map((ordRes.data ?? []).map((o: any) => [o.id, o]));
    const taMap = new Map((taRes.data ?? []).map((t: any) => [t.id, t]));

    const accList = accRows.map((a) => ({
      ...a,
      profiles: profMap.get(a.user_id) ?? null,
      challenges: chMap.get(a.challenge_id) ?? null,
    }));
    const poList = poRows.map((p) => ({
      ...p,
      profiles: profMap.get(p.user_id) ?? null,
      trader_accounts: taMap.get(p.trader_account_id) ?? null,
    }));
    const hydrated = reqRows.map((r) => ({
      ...r,
      profiles: profMap.get(r.user_id) ?? null,
      challenges: chMap.get(r.challenge_id) ?? null,
      orders: ordMap.get(r.order_id) ?? null,
    }));

    setAccounts(accList);
    setPayouts(poList);
    setPendingRequests(hydrated);

    const ordersList = (ord.data ?? []) as any[];
    const soldOrders = ordersList.filter((o) => o.status === "paid" || o.status === "delivered");
    const soldCount = soldOrders.length;
    const soldValue = soldOrders.reduce(
      (s: number, o: any) => s + Number(chMap.get(o.challenge_id)?.account_size ?? 0),
      0,
    );
    const passedCount = accList.filter((a) => a.status === "passed" || a.status === "funded").length;
    const passRate = soldCount > 0 ? Math.round((passedCount / soldCount) * 100) : 0;

    setStats({
      traders: pr.count ?? 0,
      accounts: accList.length,
      sold: soldValue,
      funded: accList.filter((a) => a.status === "funded").length,
      active: accList.filter((a) => a.status === "active").length,
      passed: accList.filter((a) => a.status === "passed").length,
      breached: accList.filter((a) => a.status === "breached").length,
      pending: poList.filter((p) => p.status === "pending").length,
      revenue: ordersList
        .filter((o) => o.status === "paid" || o.status === "delivered")
        .reduce((s: number, o: any) => s + Number(o.amount_paid), 0) / 100,
      paid: poList.filter((p) => p.status === "paid").reduce((s: number, p: any) => s + Number(p.amount_naira), 0),
      passRate,
    });
  };

  useEffect(() => { load(); loadChallenges(); }, []);

  const openDeliver = (req: any) => {
    setDeliverFor(req);
    setForm({ login: "", password: "", investor: "", server: "" });
  };

  const submitDelivery = async () => {
    if (!deliverFor) return;
    if (!form.login.trim() || !form.password.trim() || !form.server.trim()) {
      toast.error("Login, password and server are required");
      return;
    }
    setDelivering(true);
    try {
      const res = await fetch("/api/deliver-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: deliverFor.order_id,
          mt5_login: form.login.trim(),
          mt5_password: form.password.trim(),
          investor_password: form.investor.trim() || undefined,
          mt5_server: form.server.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Delivery failed");
      toast.success(`Delivered: login ${json.login}`);
      setDeliverFor(null);
      load();
    } catch (e: any) {
      toast.error(e?.message ?? "Delivery failed");
    } finally {
      setDelivering(false);
    }
  };

  const updatePayout = async (id: string, status: "approved" | "paid" | "rejected") => {
    const { error } = await supabase.from("payouts").update({ status, processed_at: new Date().toISOString() }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Payout ${status}`);
    load();
  };

  const updateAccount = async (id: string, patch: Record<string, any>) => {
    const { error } = await supabase.from("trader_accounts").update(patch as never).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Account updated");
    load();
  };

  const verifyKyc = async (userId: string, expectedAccount: string) => {
    const entered = window.prompt(
      `Confirm the trader's account number to verify KYC.\nThe trader has submitted: ${expectedAccount}`,
      "",
    );
    if (!entered) return;
    try {
      await verifyKycServer({ data: { userId, accountNumber: entered.trim() } });
      toast.success("KYC verified");
      load();
    } catch (e: any) {
      toast.error(e?.message ?? "Verification failed");
    }
  };

  return (
    <div className="min-h-screen">
      <SiteNav />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <h1 className="font-display text-3xl font-bold">Admin Console</h1>
        <Tabs defaultValue="stats" className="mt-6">
          <div className="-mx-4 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
            <TabsList className="w-max min-w-full">
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="pending">
                Pending {pendingRequests.length > 0 && <span className="ml-1 rounded-full bg-warning/20 px-1.5 text-[10px] text-warning">{pendingRequests.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="stats" className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              ["Traders", stats.traders],
              ["Accounts Sold (Funded Value)", formatNaira(stats.sold), "text-primary"],
              ["Accounts Delivered", stats.accounts],
              ["Active", stats.active],
              ["Passed", stats.passed],
              ["Funded", stats.funded, "text-primary"],
              ["Breached", stats.breached],
              ["Pass Rate", `${stats.passRate}%`, "text-gold"],
              ["Pending Payouts", stats.pending, "text-warning"],
              ["Revenue", formatNaira(stats.revenue), "text-primary"],
              ["Payouts Paid", formatNaira(stats.paid), "text-destructive"],
            ].map(([l, v, c]: any) => (
              <div key={l} className="rounded-xl border border-border bg-card p-5">
                <div className="text-xs text-muted-foreground">{l}</div>
                <div className={`font-display mt-2 text-2xl font-bold ${c ?? ""}`}>{v}</div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="mt-6 space-y-3">
            {pendingRequests.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                No pending accounts. New paid orders will appear here for manual delivery.
              </div>
            ) : pendingRequests.map((r) => (
              <div key={r.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-semibold">{r.profiles?.full_name ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{r.challenges?.name} · {formatNaira(r.challenges?.account_size ?? 0)}</div>
                  </div>
                  <Badge variant="outline" className={`font-display ${r.status === "failed" ? "border-destructive/40 text-destructive" : "border-warning/40 text-warning"}`}>
                    {r.status.toUpperCase()}
                  </Badge>
                  <Button size="sm" onClick={() => openDeliver(r)}>
                    Deliver manually
                  </Button>
                </div>
                {r.failure_reason && (
                  <div className="mt-2 rounded-md border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">
                    {r.failure_reason}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="payouts" className="mt-6 space-y-3">
            {payouts.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-5">
                <div className="flex-1 min-w-[200px]">
                  <div className="font-semibold">{p.profiles?.full_name ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">{p.trader_accounts?.mt5_login} · {p.payment_method}</div>
                  {p.wallet_address && <div className="text-xs text-muted-foreground/70 break-all">{p.wallet_address}</div>}
                </div>
                <div className="font-display font-bold text-primary">{formatNaira(p.amount_naira)}</div>
                <Badge variant="outline" className="font-display">{p.status.toUpperCase()}</Badge>
                <div className="flex gap-2">
                  {p.status === "pending" && <Button size="sm" onClick={() => updatePayout(p.id, "approved")}>Approve</Button>}
                  {p.status === "approved" && <Button size="sm" onClick={() => updatePayout(p.id, "paid")}>Mark Paid</Button>}
                  {p.status === "pending" && <Button size="sm" variant="outline" onClick={() => updatePayout(p.id, "rejected")}>Reject</Button>}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="accounts" className="mt-6 space-y-2">
            {accounts.map((a) => (
              <div key={a.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[180px]">
                    <div className="font-semibold">{a.profiles?.full_name ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{a.challenges?.name} · login {a.mt5_login}</div>
                  </div>
                  <div className="text-sm">{formatNaira(a.starting_balance)}</div>
                  <div className="font-display text-sm text-gold">Phase {a.current_phase}</div>
                  <Badge variant="outline" className="font-display">{a.status.toUpperCase()}</Badge>
                  <div className="flex flex-wrap gap-1">
                    <Button size="sm" variant="outline" onClick={() => updateAccount(a.id, { status: "passed" })}>Pass</Button>
                    <Button size="sm" variant="outline" onClick={() => updateAccount(a.id, { status: "funded", funded_at: new Date().toISOString() })}>Fund</Button>
                    <Button size="sm" variant="outline" onClick={() => updateAccount(a.id, { status: "breached", breach_reason: "Manual" })}>Breach</Button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-md border border-border bg-background p-3 text-xs">
                  <div className="flex-1 min-w-[260px]">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">KYC bank account</div>
                    {a.profiles?.bank_account_number ? (
                      <div className="font-display mt-0.5">
                        <span className="font-mono text-primary">{a.profiles.bank_account_number}</span>
                        <span className="text-muted-foreground"> · </span>
                        <span>{a.profiles.bank_name}</span>
                        <span className="text-muted-foreground"> · </span>
                        <span>{a.profiles.bank_account_name}</span>
                      </div>
                    ) : (
                      <div className="mt-0.5 text-muted-foreground">Trader hasn't submitted bank details.</div>
                    )}
                  </div>
                  <Badge className={`font-display ${a.profiles?.kyc_verified ? "bg-primary/15 text-primary border-primary/30" : "bg-warning/15 text-warning border-warning/30"}`}>
                    {a.profiles?.kyc_verified ? "VERIFIED" : "PENDING"}
                  </Badge>
                  {!a.profiles?.kyc_verified && a.profiles?.bank_account_number && (
                    <Button size="sm" onClick={() => verifyKyc(a.user_id, a.profiles.bank_account_number)}>
                      Verify bank matches MT5
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="challenges" className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold">Challenges</h2>
                <p className="text-xs text-muted-foreground">Add, edit, activate or deactivate challenge tiers.</p>
              </div>
              <Button size="sm" onClick={openNewChallenge} className="font-display">+ Add Challenge</Button>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {challengeList.map((c) => (
                <div key={c.id} className="rounded-xl border border-border bg-card p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-display font-semibold">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{formatNaira(c.account_size)} account</div>
                    </div>
                    <Badge variant="outline" className={`font-display ${c.is_active ? "border-primary/40 text-primary" : "border-muted text-muted-foreground"}`}>
                      {c.is_active ? "ACTIVE" : "INACTIVE"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-muted-foreground">Fee:</span> <span className="font-display text-primary">{formatNaira(c.price_naira)}</span></div>
                    <div><span className="text-muted-foreground">Phases:</span> {c.phases}</div>
                    <div><span className="text-muted-foreground">Target:</span> {c.profit_target_percent}%</div>
                    <div><span className="text-muted-foreground">Drawdown:</span> {c.max_drawdown_percent}%</div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" variant="outline" onClick={() => openEditChallenge(c)}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => toggleChallengeActive(c)}>
                      {c.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </div>
              ))}
              {challengeList.length === 0 && (
                <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">No challenges yet.</div>
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-background/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Account Size</th>
                    <th className="px-4 py-3 text-left">Fee</th>
                    <th className="px-4 py-3 text-left">Target %</th>
                    <th className="px-4 py-3 text-left">Max DD %</th>
                    <th className="px-4 py-3 text-left">Phases</th>
                    <th className="px-4 py-3 text-left">Active</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {challengeList.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-display font-semibold">{c.name}</td>
                      <td className="px-4 py-3">{formatNaira(c.account_size)}</td>
                      <td className="px-4 py-3 font-display text-primary">{formatNaira(c.price_naira)}</td>
                      <td className="px-4 py-3">{c.profit_target_percent}%</td>
                      <td className="px-4 py-3">{c.max_drawdown_percent}%</td>
                      <td className="px-4 py-3">{c.phases}</td>
                      <td className="px-4 py-3">
                        <Switch checked={c.is_active} onCheckedChange={() => toggleChallengeActive(c)} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="outline" onClick={() => openEditChallenge(c)}>Edit</Button>
                      </td>
                    </tr>
                  ))}
                  {challengeList.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No challenges yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!deliverFor} onOpenChange={(o) => !o && setDeliverFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deliver MT5 account</DialogTitle>
            <DialogDescription>
              {deliverFor && (
                <>
                  Trader: <span className="font-medium">{deliverFor.profiles?.full_name ?? "—"}</span> ·{" "}
                  {deliverFor.challenges?.name} ({formatNaira(deliverFor.challenges?.account_size ?? 0)})
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="login">MT5 Login</Label>
              <Input id="login" value={form.login} onChange={(e) => setForm({ ...form, login: e.target.value })} placeholder="e.g. 12345678" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="server">Server</Label>
              <Input id="server" value={form.server} onChange={(e) => setForm({ ...form, server: e.target.value })} placeholder="e.g. ICMarketsSC-Demo" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Master password</Label>
              <Input id="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Trading password" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="investor">Investor password (optional)</Label>
              <Input id="investor" value={form.investor} onChange={(e) => setForm({ ...form, investor: e.target.value })} placeholder="Read-only password" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeliverFor(null)} disabled={delivering}>Cancel</Button>
            <Button onClick={submitDelivery} disabled={delivering}>
              {delivering ? "Delivering…" : "Deliver to trader"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={challengeEditOpen} onOpenChange={(o) => !savingChallenge && setChallengeEditOpen(o)}>
        <DialogContent className="mx-4 w-[calc(100%-2rem)] max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingChallenge?.id ? "Edit challenge" : "Add challenge"}</DialogTitle>
            <DialogDescription>Configure pricing and rules for this challenge tier.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="ch-name">Name</Label>
              <Input id="ch-name" value={challengeForm.name} onChange={(e) => setChallengeForm({ ...challengeForm, name: e.target.value })} placeholder="e.g. Starter" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="ch-size">Account Size (₦)</Label>
                <Input id="ch-size" type="number" min={0} value={challengeForm.account_size} onChange={(e) => setChallengeForm({ ...challengeForm, account_size: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="ch-fee">Fee (₦)</Label>
                <Input id="ch-fee" type="number" min={0} value={challengeForm.price_naira} onChange={(e) => setChallengeForm({ ...challengeForm, price_naira: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="ch-target">Profit Target %</Label>
                <Input id="ch-target" type="number" min={0} step="0.01" value={challengeForm.profit_target_percent} onChange={(e) => setChallengeForm({ ...challengeForm, profit_target_percent: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="ch-dd">Max Drawdown %</Label>
                <Input id="ch-dd" type="number" min={0} step="0.01" value={challengeForm.max_drawdown_percent} onChange={(e) => setChallengeForm({ ...challengeForm, max_drawdown_percent: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="ch-phases">Phases</Label>
                <Input id="ch-phases" type="number" min={1} max={5} value={challengeForm.phases} onChange={(e) => setChallengeForm({ ...challengeForm, phases: e.target.value })} />
              </div>
              <div className="flex items-end gap-2">
                <Checkbox id="ch-active" checked={!!challengeForm.is_active} onCheckedChange={(v) => setChallengeForm({ ...challengeForm, is_active: !!v })} />
                <Label htmlFor="ch-active" className="cursor-pointer">Active</Label>
              </div>
            </div>
            {Number(challengeForm.price_naira) > 0 && Number(challengeForm.account_size) > 0 && (
              <div className="rounded-md border border-border bg-background p-3 text-xs text-muted-foreground">
                Preview: <span className="font-display text-primary">{formatNaira(challengeForm.account_size)}</span> account for <span className="font-display text-primary">{formatNaira(challengeForm.price_naira)}</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChallengeEditOpen(false)} disabled={savingChallenge}>Cancel</Button>
            <Button onClick={saveChallenge} disabled={savingChallenge}>
              {savingChallenge ? "Saving…" : editingChallenge?.id ? "Save changes" : "Add challenge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
