import { createFileRoute } from "@tanstack/react-router";
import { useAdminData } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { formatNaira, formatUSD } from "@/lib/utils";
import { Building, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { generatePayoutCertificate } from "@/components/certificates/certificateGenerator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_admin/admin/payouts")({
  component: PayoutsPage,
});

function BankDetails({ details }: { details: Record<string, string> | null }) {
  if (!details) return null;
  return (
    <div className="mt-2 rounded-lg border border-border bg-muted/30 p-3 text-sm">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Building className="h-3 w-3" /> Bank Details
      </div>
      <div className="space-y-0.5">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Bank</span>
          <span className="font-medium">{details.bank_name ?? "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Account Name</span>
          <span className="font-medium">{details.account_name ?? "—"}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">Account Number</span>
          <span className="flex items-center gap-1.5 font-mono font-bold text-foreground">
            {details.account_number ?? "—"}
            {details.account_number && (
              <button
                type="button"
                onClick={() => { navigator.clipboard.writeText(details.account_number); toast.success("Copied"); }}
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

function PayoutsPage() {
  const {
    payouts, updatePayout,
    payoutRejectTarget, payoutRejectReason, payoutRejecting,
    setPayoutRejectTarget, setPayoutRejectReason, openPayoutRejectDialog, submitPayoutReject,
  } = useAdminData();

  return (
    <div className="mt-6 space-y-3">
      <h2 className="font-display text-xl font-bold">Trader Payouts</h2>
      {payouts.length === 0 && (
        <p className="text-sm text-muted-foreground">No payout requests yet.</p>
      )}
      {payouts.map((p) => (
        <div key={p.id} className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="font-semibold">{p.profiles?.full_name ?? "—"}</div>
              <div className="text-xs text-muted-foreground">{p.trader_accounts?.mt5_login} · {p.payment_method} {p.trader_accounts?.currency === "USD" && <Badge variant="outline" className="ml-1 border-blue-400/40 text-blue-500 text-[10px]">USD</Badge>}</div>
              {p.payment_method === "usdt" && p.wallet_address && (
                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground/70 break-all">
                  <span className="font-mono">{p.wallet_address}</span>
                  <button
                    type="button"
                    onClick={() => { navigator.clipboard.writeText(p.wallet_address!); toast.success("Copied"); }}
                    className="text-muted-foreground hover:text-foreground shrink-0"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              )}
              {p.payment_method === "bank_transfer" && (
                <BankDetails details={p.bank_details as Record<string, string> | null} />
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="font-display font-bold text-primary">{formatNaira(p.amount_naira)}</div>
              <Badge variant="outline" className="font-display">{p.status.toUpperCase()}</Badge>
            </div>
            <div className="flex gap-2">
              {p.status === "pending" && <Button size="sm" onClick={() => updatePayout(p, "approved")}>Approve</Button>}
              {p.status === "approved" && <Button size="sm" onClick={() => updatePayout(p, "paid")}>Mark Paid</Button>}
              {(p.status === "paid" || p.status === "approved") && (
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => generatePayoutCertificate({ traderName: p.profiles?.full_name ?? "Trader", amount: p.amount_naira, date: new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }), method: p.payment_method === "usdt" ? "USDT" : "Bank Transfer", payoutId: p.id })}>
                  <Download className="h-4 w-4" />
                </Button>
              )}
              {p.status === "pending" && <Button size="sm" variant="outline" onClick={() => openPayoutRejectDialog(p)}>Reject</Button>}
            </div>
          </div>
        </div>
      ))}

      {/* Payout Reject dialog */}
      <Dialog open={!!payoutRejectTarget} onOpenChange={(o) => !payoutRejecting && !o && setPayoutRejectTarget(null)}>
        <DialogContent className="mx-4 w-[calc(100%-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Payout</DialogTitle>
            <DialogDescription>
              Rejecting payout for {payoutRejectTarget?.profiles?.full_name ?? "trader"} ({formatNaira(payoutRejectTarget?.amount_naira ?? 0)}).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="payout-reject-reason">Reason for breach</Label>
              <Textarea
                id="payout-reject-reason"
                placeholder="State the reason for breach..."
                value={payoutRejectReason}
                onChange={(e) => setPayoutRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setPayoutRejectTarget(null); setPayoutRejectReason(""); }} disabled={payoutRejecting}>Cancel</Button>
            <Button variant="destructive" onClick={submitPayoutReject} disabled={payoutRejecting || !payoutRejectReason.trim()}>{payoutRejecting ? "Rejecting…" : "Reject Payout"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
