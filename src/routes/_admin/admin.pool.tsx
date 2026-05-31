import { createFileRoute } from "@tanstack/react-router";
import { useAdminData } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNaira } from "@/lib/utils";
import { Plus, AlertTriangle, Eye, Archive } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/_admin/admin/pool")({
  component: PoolPage,
});

function PoolPage() {
  const {
    poolAccounts, poolInventory, poolLoading, poolFormOpen, poolSaving, poolForm, viewCredsFor, challengeList,
    setPoolFormOpen, setPoolForm, setViewCredsFor, loadPool,
  } = useAdminData();

  return (
    <div className="mt-6 space-y-4">
      <h2 className="font-display text-xl font-bold">Account Pool</h2>

      {/* Low stock warning */}
      {(() => {
        const low = Object.entries(poolInventory).filter(([, count]) => count < 3);
        if (low.length === 0) return null;
        return (
          <Alert variant="default" className="border-warning/40 bg-warning/5">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning-foreground text-sm">
              <span className="font-display font-semibold">Low Stock:</span> {low.map(([size, count]) => `${formatNaira(Number(size))} (${count})`).join(", ")}
            </AlertDescription>
          </Alert>
        );
      })()}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-xl font-bold">Inventory</h3>
        <Button size="sm" onClick={() => setPoolFormOpen(true)} className="font-display"><Plus className="mr-1 h-4 w-4" /> Add Account</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {challengeList.filter((c: any) => c.is_active).map((c: any) => {
          const available = poolInventory[String(c.account_size)] ?? 0;
          const color = available >= 3 ? "text-green-500" : available >= 1 ? "text-amber-500" : "text-red-500";
          return (
            <div key={c.id} className="rounded-xl border border-border bg-card p-4">
              <div className="text-xs text-muted-foreground">{c.name}</div>
              <div className={`font-display mt-1 text-2xl font-bold ${color}`}>{available}</div>
              <div className="text-[11px] text-muted-foreground">{formatNaira(c.account_size)}</div>
            </div>
          );
        })}
      </div>

      {/* Pool accounts table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MT5 Login</TableHead><TableHead>Account Size</TableHead><TableHead>Server</TableHead>
                <TableHead>Status</TableHead><TableHead>Created</TableHead><TableHead>Assigned</TableHead>
                <TableHead>Order</TableHead><TableHead>Notes</TableHead><TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {poolAccounts.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-8">{poolLoading ? "Loading…" : "No accounts in pool."}</TableCell></TableRow>
              )}
              {poolAccounts.map((a: any) => {
                const statusColor: Record<string, string> = { available: "text-green-500 border-green-500/40", assigned: "text-blue-500 border-blue-500/40", archived: "text-muted-foreground border-muted", flagged: "text-red-500 border-red-500/40" };
                return (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs">{a.mt5_login}</TableCell>
                    <TableCell>{formatNaira(a.account_size_ngn)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{a.mt5_server}</TableCell>
                    <TableCell><Badge variant="outline" className={`font-display ${statusColor[a.status] ?? ""}`}>{a.status.toUpperCase()}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{a.assigned_at ? new Date(a.assigned_at).toLocaleDateString() : "—"}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{a.assigned_order_id ? a.assigned_order_id.slice(0, 8) + "…" : "—"}</TableCell>
                    <TableCell className="max-w-[120px] truncate text-xs text-muted-foreground" title={a.notes ?? ""}>{a.notes ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground hover:text-foreground" onClick={() => setViewCredsFor(a)}><Eye className="h-3.5 w-3.5" /></Button>
                        {a.status === "available" && (
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground hover:text-destructive" onClick={async () => {
                            const { data: { session } } = await supabase.auth.getSession();
                            if (!session?.access_token) return;
                            const res = await fetch("/api/admin/pool", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ action: "archive", id: a.id }) });
                            const json = await res.json();
                            if (json.ok) { toast.success("Account archived"); loadPool(); } else { toast.error(json.error ?? "Failed to archive"); }
                          }}><Archive className="h-3.5 w-3.5" /></Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View credentials dialog */}
      <Dialog open={!!viewCredsFor} onOpenChange={(o) => !o && setViewCredsFor(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>MT5 Credentials</DialogTitle>
            <DialogDescription>Login: <span className="font-mono font-medium text-foreground">{viewCredsFor?.mt5_login}</span></DialogDescription>
          </DialogHeader>
          {viewCredsFor && (
            <div className="grid gap-3">
              <div className="grid gap-1"><Label className="text-xs text-muted-foreground">Server</Label><div className="rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm">{viewCredsFor.mt5_server}</div></div>
              <div className="grid gap-1"><Label className="text-xs text-muted-foreground">Master Password</Label><div className="rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm">{viewCredsFor.mt5_password}</div></div>
              <div className="grid gap-1"><Label className="text-xs text-muted-foreground">Investor Password</Label><div className="rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm">{viewCredsFor.investor_password}</div></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewCredsFor(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add account to pool dialog */}
      <Dialog open={poolFormOpen} onOpenChange={(o) => !poolSaving && !o && setPoolFormOpen(false)}>
        <DialogContent className="mx-4 w-[calc(100%-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>Add account to pool</DialogTitle>
            <DialogDescription>Enter the MT5 credentials for a demo account created in the broker terminal.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5"><Label htmlFor="pool-login">MT5 Login *</Label><Input id="pool-login" value={poolForm.mt5_login} onChange={(e) => setPoolForm({ ...poolForm, mt5_login: e.target.value })} placeholder="e.g. 12345678" /></div>
            <div className="grid gap-1.5"><Label htmlFor="pool-password">Master password *</Label><Input id="pool-password" value={poolForm.mt5_password} onChange={(e) => setPoolForm({ ...poolForm, mt5_password: e.target.value })} placeholder="Trading password" /></div>
            <div className="grid gap-1.5"><Label htmlFor="pool-investor">Investor password *</Label><Input id="pool-investor" value={poolForm.investor_password} onChange={(e) => setPoolForm({ ...poolForm, investor_password: e.target.value })} placeholder="Read-only password for VPS monitoring" /></div>
            <div className="grid gap-1.5"><Label htmlFor="pool-server">MT5 Server</Label><Input id="pool-server" value={poolForm.mt5_server} onChange={(e) => setPoolForm({ ...poolForm, mt5_server: e.target.value })} placeholder="Exness-MT5Trial9" /></div>
            <div className="grid gap-1.5">
              <Label htmlFor="pool-size">Account Size *</Label>
              <Select value={poolForm.account_size_ngn} onValueChange={(v) => setPoolForm({ ...poolForm, account_size_ngn: v })}>
                <SelectTrigger id="pool-size"><SelectValue placeholder="Select account size" /></SelectTrigger>
                <SelectContent>
                  {challengeList.filter((c: any) => c.is_active).map((c: any) => (
                    <SelectItem key={c.id} value={String(c.account_size)}>{c.name} — {formatNaira(c.account_size)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5"><Label htmlFor="pool-notes">Notes</Label><Input id="pool-notes" value={poolForm.notes} onChange={(e) => setPoolForm({ ...poolForm, notes: e.target.value })} placeholder="Optional admin notes" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setPoolFormOpen(false); }} disabled={poolSaving}>Cancel</Button>
            <Button onClick={async () => {
              if (!poolForm.mt5_login.trim() || !poolForm.mt5_password.trim() || !poolForm.investor_password.trim() || !poolForm.account_size_ngn) { toast.error("Login, password, investor password, and account size are required"); return; }
              setPoolSaving(true);
              try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.access_token) return;
                const res = await fetch("/api/admin/pool", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ action: "add", mt5_login: poolForm.mt5_login.trim(), mt5_password: poolForm.mt5_password.trim(), investor_password: poolForm.investor_password.trim(), mt5_server: poolForm.mt5_server.trim() || "Exness-MT5Trial9", account_size_ngn: Number(poolForm.account_size_ngn), notes: poolForm.notes.trim() || null }) });
                const json = await res.json();
                if (json.ok) { toast.success("Account added to pool"); setPoolForm({ mt5_login: "", mt5_password: "", investor_password: "", mt5_server: "Exness-MT5Trial9", account_size_ngn: "", notes: "" }); setPoolFormOpen(false); loadPool(); }
                else { toast.error(json.error ?? "Failed to add account"); }
              } catch (e: any) { toast.error(e?.message ?? "Failed"); } finally { setPoolSaving(false); }
            }} disabled={poolSaving}>{poolSaving ? "Adding…" : "Add to Pool"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
