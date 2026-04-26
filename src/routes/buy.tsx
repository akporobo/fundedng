import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteNav } from "@/components/site/SiteNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatNaira } from "@/lib/utils";
import { Check, Diamond, ArrowRight, ShieldCheck, Zap, Wallet, Clock, Layers } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/buy")({
  validateSearch: z.object({ challenge: z.string().optional() }),
  component: BuyPage,
});

interface Challenge {
  id: string; name: string; account_size: number; price_naira: number;
  profit_target_percent: number; max_drawdown_percent: number; phases: number;
}

function BuyPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selected, setSelected] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    supabase.from("challenges").select("*").eq("is_active", true).order("account_size")
      .then(({ data }) => {
        const list = (data as Challenge[]) ?? [];
        setChallenges(list);
        if (search.challenge) {
          const found = list.find((c) => c.id === search.challenge);
          if (found) setSelected(found);
        }
      });
  }, [search.challenge]);

  const openConfirm = () => {
    if (!selected) return setError("Select a challenge first");
    if (!isAuthenticated) {
      navigate({ to: "/auth/register" });
      return;
    }
    setError("");
    setConfirmOpen(true);
  };

  const handleBuy = async () => {
    if (!selected) return;
    if (!user?.email) {
      setError("You need to be signed in with an email.");
      return;
    }
    const PaystackPop = (window as unknown as { PaystackPop?: { setup: (opts: Record<string, unknown>) => { openIframe: () => void } } }).PaystackPop;
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined;
    if (!PaystackPop) {
      setError("Payment system is still loading. Please try again in a moment.");
      return;
    }
    if (!publicKey) {
      setError("Payment is not configured yet. Set VITE_PAYSTACK_PUBLIC_KEY in your environment.");
      return;
    }

    setLoading(true); setError("");

    const handler = PaystackPop.setup({
      key: publicKey,
      email: user.email,
      amount: selected.price_naira * 100, // amount in kobo
      currency: "NGN",
      ref: `FNG-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      metadata: {
        challenge_id: selected.id,
        challenge_name: selected.name,
        user_id: user.id,
      },
      onSuccess: async (transaction: { reference: string }) => {
        // Persist the order using the verified Paystack reference.
        const { data: order, error: orderErr } = await supabase.from("orders").insert({
          user_id: user.id,
          challenge_id: selected.id,
          amount_paid: selected.price_naira * 100,
          status: "paid",
          paystack_reference: transaction.reference,
        }).select().single();

        if (orderErr || !order) {
          setLoading(false);
          setError(orderErr?.message ?? "Order creation failed");
          return;
        }

        toast.success("Payment confirmed! Provisioning your MT5 account…");

        // Fire-and-forget provision; admin can deliver manually if it fails.
        fetch("/api/provision-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: order.id }),
          keepalive: true,
        }).catch(() => {});

        await new Promise((r) => setTimeout(r, 250));
        navigate({ to: "/dashboard" });
        setLoading(false);
        setConfirmOpen(false);
      },
      onCancel: () => {
        setLoading(false);
        toast.info("Payment cancelled.");
      },
    });

    handler.openIframe();
  };

  return (
    <div className="min-h-screen">
      <SiteNav />
      <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <div className="text-center">
          <Badge variant="outline" className="font-display border-primary/40 text-primary">SELECT YOUR CHALLENGE</Badge>
          <h1 className="font-display mt-4 text-4xl font-bold">Get Funded Today</h1>
          <p className="mt-2 text-muted-foreground">Choose your account size. Pass 2 phases. Withdraw your profits.</p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {challenges.map((c, i) => {
            const active = selected?.id === c.id;
            return (
              <button key={c.id} onClick={() => setSelected(c)}
                className={`relative rounded-xl border bg-card p-7 text-left transition-all ${
                  active ? "border-primary glow-primary -translate-y-1" : "border-border hover:border-primary/40"
                }`}>
                {i===1 && (
                  <div className="font-display absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-wider text-primary-foreground">
                    POPULAR
                  </div>
                )}
                {active && (
                  <div className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-primary">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div className="font-display text-xs tracking-[0.2em] text-muted-foreground">{c.name.toUpperCase()}</div>
                <div className="font-display mt-2 text-3xl font-bold text-primary">{formatNaira(c.account_size)}</div>
                <div className="text-xs text-muted-foreground">account size</div>
                <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
                  {[`${c.profit_target_percent}% profit target`,`${c.max_drawdown_percent}% max drawdown`,`${c.phases} phases to funded`,"80% profit split","Payouts within 7 days"].map(f=>(
                    <div key={f} className="flex items-center gap-2"><Diamond className="h-3 w-3 text-primary"/> {f}</div>
                  ))}
                </div>
                <div className="mt-5 text-2xl font-bold">{formatNaira(c.price_naira)}</div>
                <div className="text-xs text-muted-foreground">one-time fee</div>
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="mx-auto mt-10 max-w-md rounded-xl border border-primary/30 bg-card p-7 animate-fade-in">
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Challenge</span><span className="font-medium">{selected.name} — {formatNaira(selected.account_size)}</span></div>
              <div className="flex justify-between border-t border-border pt-3">
                <span className="text-muted-foreground">Total</span>
                <span className="font-display text-xl font-bold text-primary">{formatNaira(selected.price_naira)}</span>
              </div>
            </div>
            {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
            <Button className="font-display mt-5 w-full" size="lg" onClick={openConfirm} disabled={loading}>
              {loading ? "Processing..." : <>Pay {formatNaira(selected.price_naira)} Now <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {isAuthenticated
                ? "Demo checkout — your MT5 account will be delivered instantly."
                : <>You'll need to <Link to="/auth/register" className="text-primary hover:underline">create an account</Link> first.</>}
            </p>
          </div>
        )}
      </div>

      <Dialog open={confirmOpen} onOpenChange={(o) => !loading && setConfirmOpen(o)}>
        <DialogContent className="mx-4 w-[calc(100%-2rem)] max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{selected.name}</DialogTitle>
                <DialogDescription>
                  <span className="font-display block text-3xl font-bold text-primary">
                    {formatNaira(selected.account_size)}
                  </span>
                  <span className="text-xs text-muted-foreground">account size</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 rounded-lg border border-border bg-background/50 p-4 text-sm">
                {[
                  { icon: ShieldCheck, label: "Profit target / phase", value: `${selected.profit_target_percent}%` },
                  { icon: Zap, label: "Max drawdown", value: `${selected.max_drawdown_percent}%` },
                  { icon: Layers, label: "Phases to funded", value: `${selected.phases}` },
                  { icon: Wallet, label: "Profit split", value: "80%" },
                  { icon: Clock, label: "Payout window", value: "Within 7 days" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <r.icon className="h-4 w-4 text-primary" /> {r.label}
                    </span>
                    <span className="font-display font-semibold">{r.value}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-xs text-muted-foreground">
                <span className="font-display block font-semibold text-warning">Rules reminder</span>
                No automated trading. No copy trading. Trade at least once every 7 days.
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">Total due</span>
                <span className="font-display text-2xl font-bold text-primary">
                  {formatNaira(selected.price_naira)}
                </span>
              </div>

              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

              <DialogFooter className="gap-2 sm:gap-2">
                <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button className="font-display" onClick={handleBuy} disabled={loading}>
                  {loading ? "Processing…" : <>Confirm & Pay {formatNaira(selected.price_naira)} <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
