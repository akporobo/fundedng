import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/site/SiteNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

  const load = async () => {
    const [pr, ord, acc, po] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("amount_paid,status"),
      supabase.from("trader_accounts").select("*, profiles(full_name,bank_account_number,bank_name,bank_account_name,kyc_verified), challenges(name)"),
      supabase.from("payouts").select("*, profiles(full_name), trader_accounts(mt5_login)").order("created_at", { ascending: false }),
    ]);
    const accList = (acc.data ?? []) as any[];
    const poList = (po.data ?? []) as any[];
    setAccounts(accList);
    setPayouts(poList);
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
    </div>
  );
}
