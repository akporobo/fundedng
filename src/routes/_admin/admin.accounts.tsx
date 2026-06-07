import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAdminData } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNaira } from "@/lib/utils";
import { Eye } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_admin/admin/accounts")({
  component: AccountsPage,
});

function AccountsPage() {
  const {
    accounts, equityDraft, equitySaving, setEquityDraft, submitEquity,
    kycTarget, kycVerifying, setKycTarget, openKycVerify, submitKycVerify,
    breachTarget, breachReason, breaching, setBreachTarget, setBreachReason, openBreachDialog, submitBreach,
    warnTarget, warnReason, warning, setWarnTarget, setWarnReason, openWarningDialog, submitWarning,
    rejectTarget, rejectReason, rejecting, rejectType, setRejectTarget, setRejectReason, setRejectType,
    openRejectDialog, submitRejectPhase, approvePhase2, approveFunded, viewCredsFor, setViewCredsFor, updateAccount,
  } = useAdminData();
  const [credDraft, setCredDraft] = useState<Record<string, Record<string, string>>>({});
  const [credSaving, setCredSaving] = useState<string | null>(null);

  return (
    <div className="mt-6 space-y-2">
      <h2 className="font-display text-xl font-bold">Trader Accounts</h2>
      {accounts.map((a) => (
        <div key={a.id}>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[180px]">
                <div className="font-semibold">{a.profiles?.full_name ?? "—"}</div>
                <div className="text-xs text-muted-foreground">{a.challenges?.name} · login {a.mt5_login}</div>
              </div>
              <div className="text-sm">{formatNaira(a.starting_balance)}</div>
              <div className="font-display text-sm text-gold">Phase {a.current_phase}</div>
              <Badge variant="outline" className="font-display">{a.status.toUpperCase()}</Badge>
            </div>
            {(() => {
              const eq = Number(a.current_equity ?? a.starting_balance);
              const st = Number(a.starting_balance);
              const pk = Number(a.peak_equity ?? a.starting_balance);
              const profitPct = st > 0 ? ((eq - st) / st) * 100 : 0;
              const ddPct = pk > 0 ? Math.max(0, ((pk - eq) / pk) * 100) : 0;
              const maxDD = Number(a.challenges?.max_drawdown_percent ?? 20);
              const ddColor = ddPct / maxDD > 0.75 ? "text-red-500" : ddPct / maxDD > 0.5 ? "text-amber-500" : "text-green-500";
              return (
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span className="text-muted-foreground">Equity: <span className="font-display text-primary">{formatNaira(eq)}</span></span>
                  <span className="text-muted-foreground">P/L: <span className={`font-display ${profitPct >= 0 ? "text-green-500" : "text-red-500"}`}>{profitPct >= 0 ? "+" : ""}{profitPct.toFixed(2)}%</span></span>
                  <span className="text-muted-foreground">Drawdown: <span className={`font-display ${ddColor}`}>{ddPct.toFixed(2)}%</span><span className="text-muted-foreground/60"> / {maxDD}%</span></span>
                  <span className="text-muted-foreground">Peak: <span className="font-display">{formatNaira(pk)}</span></span>
                  <span className="text-muted-foreground">DD Limit: <span className="font-display text-red-500">{formatNaira(Math.floor(pk * (1 - maxDD / 100)))}</span></span>
                  <span className="text-muted-foreground">Days traded: <span className="font-display">{a.trading_days ?? 0}</span></span>
                  {a.last_synced_at && <span className="text-muted-foreground/60">Synced: {new Date(a.last_synced_at).toLocaleString()}</span>}
                </div>
              );
            })()}
            <div className="mt-2 flex flex-wrap gap-1">
              {(() => {
                if (a.current_phase >= 2 || a.status !== "active") return null;
                const target = Number(a.challenges?.profit_target_percent ?? 10);
                const equity = Number(a.current_equity ?? a.starting_balance);
                const required = Number(a.starting_balance) * (1 + target / 100);
                const hit = equity >= required;
                const requested = !!a.phase2_requested_at;
                return (<>{requested && (<><Badge variant="outline" className="font-display border-warning/40 text-warning">PHASE 2 REQUESTED</Badge><Button size="sm" variant="destructive" onClick={() => openRejectDialog(a, "phase2")}>Reject</Button></>)}{hit ? <Button size="sm" onClick={() => approvePhase2(a)}>Phase 1 passed → Approve Phase 2</Button> : <span className="text-[11px] text-muted-foreground">Needs {formatNaira(Math.ceil(required))} equity ({target}% target)</span>}</>);
              })()}
              {a.current_phase >= 2 && a.status === "active" && (() => {
                const target = Number(a.challenges?.profit_target_percent ?? 10);
                const equity = Number(a.current_equity ?? a.starting_balance);
                const required = Number(a.starting_balance) * (1 + target / 100);
                const hit = equity >= required;
                const requested = !!a.funded_requested_at;
                return (<>{requested && (<><Badge variant="outline" className="font-display border-warning/40 text-warning">FUNDED REQUESTED</Badge><Button size="sm" variant="destructive" onClick={() => openRejectDialog(a, "funded")}>Reject</Button></>)}{hit ? <Button size="sm" onClick={() => approveFunded(a)}>Phase 2 passed → Approve Funded</Button> : <span className="text-[11px] text-muted-foreground">Needs {formatNaira(Math.ceil(required))} equity ({target}% target)</span>}</>);
              })()}
              <Button size="sm" variant="outline" onClick={() => openWarningDialog(a)}>Warning</Button>
              <Button size="sm" variant="outline" onClick={() => openBreachDialog(a)}>Breach</Button>
              <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => { setViewCredsFor(a); setCredDraft((d) => ({ ...d, [a.id]: { mt5_login: a.mt5_login ?? "", mt5_server: a.mt5_server ?? "", mt5_password: a.mt5_password ?? "", investor_password: a.investor_password ?? "" } })); }}>
                <Eye className="mr-1 h-3.5 w-3.5" />Credentials
              </Button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-end gap-2 rounded-md border border-border bg-background p-3">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor={`eq-${a.id}`} className="text-[10px] uppercase tracking-wide text-muted-foreground">Update equity</Label>
              <Input id={`eq-${a.id}`} type="number" inputMode="decimal" placeholder={`Current: ${a.current_equity ?? a.starting_balance}`}
                value={equityDraft[a.id] ?? ""} onChange={(e) => setEquityDraft((d) => ({ ...d, [a.id]: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") submitEquity(a); }} className="mt-1 h-9" />
            </div>
            <Button size="sm" onClick={() => submitEquity(a)}>Save</Button>
          </div>
          {a.profiles && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-background p-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">KYC:</span>
                <Badge variant="outline" className={`font-display text-[10px] ${a.profiles.kyc_verified ? "border-green-500/50 text-green-500" : "border-amber-500/50 text-amber-500"}`}>{a.profiles?.kyc_verified ? "VERIFIED" : "PENDING"}</Badge>
                {!a.profiles?.kyc_verified && a.profiles?.bank_account_number && <Button size="sm" onClick={() => openKycVerify(a)}>Verify bank matches MT5</Button>}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Edit credentials dialog */}
      <Dialog open={!!viewCredsFor} onOpenChange={(o) => { if (!o) { setViewCredsFor(null); setCredDraft({}); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>MT5 Credentials</DialogTitle>
            <DialogDescription>Edit the MT5 login, server, and passwords below.</DialogDescription>
          </DialogHeader>
          {viewCredsFor && (
            <div className="grid gap-3">
              <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">Login</Label>
                <Input value={credDraft[viewCredsFor.id]?.mt5_login ?? ""} onChange={(e) => setCredDraft((d) => ({ ...d, [viewCredsFor.id]: { ...d[viewCredsFor.id], mt5_login: e.target.value } }))} className="h-9 font-mono text-sm" />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">Server</Label>
                <Input value={credDraft[viewCredsFor.id]?.mt5_server ?? ""} onChange={(e) => setCredDraft((d) => ({ ...d, [viewCredsFor.id]: { ...d[viewCredsFor.id], mt5_server: e.target.value } }))} className="h-9 font-mono text-sm" />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">Master Password</Label>
                <Input value={credDraft[viewCredsFor.id]?.mt5_password ?? ""} onChange={(e) => setCredDraft((d) => ({ ...d, [viewCredsFor.id]: { ...d[viewCredsFor.id], mt5_password: e.target.value } }))} className="h-9 font-mono text-sm" />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">Investor Password</Label>
                <Input value={credDraft[viewCredsFor.id]?.investor_password ?? ""} onChange={(e) => setCredDraft((d) => ({ ...d, [viewCredsFor.id]: { ...d[viewCredsFor.id], investor_password: e.target.value } }))} className="h-9 font-mono text-sm" />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setViewCredsFor(null); setCredDraft({}); }}>Cancel</Button>
            <Button onClick={async () => {
              if (!viewCredsFor) return;
              const draft = credDraft[viewCredsFor.id];
              if (!draft) return;
              setCredSaving(viewCredsFor.id);
              await updateAccount(viewCredsFor.id, { mt5_login: draft.mt5_login, mt5_server: draft.mt5_server, mt5_password: draft.mt5_password, investor_password: draft.investor_password || null });
              setCredSaving(null);
              setViewCredsFor(null);
              setCredDraft({});
            }} disabled={credSaving === viewCredsFor?.id}>{credSaving === viewCredsFor?.id ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* KYC dialog */}
      <Dialog open={!!kycTarget} onOpenChange={(o) => !o && !kycVerifying && setKycTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify trader KYC</DialogTitle>
            <DialogDescription>Confirm the bank details below match what the trader sent for KYC.</DialogDescription>
          </DialogHeader>
          {kycTarget && (
            <div className="grid gap-3 rounded-lg border border-border bg-muted/30 p-4 text-sm">
              <div><div className="text-[10px] uppercase tracking-wide text-muted-foreground">Trader</div><div className="font-display font-semibold">{kycTarget.profiles?.full_name ?? "—"}</div></div>
              <div><div className="text-[10px] uppercase tracking-wide text-muted-foreground">Account number</div><div className="font-mono text-base text-primary">{kycTarget.profiles?.bank_account_number ?? "—"}</div></div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div><div className="text-[10px] uppercase tracking-wide text-muted-foreground">Bank</div><div>{kycTarget.profiles?.bank_name ?? "—"}</div></div>
                <div><div className="text-[10px] uppercase tracking-wide text-muted-foreground">Account name</div><div>{kycTarget.profiles?.bank_account_name ?? "—"}</div></div>
              </div>
              <div className="text-xs text-muted-foreground">MT5 login: <span className="font-mono">{kycTarget.mt5_login}</span></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setKycTarget(null)} disabled={kycVerifying}>Cancel</Button>
            <Button onClick={submitKycVerify} disabled={kycVerifying}>{kycVerifying ? "Verifying…" : "Verify KYC"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Breach dialog */}
      <Dialog open={!!breachTarget} onOpenChange={(o) => !breaching && !o && setBreachTarget(null)}>
        <DialogContent className="mx-4 w-[calc(100%-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>Breach Account</DialogTitle>
            <DialogDescription>Breaching account for {breachTarget?.profiles?.full_name ?? "trader"} ({breachTarget?.mt5_login}).</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="breach-reason">Reason for breach</Label>
              <Textarea id="breach-reason" placeholder="Enter the reason for breaching this account..." value={breachReason} onChange={(e) => setBreachReason(e.target.value)} rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setBreachTarget(null); setBreachReason(""); }} disabled={breaching}>Cancel</Button>
            <Button variant="destructive" onClick={submitBreach} disabled={breaching || !breachReason.trim()}>{breaching ? "Breaching…" : "Breach Account"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Warning dialog */}
      <Dialog open={!!warnTarget} onOpenChange={(o) => !warning && !o && setWarnTarget(null)}>
        <DialogContent className="mx-4 w-[calc(100%-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>Send Warning</DialogTitle>
            <DialogDescription>Send a warning to {warnTarget?.profiles?.full_name ?? "trader"} ({warnTarget?.mt5_login}).</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="warn-reason">Warning message</Label>
              <Textarea id="warn-reason" placeholder="Describe the concerning trading activity..." value={warnReason} onChange={(e) => setWarnReason(e.target.value)} rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setWarnTarget(null); setWarnReason(""); }} disabled={warning}>Cancel</Button>
            <Button variant="default" onClick={submitWarning} disabled={warning || !warnReason.trim()}>{warning ? "Sending…" : "Send Warning"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject dialog */}
      <Dialog open={!!rejectTarget} onOpenChange={(o) => !rejecting && !o && setRejectTarget(null)}>
        <DialogContent className="mx-4 w-[calc(100%-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>Reject {rejectType === "phase2" ? "Phase 2" : "Funded"} Request</DialogTitle>
            <DialogDescription>Rejecting request for {rejectTarget?.profiles?.full_name ?? "trader"} ({rejectTarget?.mt5_login}).</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="reject-reason">Reason for rejection</Label>
              <Textarea id="reject-reason" placeholder="Enter the reason for rejecting this request..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectTarget(null); setRejectReason(""); setRejectType(null); }} disabled={rejecting}>Cancel</Button>
            <Button variant="destructive" onClick={submitRejectPhase} disabled={rejecting || !rejectReason.trim()}>{rejecting ? "Rejecting…" : "Reject Request"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
