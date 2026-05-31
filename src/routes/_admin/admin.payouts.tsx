import { createFileRoute } from "@tanstack/react-router";
import { useAdminData } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNaira } from "@/lib/utils";

export const Route = createFileRoute("/_admin/admin/payouts")({
  component: PayoutsPage,
});

function PayoutsPage() {
  const { payouts, updatePayout } = useAdminData();

  return (
    <div className="mt-6 space-y-3">
      <h2 className="font-display text-xl font-bold">Trader Payouts</h2>
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
            {p.status === "pending" && <Button size="sm" onClick={() => updatePayout(p, "approved")}>Approve</Button>}
            {p.status === "approved" && <Button size="sm" onClick={() => updatePayout(p, "paid")}>Mark Paid</Button>}
            {p.status === "pending" && <Button size="sm" variant="outline" onClick={() => updatePayout(p, "rejected")}>Reject</Button>}
          </div>
        </div>
      ))}
    </div>
  );
}
