import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/site/SiteNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
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
        <div className="mx-auto max-w-xl px-6 py-16 text-center">
          <h1 className="font-display text-3xl font-bold">Admins only</h1>
          <p className="mt-2 text-muted-foreground">You don't have admin access. If you're setting up this platform for the first time, claim admin below.</p>
          <Link to="/setup-admin"><Button className="mt-6">Claim admin (one-time)</Button></Link>
        </div>
      </div>
    );
  }
  return <AdminConsole />;
}

function AdminConsole() {
  const [stats, setStats] = useState({ traders: 0, accounts: 0, active: 0, passed: 0, breached: 0, pending: 0, revenue: 0, paid: 0 });
  const [payouts, setPayouts] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [delivering, setDelivering] = useState(false);
  const [deliverFor, setDeliverFor] = useState<any | null>(null);
  const [form, setForm] = useState({ login: "", password: "", investor: "", server: "" });

  const load = async () => {
    const [pr, ord, acc, po, req] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("amount_paid,status"),
      supabase.from("trader_accounts").select("*, profiles(full_name,bank_account_number,bank_name,bank_account_name,kyc_verified), challenges(name)"),
      supabase.from("payouts").select("*, profiles(full_name), trader_accounts(mt5_login)").order("created_at", { ascending: false }),
      supabase.from("account_requests")
        .select("*, profiles:user_id(full_name), challenges(name, account_size), orders(status)")
        .in("status", ["pending", "failed"])
        .order("created_at", { ascending: false }),
    ]);
    const accList = (acc.data ?? []) as any[];
    const poList = (po.data ?? []) as any[];
    setAccounts(accList);
    setPayouts(poList);
    setPendingRequests((req.data ?? []) as any[]);
    setStats({
      traders: pr.count ?? 0,
      accounts: accList.length,
      active: accList.filter((a) => a.status === "active").length,
      passed: accList.filter((a) => a.status === "passed").length,
      breached: accList.filter((a) => a.status === "breached").length,
      pending: poList.filter((p) => p.status === "pending").length,
      revenue: (ord.data ?? []).reduce((s: number, o: any) => s + Number(o.amount_paid), 0) / 100,
      paid: poList.filter((p) => p.status === "paid").reduce((s: number, p: any) => s + Number(p.amount_naira), 0),
    });
  };

  useEffect(() => { load(); }, []);

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
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="font-display text-3xl font-bold">Admin Console</h1>
        <Tabs defaultValue="stats" className="mt-6">
          <TabsList>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="pending">
              Pending {pendingRequests.length > 0 && <span className="ml-1 rounded-full bg-warning/20 px-1.5 text-[10px] text-warning">{pendingRequests.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              ["Traders", stats.traders],
              ["Accounts Sold", stats.accounts],
              ["Active", stats.active],
              ["Passed", stats.passed],
              ["Breached", stats.breached],
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
    </div>
  );
}
