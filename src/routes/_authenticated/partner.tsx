import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatNaira } from "@/lib/utils";
import { toast } from "sonner";
import { Copy, Gift, MousePointerClick, Users, Wallet, Send, Share2, Percent } from "lucide-react";
import { RefreshButton } from "@/components/ui/refresh-button";

export const Route = createFileRoute("/_authenticated/partner")({
  component: PartnerPage,
});

interface PartnerProfile {
  promo_code: string;
  commission_rate: number;
  total_earned_naira: number;
  total_paid_naira: number;
  is_active: boolean;
}
interface Referral { id: string; referred_user_id: string; commission_amount_naira: number; amount_paid_naira: number; order_id: string | null; created_at: string; }
interface Payout { id: string; amount_naira: number; status: string; requested_at: string; admin_note: string | null; }
interface FreeAccount { id: string; status: string; account_size: number; challenge_name: string; mt5_login: string | null; mt5_password: string | null; investor_password: string | null; mt5_server: string | null; requested_at: string; }

function PartnerPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [pp, setPp] = useState<PartnerProfile | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [freeAccounts, setFreeAccounts] = useState<FreeAccount[]>([]);
  const [clicks, setClicks] = useState(0);
  const [signups, setSignups] = useState(0);
  const [pendingReserved, setPendingReserved] = useState(0);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    const [profRes, refRes, payRes, clickRes, signupRes, freeRes] = await Promise.all([
      supabase.from("partner_profiles").select("promo_code,commission_rate,total_earned_naira,total_paid_naira,is_active").eq("user_id", user.id).maybeSingle(),
      supabase.from("partner_referrals").select("*").eq("partner_id", user.id).order("created_at", { ascending: false }),
      supabase.from("partner_payouts").select("*").eq("partner_id", user.id).order("requested_at", { ascending: false }),
      supabase.from("partner_clicks").select("*", { count: "exact", head: true }).eq("partner_id", user.id),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("partner_referred_by", user.id),
      (supabase as any).from("partner_free_accounts").select("*").eq("partner_id", user.id).order("requested_at", { ascending: false }),
    ]);
    setPp((profRes.data as PartnerProfile | null) ?? null);
    setReferrals((refRes.data as Referral[]) ?? []);
    const list = (payRes.data as Payout[]) ?? [];
    setPayouts(list);
    setPendingReserved(list.filter((x) => ["pending","approved"].includes(x.status)).reduce((s,x)=>s+Number(x.amount_naira),0));
    setFreeAccounts((freeRes.data as FreeAccount[]) ?? []);
    setClicks(clickRes.count ?? 0);
    setSignups(signupRes.count ?? 0);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  if (!loading && !pp) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <h1 className="font-display text-2xl font-bold">Partner Program</h1>
        <p className="mt-3 text-sm text-muted-foreground">You don't have a partner profile yet. Reach out to admin to be onboarded.</p>
        <Button className="mt-6" onClick={() => navigate({ to: "/dashboard" })}>Back to Dashboard</Button>
      </div>
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const refLink = pp ? `${origin}/?ref=${pp.promo_code}` : "";

  const copy = async (text: string, label = "Copied!") => {
    try { await navigator.clipboard.writeText(text); toast.success(label); }
    catch { toast.error("Copy failed"); }
  };
  const share = async () => {
    if (!refLink) return;
    if (navigator.share) {
      try { await navigator.share({ title: "Join FundedNG", text: "Get funded to trade", url: refLink }); return; }
      catch { /* fallthrough */ }
    }
    copy(refLink, "Partner link copied!");
  };

  // 7-day cooldown
  const lastRequest = payouts.find((p) => ["pending","approved","paid"].includes(p.status));
  const cooldownEnds = lastRequest ? new Date(lastRequest.requested_at).getTime() + 7*24*60*60*1000 : 0;
  const cooldownActive = cooldownEnds > Date.now();
  const daysLeft = cooldownActive ? Math.ceil((cooldownEnds - Date.now()) / (24*60*60*1000)) : 0;

  const balance = pp ? pp.total_earned_naira - pp.total_paid_naira - pendingReserved : 0;
  const purchases = referrals.length;

  const claimFreeAccount = async () => {
    if (freeAccounts.length > 0) return toast.error("You've already requested your free 1M Elite partnership account.");
    setClaiming(true);
    const { error } = await supabase.rpc("claim_partner_free_account" as any);
    setClaiming(false);
    if (error) return toast.error(error.message);
    toast.success("Free 1M Elite partnership account requested. Admin will deliver your MT5 credentials.");
    load();
  };

  const requestPayout = async () => {
    const amt = Number(amount.replace(/[^0-9]/g, ""));
    if (!amt || amt < 5000) return toast.error("Minimum payout is ₦5,000");
    if (amt > balance) return toast.error("Amount exceeds available balance");
    if (!profile?.bank_account_number) return toast.error("Add your bank details on the dashboard first.");
    setSubmitting(true);
    const { error } = await supabase.rpc("request_partner_payout", { _amount: amt });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Payout requested.");
    setAmount("");
    load();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Partner Dashboard</h1>
          <p className="text-sm text-muted-foreground">Earn {pp?.commission_rate ?? 20}% on every sale through your link.</p>
        </div>
        <RefreshButton onRefresh={async () => { await load(); toast.success("Updated"); }} />
      </div>

      {/* Promo link */}
      <div className="rounded-2xl border border-primary/40 bg-card p-6">
        <div className="font-display text-sm font-semibold text-primary">YOUR PARTNER LINK</div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Input readOnly value={refLink} className="flex-1 font-mono text-xs" />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => copy(refLink, "Link copied!")}><Copy className="mr-1 h-4 w-4"/>Copy</Button>
            <Button onClick={share}><Share2 className="mr-1 h-4 w-4"/>Share</Button>
          </div>
        </div>
        {pp && (
          <p className="mt-3 text-xs text-muted-foreground">
            Promo code: <span className="font-mono font-bold text-foreground">{pp.promo_code}</span>
            {" · "}Buyer discount: <span className="font-bold text-foreground">15%</span>
            {" · "}Commission rate: <span className="font-bold text-foreground">{pp.commission_rate}%</span>
          </p>
        )}
      </div>

      {/* One-time free partnership account */}
      <div className="mt-6 rounded-2xl border border-gold/40 bg-gold/5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="font-display text-base font-bold">🎁 Free 1M Elite Partnership Account</div>
            <p className="mt-1 text-sm text-muted-foreground">Every partner gets one free ₦1,000,000 Elite challenge account. Request below and admin will deliver your MT5 credentials.</p>
          </div>
          {freeAccounts.length === 0 ? (
            <Button onClick={claimFreeAccount} disabled={claiming} className="font-display">
              <Gift className="mr-1 h-4 w-4" />{claiming ? "Requesting..." : "Request 1M Account"}
            </Button>
          ) : (
            <Badge variant="outline" className="capitalize">{freeAccounts[0].status}</Badge>
          )}
        </div>
        {freeAccounts.length > 0 && (
          <div className="mt-4 rounded-md border border-border bg-background p-3 text-sm">
            {freeAccounts[0].status === "fulfilled" && freeAccounts[0].mt5_login ? (
              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">₦1,000,000 Elite Challenge</div>
                <div className="grid gap-1 font-mono text-xs">
                  <div>Login: <span className="font-bold text-foreground">{freeAccounts[0].mt5_login}</span></div>
                  <div>Server: <span className="font-bold text-foreground">{freeAccounts[0].mt5_server}</span></div>
                  <div>Password: <span className="font-bold text-foreground">{freeAccounts[0].mt5_password}</span></div>
                  {freeAccounts[0].investor_password && <div>Investor pw: <span className="font-bold text-foreground">{freeAccounts[0].investor_password}</span></div>}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Your request for a free 1M Elite account is with admin. MT5 credentials will appear here after delivery.</p>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={MousePointerClick} label="Clicks" value={clicks.toString()} />
        <Stat icon={Users} label="Signups" value={signups.toString()} sub={`${purchases} purchases`} />
        <Stat icon={Percent} label="Total earned" value={formatNaira(pp?.total_earned_naira ?? 0)} sub={`Paid: ${formatNaira(pp?.total_paid_naira ?? 0)}`} />
        <Stat icon={Wallet} label="Available" value={formatNaira(Math.max(0, balance))} sub="Min ₦5,000" />
      </div>

      {/* Payout request */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="font-display text-base font-bold">Request a Payout</div>
        <p className="mt-1 text-sm text-muted-foreground">Minimum ₦5,000 · one request per 7 days · processed within 24hrs of admin approval.</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Input
            type="text"
            inputMode="numeric"
            placeholder={`Up to ${formatNaira(Math.max(0, balance))}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1"
            disabled={cooldownActive}
          />
          <Button onClick={requestPayout} disabled={submitting || balance < 5000 || cooldownActive} className="font-display">
            <Send className="mr-1 h-4 w-4" />
            {submitting ? "Requesting..." : "Request Payout"}
          </Button>
        </div>
        {cooldownActive && (
          <p className="mt-2 text-xs text-amber-500">You can request your next payout in {daysLeft} day{daysLeft===1?"":"s"}.</p>
        )}
        {!cooldownActive && balance < 5000 && (
          <p className="mt-2 text-xs text-muted-foreground">You need at least {formatNaira(5000)} available balance to request a payout.</p>
        )}
        {!profile?.bank_account_number && (
          <p className="mt-2 text-xs text-amber-500">Add your bank details on the Dashboard to enable payouts.</p>
        )}
      </div>

      {/* Recent referrals */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="font-display text-base font-bold">Recent Purchases</div>
        {referrals.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No purchases yet. Share your link to start earning.</p>
        ) : (
          <div className="mt-3 divide-y divide-border">
            {referrals.slice(0, 15).map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Sale: {formatNaira(r.amount_paid_naira)}</span>
                  <span className="font-display font-semibold text-primary">+{formatNaira(r.commission_amount_naira)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payout history */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="font-display text-base font-bold">Payout History</div>
        {payouts.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No payouts yet.</p>
        ) : (
          <div className="mt-3 divide-y divide-border">
            {payouts.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-muted-foreground">{new Date(p.requested_at).toLocaleDateString()}</span>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="capitalize">{p.status}</Badge>
                  <span className="font-display font-semibold">{formatNaira(p.amount_naira)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{className?:string}>; label: string; value: string; sub?: string; }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="font-display mt-2 text-2xl font-bold">{value}</div>
      {sub && <div className="mt-1 text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}