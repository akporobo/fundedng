import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatNaira } from "@/lib/utils";
import { Check, Diamond, ArrowRight, ShieldCheck, Zap, Wallet, Clock, Layers, Download, Smartphone, Share, Plus as PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { useInstallPrompt } from "@/components/PWAInstallButton";
import { Brand } from "@/components/site/Brand";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { NotificationBell } from "@/components/site/NotificationBell";
import { AppSidebar, MobileBottomNav } from "@/components/site/AppShell";

export const Route = createFileRoute("/buy")({
  validateSearch: z.object({ challenge: z.string().optional() }),
  component: BuyPage,
});

interface Challenge {
  id: string; name: string; account_size: number; price_naira: number;
  profit_target_percent: number; max_drawdown_percent: number; phases: number;
}

function BuyPage() {
  const { isAuthenticated, user, session } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { available: installAvailable, install: installPwa, isIOS, isStandalone } = useInstallPrompt();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selected, setSelected] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [postPurchaseOpen, setPostPurchaseOpen] = useState(false);

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
    setAgreed(false);
    setConfirmOpen(true);
  };

  const handleBuy = async () => {
    if (!selected) return;
    if (!user?.email) {
      setError("You need to be signed in with an email.");
      return;
    }
    const PaystackPop = (window as unknown as { PaystackPop?: { setup: (opts: Record<string, unknown>) => { openIframe: () => void } } }).PaystackPop;
    const publicKey = PAYSTACK_PUBLIC_KEY;
    if (!PaystackPop) {
      setError("Payment system is still loading. Please try again in a moment.");
      return;
    }
    if (!publicKey) {
      setError("Payment is not configured yet.");
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
        // Verify payment SERVER-SIDE before trusting `onSuccess`.
        // The browser cannot prove a payment really happened — Paystack must.
        if (!session?.access_token) {
          setLoading(false);
          setError("Your session expired. Please sign in again.");
          return;
        }
        try {
          const res = await fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              reference: transaction.reference,
              challenge_id: selected.id,
            }),
          });
          const result = (await res.json().catch(() => ({}))) as {
            ok?: boolean;
            order_id?: string;
            error?: string;
          };
          if (!res.ok || !result.ok || !result.order_id) {
            setLoading(false);
            setError(result.error ?? "Payment verification failed");
            return;
          }

          toast.success("Payment confirmed! Your account is being prepared — you'll get a notification within minutes.");

          // Tell the server to notify admins so they can deliver manually.
          fetch("/api/notify-new-purchase", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id: result.order_id }),
            keepalive: true,
          }).catch(() => {});

          await new Promise((r) => setTimeout(r, 250));
          setLoading(false);
          setConfirmOpen(false);
          setPostPurchaseOpen(true);
        } catch (e) {
          setLoading(false);
          setError(e instanceof Error ? e.message : "Payment verification failed");
        }
      },
      onCancel: () => {
        setLoading(false);
        toast.info("Payment cancelled.");
      },
    });

    handler.openIframe();
  };

  return (
    <div className="min-h-screen md:flex">
      {/* Authenticated visitors get the persistent sidebar + bottom nav so
          /buy stays inside the app shell exactly like every other signed-in
          page. Guests get a lightweight sticky public header. */}
      {isAuthenticated && <AppSidebar />}

      <div className={`min-w-0 flex-1 ${isAuthenticated ? "md:ml-60" : ""}`}>
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
          <div className={isAuthenticated ? "md:hidden" : ""}>
            <Brand />
          </div>
          {isAuthenticated && <div className="hidden md:block" />}
          <div className="flex items-center gap-1 md:gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <NotificationBell />
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                >
                  Sign In
                </Link>
                <Button asChild size="sm" className="font-display">
                  <Link to="/auth/register">Get Funded</Link>
                </Button>
              </>
            )}
          </div>
        </header>

        <main className={isAuthenticated ? "pb-24 md:pb-0" : ""}>
          <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
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
              By continuing you agree to our <Link to="/agreement" className="text-primary hover:underline">trader agreement</Link> and acknowledge the risk disclosure.
            </p>
          </div>
        )}
          </div>
        </main>
      </div>

      {isAuthenticated && <MobileBottomNav />}

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
                { icon: Clock, label: "Payout processing", value: "Within 24 hrs" },
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
                Trade only on your FundedNG MT5 evaluation account. No automated
                trading. No copy trading. Place at least one trade every 7 days.
              </div>

              <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-background/50 p-3 text-xs">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-primary"
                />
                <span className="text-muted-foreground">
                  I have read and agree to the{" "}
                  <Link to="/agreement" className="text-primary hover:underline" target="_blank">
                    FundedNG trader agreement & risk disclosure
                  </Link>
                  .
                </span>
              </label>

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
                <Button className="font-display" onClick={handleBuy} disabled={loading || !agreed}>
                  {loading ? "Processing…" : <>Confirm & Pay {formatNaira(selected.price_naira)} <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Post-purchase install prompt */}
      <Dialog open={postPurchaseOpen} onOpenChange={setPostPurchaseOpen}>
        <DialogContent className="mx-4 w-[calc(100%-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">🎉 Account purchased!</DialogTitle>
            <DialogDescription>
              Install the FundedNG app to manage your challenge from your phone — get instant
              alerts on equity, drawdown and payout updates.
            </DialogDescription>
          </DialogHeader>
          {isIOS && !isStandalone && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
              <div className="font-display mb-2 font-semibold">Install on iPhone / iPad</div>
              <p className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                Tap the <Share className="inline h-3.5 w-3.5" /> Share button in Safari, then
                <PlusIcon className="inline h-3.5 w-3.5" /> <strong>Add to Home Screen</strong>.
              </p>
            </div>
          )}
          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              variant="outline"
              onClick={() => {
                setPostPurchaseOpen(false);
                navigate({ to: "/dashboard" });
              }}
              className="font-display"
            >
              <Smartphone className="mr-2 h-4 w-4" /> Continue to Dashboard
            </Button>
            {!isIOS && installAvailable && (
              <Button
                className="font-display"
                onClick={async () => {
                  const ok = await installPwa();
                  if (!ok) {
                    toast.info("Use your browser menu → 'Install app' / 'Add to Home Screen'.");
                  }
                  setPostPurchaseOpen(false);
                  navigate({ to: "/dashboard" });
                }}
              >
                <Download className="mr-2 h-4 w-4" /> Install App
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
