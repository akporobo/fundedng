import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatNaira } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { verifyKycServer } from "@/server/kyc.functions";
import { notifyEmail } from "@/lib/notify-email";
import { RefreshButton } from "@/components/ui/refresh-button";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({ component: AdminPage });

function AdminPage() {
  const { isAdmin, isLoading } = useAuth();
  if (isLoading) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center md:px-6">
        <h1 className="font-display text-3xl font-bold">Admins only</h1>
        <p className="mt-2 text-muted-foreground">You don't have admin access.</p>
      </div>
    );
  }
  return <AdminConsole />;
}

function AdminConsole() {
  const { session, user, profile } = useAuth();
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
  // Tickets
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [ticketMessages, setTicketMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");
  const [replySaving, setReplySaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  // Affiliate management
  const [affPayouts, setAffPayouts] = useState<any[]>([]);
  const [freeClaims, setFreeClaims] = useState<any[]>([]);
  const [affSaving, setAffSaving] = useState<string | null>(null);
  const [affiliateStats, setAffiliateStats] = useState<any[]>([]);
  const [affiliateSummary, setAffiliateSummary] = useState({
    total: 0, referrals: 0, earned: 0, paid: 0, pending: 0, revenue: 0,
  });
  // Partner management
  const [partners, setPartners] = useState<any[]>([]);
  const [partnerPayouts, setPartnerPayouts] = useState<any[]>([]);
  const [partnerSaving, setPartnerSaving] = useState<string | null>(null);
  const [newPartnerEmail, setNewPartnerEmail] = useState("");
  const [newPartnerRate, setNewPartnerRate] = useState("20");
  const [addingPartner, setAddingPartner] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any | null>(null);
  const [editRateValue, setEditRateValue] = useState("");
  const [partnerFreeAccounts, setPartnerFreeAccounts] = useState<any[]>([]);
  // Free-account claim delivery dialog (separate from order delivery)
  const [deliverClaimFor, setDeliverClaimFor] = useState<any | null>(null);
  const [claimForm, setClaimForm] = useState({ login: "", password: "", investor: "", server: "" });
  const [deliveringClaim, setDeliveringClaim] = useState(false);
  const [deliverPartnerFreeFor, setDeliverPartnerFreeFor] = useState<any | null>(null);
  const [partnerFreeForm, setPartnerFreeForm] = useState({ login: "", password: "", investor: "", server: "" });
  const [deliveringPartnerFree, setDeliveringPartnerFree] = useState(false);
  // Discount management
  const [discountCodes, setDiscountCodes] = useState<any[]>([]);
  const [discountForm, setDiscountForm] = useState({ code: "", percent_off: "15", max_redemptions: "", expires_at: "", is_active: true, challenge_id: "" });
  const [discountSaving, setDiscountSaving] = useState<string | null>(null);
  // Telegram settings
  const [tgBotToken, setTgBotToken] = useState("");
  const [tgChatId, setTgChatId] = useState("");
  const [tgSaving, setTgSaving] = useState(false);
  const [tgTesting, setTgTesting] = useState(false);
  // Manual equity input per account row (admin-only)
  const [equityDraft, setEquityDraft] = useState<Record<string, string>>({});
  const [equitySaving, setEquitySaving] = useState<string | null>(null);
  // KYC verification modal
  const [kycTarget, setKycTarget] = useState<any | null>(null);
  const [kycVerifying, setKycVerifying] = useState(false);
  // Breach reason dialog
  const [breachTarget, setBreachTarget] = useState<any | null>(null);
  const [breachReason, setBreachReason] = useState("");
  const [breaching, setBreaching] = useState(false);
  const [warnTarget, setWarnTarget] = useState<any | null>(null);
  const [warnReason, setWarnReason] = useState("");
  const [warning, setWarning] = useState(false);
  // Reject phase request dialog
  const [rejectTarget, setRejectTarget] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [rejectType, setRejectType] = useState<"phase2" | "funded" | null>(null);

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
    challenge_type: "standard",
    max_daily_drawdown_percent: 10,
    max_trading_days: 45,
    discount_percent: 0,
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
      challenge_type: challengeForm.challenge_type === "instant" ? "instant" : "standard",
      max_daily_drawdown_percent:
        challengeForm.challenge_type === "instant"
          ? Number(challengeForm.max_daily_drawdown_percent) || null
          : null,
      max_trading_days:
        challengeForm.challenge_type === "instant"
          ? Number(challengeForm.max_trading_days) || null
          : null,
      discount_percent: Number(challengeForm.discount_percent) || 0,
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
      supabase.from("trader_accounts").select("*").is("deleted_at", null).order("created_at", { ascending: false }),
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

    const accIdList = Array.from(new Set(accRows.map((a: any) => a.id)));
    const [profRes, chRes, ordRes, taRes, snapRes] = await Promise.all([
      userIds.length
        ? supabase.from("profiles").select("id, full_name, bank_account_number, bank_name, bank_account_name, kyc_verified").in("id", userIds)
        : Promise.resolve({ data: [] as any[] }),
      challengeIds.length
        ? supabase.from("challenges").select("id, name, account_size, profit_target_percent, max_drawdown_percent, phases").in("id", challengeIds)
        : Promise.resolve({ data: [] as any[] }),
      orderIds.length
        ? supabase.from("orders").select("id, status").in("id", orderIds)
        : Promise.resolve({ data: [] as any[] }),
      accountIds.length
        ? supabase.from("trader_accounts").select("id, mt5_login").in("id", accountIds)
        : Promise.resolve({ data: [] as any[] }),
      accIdList.length
        ? supabase.from("account_snapshots").select("trader_account_id, snapshot_time").in("trader_account_id", accIdList)
        : Promise.resolve({ data: [] as any[] }),
    ]);
    const profMap = new Map((profRes.data ?? []).map((p: any) => [p.id, p]));
    const chMap = new Map((chRes.data ?? []).map((c: any) => [c.id, c]));
    const ordMap = new Map((ordRes.data ?? []).map((o: any) => [o.id, o]));
    const taMap = new Map((taRes.data ?? []).map((t: any) => [t.id, t]));

    // Build trading days count per account from snapshots
    const tradingDaysMap = new Map<string, number>();
    const snapRows = (snapRes.data ?? []) as any[];
    if (snapRows.length > 0) {
      const daySets = new Map<string, Set<string>>();
      for (const s of snapRows) {
        const day = s.snapshot_time.slice(0, 10);
        if (!daySets.has(s.trader_account_id)) daySets.set(s.trader_account_id, new Set());
        daySets.get(s.trader_account_id)!.add(day);
      }
      for (const [id, days] of daySets) tradingDaysMap.set(id, days.size);
    }

    const accList = accRows.map((a) => ({
      ...a,
      profiles: profMap.get(a.user_id) ?? null,
      challenges: chMap.get(a.challenge_id) ?? null,
      _trading_days: tradingDaysMap.get(a.id) ?? 0,
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

    // Surface accounts that have requested phase 2 first, then active.
    accList.sort((a: any, b: any) => {
      const score = (x: any) => {
        if (x.status !== "active") return 0;
        if (x.current_phase < 2 && x.phase2_requested_at) return 2;
        if (x.current_phase >= 2 && x.funded_requested_at) return 2;
        return 0;
      };
      return score(b) - score(a);
    });
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

  const loadTickets = async () => {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return console.error("[admin] tickets load failed:", error);
    const rows = (data ?? []) as any[];
    const userIds = Array.from(new Set(rows.map((t) => t.user_id)));
    const profMap = new Map<string, any>();
    if (userIds.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);
      (profs ?? []).forEach((p: any) => profMap.set(p.id, p));
    }
    setTickets(rows.map((t) => ({ ...t, profiles: profMap.get(t.user_id) ?? null })));
  };

  useEffect(() => { loadTickets(); }, []);

  const loadTicketMessages = async (ticketId: string) => {
    const { data } = await supabase
      .from("ticket_messages")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });
    setTicketMessages((data ?? []) as any[]);
  };

  const selectTicket = (t: any) => {
    setSelectedTicket(t);
    setReplyText("");
    loadTicketMessages(t.id);
  };

  const closeTicketDetail = () => {
    setSelectedTicket(null);
    setTicketMessages([]);
  };

  const loadAffiliate = async () => {
    const [pRes, cRes, affRes, refRes, commRes, ordRes, chRes] = await Promise.all([
      supabase.from("affiliate_payouts").select("*").order("requested_at", { ascending: false }),
      supabase.from("affiliate_free_accounts").select("*").order("created_at", { ascending: false }),
      supabase.from("affiliate_profiles").select("*"),
      supabase.from("referrals").select("*"),
      supabase.from("affiliate_commissions").select("*"),
      supabase.from("orders").select("id, user_id, amount_paid, challenge_id, status").in("status", ["paid", "delivered"]),
      supabase.from("challenges").select("id, account_size"),
    ]);
    const payRows = (pRes.data ?? []) as any[];
    const claimRows = (cRes.data ?? []) as any[];
    const affRows = (affRes.data ?? []) as any[];
    const refRows = (refRes.data ?? []) as any[];
    const commRows = (commRes.data ?? []) as any[];
    const ordRows = (ordRes.data ?? []) as any[];
    const chRows = (chRes.data ?? []) as any[];

    const allUserIds = Array.from(new Set([
      ...payRows.map((r) => r.user_id),
      ...claimRows.map((r) => r.affiliate_id),
      ...affRows.map((r) => r.user_id),
      ...refRows.map((r) => [r.referrer_id, r.referred_user_id]).flat(),
    ]));
    const { data: profs } = await supabase
      .from("profiles").select("id, full_name").in("id", allUserIds);
    const profMap = new Map((profs ?? []).map((p: any) => [p.id, p]));

    setAffPayouts(payRows.map((r) => ({ ...r, profiles: profMap.get(r.user_id) ?? null })));
    setFreeClaims(claimRows.map((r) => ({ ...r, profiles: profMap.get(r.affiliate_id) ?? null })));

    // Build affiliate stats
    const chMap = new Map(chRows.map((c: any) => [c.id, c]));
    const refByAff = new Map<string, any[]>();
    for (const r of refRows) {
      const list = refByAff.get(r.referrer_id) ?? [];
      list.push(r);
      refByAff.set(r.referrer_id, list);
    }
    const commByAff = new Map<string, any[]>();
    for (const c of commRows) {
      const list = commByAff.get(c.affiliate_user_id) ?? [];
      list.push(c);
      commByAff.set(c.affiliate_user_id, list);
    }
    const ordByUser = new Map<string, any[]>();
    for (const o of ordRows) {
      const list = ordByUser.get(o.user_id) ?? [];
      list.push(o);
      ordByUser.set(o.user_id, list);
    }

    const stats = affRows.map((a: any) => {
      const refs = refByAff.get(a.user_id) ?? [];
      const comms = commByAff.get(a.user_id) ?? [];
      const paidOrders = ordRows.filter((o) => refs.some((r) => r.referred_user_id === o.user_id));
      const revenue = paidOrders.reduce((s: number, o: any) => s + Number(o.amount_paid) / 100, 0);
      const accountSize = paidOrders.reduce((s: number, o: any) => {
        const ch = chMap.get(o.challenge_id);
        return s + (ch ? Number(ch.account_size) : 0);
      }, 0);
      const pendingComms = comms.filter((c) => c.status === "pending").reduce((s: number, c: any) => s + Number(c.amount_naira), 0);
      return {
        ...a,
        profile: profMap.get(a.user_id) ?? null,
        referralCount: refs.length,
        paidReferralCount: refs.filter((r) => r.first_paid_at).length,
        pendingCommissions: pendingComms,
        totalRevenue: revenue,
        totalAccountSize: accountSize,
        ordersCount: paidOrders.length,
      };
    });

    stats.sort((a: any, b: any) => b.totalRevenue - a.totalRevenue);
    setAffiliateStats(stats);
    setAffiliateSummary({
      total: stats.length,
      referrals: stats.reduce((s: number, a: any) => s + a.referralCount, 0),
      earned: stats.reduce((s: number, a: any) => s + Number(a.total_earned_naira), 0),
      paid: stats.reduce((s: number, a: any) => s + Number(a.total_paid_naira), 0),
      pending: stats.reduce((s: number, a: any) => s + a.pendingCommissions, 0),
      revenue: stats.reduce((s: number, a: any) => s + a.totalRevenue, 0),
    });
  };
  useEffect(() => { loadAffiliate(); }, []);

  const loadPartners = async () => {
    const [pRes, payRes, freeRes] = await Promise.all([
      supabase.from("partner_profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("partner_payouts").select("*").order("requested_at", { ascending: false }),
      (supabase as any).from("partner_free_accounts").select("*, challenges(name, account_size, profit_target_percent, max_drawdown_percent, phases)").order("requested_at", { ascending: false }),
    ]);
    const partnerRows = (pRes.data ?? []) as any[];
    const payRows = (payRes.data ?? []) as any[];
    const freeRows = (freeRes.data ?? []) as any[];
    const userIds = Array.from(new Set([
      ...partnerRows.map((r) => r.user_id),
      ...payRows.map((r) => r.partner_id),
      ...freeRows.map((r) => r.partner_id),
    ]));
    const profMap = new Map<string, any>();
    if (userIds.length) {
      const { data: profs } = await supabase.from("profiles").select("id, full_name").in("id", userIds);
      (profs ?? []).forEach((p: any) => profMap.set(p.id, p));
    }
    setPartners(partnerRows.map((r) => ({ ...r, profiles: profMap.get(r.user_id) ?? null })));
    setPartnerPayouts(payRows.map((r) => ({ ...r, profiles: profMap.get(r.partner_id) ?? null })));
    setPartnerFreeAccounts(freeRows.map((r) => ({ ...r, profiles: profMap.get(r.partner_id) ?? null })));
  };
  useEffect(() => { loadPartners(); }, []);

  const loadDiscounts = async () => {
    const { data, error } = await (supabase as any).from("discount_codes").select("*").order("created_at", { ascending: false });
    if (error) return console.error("[admin] discount_codes load failed:", error);
    setDiscountCodes((data ?? []) as any[]);
  };
  useEffect(() => { loadDiscounts(); }, []);

  const addPartner = async () => {
    const email = newPartnerEmail.trim();
    const rate = Number(newPartnerRate);
    if (!email) return toast.error("Email is required");
    if (!Number.isFinite(rate) || rate < 0 || rate > 100) return toast.error("Commission must be 0-100");
    setAddingPartner(true);
    const { error } = await supabase.rpc("assign_partner_role", { _email: email, _commission_rate: rate });
    setAddingPartner(false);
    if (error) return toast.error(error.message);
    toast.success("Partner added");
    setNewPartnerEmail("");
    setNewPartnerRate("20");
    loadPartners();
  };

  const saveCommissionRate = async () => {
    if (!editingPartner) return;
    const rate = Number(editRateValue);
    if (!Number.isFinite(rate) || rate < 0 || rate > 100) return toast.error("Commission must be 0-100");
    setPartnerSaving(editingPartner.id);
    const { error } = await supabase.from("partner_profiles").update({ commission_rate: rate } as never).eq("id", editingPartner.id);
    setPartnerSaving(null);
    if (error) return toast.error(error.message);
    toast.success("Commission rate updated");
    setEditingPartner(null);
    loadPartners();
  };

  const togglePartnerActive = async (p: any) => {
    setPartnerSaving(p.id);
    const { error } = await supabase.from("partner_profiles").update({ is_active: !p.is_active } as never).eq("id", p.id);
    setPartnerSaving(null);
    if (error) return toast.error(error.message);
    toast.success(p.is_active ? "Deactivated" : "Activated");
    loadPartners();
  };

  const setPartnerPayoutStatus = async (id: string, status: "approved" | "paid" | "rejected") => {
    setPartnerSaving(id);
    const { error } = await supabase.from("partner_payouts").update({ status } as never).eq("id", id);
    setPartnerSaving(null);
    if (error) return toast.error(error.message);
    toast.success(`Marked ${status}`);
    loadPartners();
  };

  const saveDiscountCode = async () => {
    const code = discountForm.code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    const percent = Number(discountForm.percent_off);
    if (!code) return toast.error("Promo code is required");
    if (!Number.isFinite(percent) || percent <= 0 || percent > 100) return toast.error("Discount must be 1-100%");
    setDiscountSaving("new");
    const { error } = await (supabase as any).from("discount_codes").upsert({
      code,
      percent_off: percent,
      max_redemptions: discountForm.max_redemptions ? Number(discountForm.max_redemptions) : null,
      expires_at: discountForm.expires_at ? new Date(discountForm.expires_at).toISOString() : null,
      is_active: discountForm.is_active,
      challenge_id: discountForm.challenge_id || null,
    }, { onConflict: "code" });
    setDiscountSaving(null);
    if (error) return toast.error(error.message);
    toast.success("Promo discount saved");
    setDiscountForm({ code: "", percent_off: "15", max_redemptions: "", expires_at: "", is_active: true, challenge_id: "" });
    loadDiscounts();
  };

  const toggleDiscountActive = async (d: any) => {
    setDiscountSaving(d.id);
    const { error } = await (supabase as any).from("discount_codes").update({ is_active: !d.is_active }).eq("id", d.id);
    setDiscountSaving(null);
    if (error) return toast.error(error.message);
    toast.success(d.is_active ? "Promo deactivated" : "Promo activated");
    loadDiscounts();
  };

  const setAffPayoutStatus = async (id: string, status: "approved" | "paid" | "rejected") => {
    setAffSaving(id);
    const { error } = await supabase.from("affiliate_payouts").update({ status } as never).eq("id", id);
    setAffSaving(null);
    if (error) return toast.error(error.message);
    toast.success(`Marked ${status}`);
    loadAffiliate();
  };

  const setFreeClaimStatus = async (id: string, status: "rejected") => {
    setAffSaving(id);
    const { error } = await supabase.from("affiliate_free_accounts").update({ status } as never).eq("id", id);
    setAffSaving(null);
    if (error) return toast.error(error.message);
    toast.success(`Marked ${status}`);
    loadAffiliate();
  };

  // Open the deliver-credentials dialog for an affiliate free-account claim.
  const openDeliverClaim = (claim: any) => {
    setDeliverClaimFor(claim);
    setClaimForm({ login: "", password: "", investor: "", server: "" });
  };

  const submitDeliverClaim = async () => {
    if (!deliverClaimFor) return;
    if (!claimForm.login.trim() || !claimForm.password.trim() || !claimForm.server.trim()) {
      return toast.error("Login, password and server are required");
    }
    setDeliveringClaim(true);
    const { error } = await supabase
      .from("affiliate_free_accounts")
      .update({
        status: "fulfilled",
        mt5_login: claimForm.login.trim(),
        mt5_password: claimForm.password.trim(),
        investor_password: claimForm.investor.trim() || null,
        mt5_server: claimForm.server.trim(),
        fulfilled_at: new Date().toISOString(),
      } as never)
      .eq("id", deliverClaimFor.id);
    setDeliveringClaim(false);
    if (error) return toast.error(error.message);
    toast.success(`Delivered free account: login ${claimForm.login}`);
    setDeliverClaimFor(null);
    loadAffiliate();
  };

  const openDeliverPartnerFree = (claim: any) => {
    setDeliverPartnerFreeFor(claim);
    setPartnerFreeForm({ login: "", password: "", investor: "", server: "" });
  };

  const submitDeliverPartnerFree = async () => {
    if (!deliverPartnerFreeFor) return;
    if (!partnerFreeForm.login.trim() || !partnerFreeForm.password.trim() || !partnerFreeForm.server.trim()) {
      return toast.error("Login, password and server are required");
    }
    setDeliveringPartnerFree(true);

    // Use the challenge_id stored on the partner_free_accounts row
    const challengeId = deliverPartnerFreeFor.challenge_id;
    if (!challengeId) {
      setDeliveringPartnerFree(false);
      return toast.error("No challenge linked to this request. The claim may be from an older version. Ask the partner to re-request.");
    }

    // Mark the partner free account as fulfilled
    const { error } = await (supabase as any)
      .from("partner_free_accounts")
      .update({
        status: "fulfilled",
        mt5_login: partnerFreeForm.login.trim(),
        mt5_password: partnerFreeForm.password.trim(),
        investor_password: partnerFreeForm.investor.trim() || null,
        mt5_server: partnerFreeForm.server.trim(),
        fulfilled_at: new Date().toISOString(),
      })
      .eq("id", deliverPartnerFreeFor.id);
    if (error) {
      setDeliveringPartnerFree(false);
      return toast.error(error.message);
    }

    // Create the trader_accounts row so it appears in the Accounts tab for equity/phase management
    const { error: taError } = await (supabase as any)
      .from("trader_accounts")
      .insert({
        user_id: deliverPartnerFreeFor.partner_id,
        challenge_id: challengeId,
        order_id: null,
        mt5_login: partnerFreeForm.login.trim(),
        mt5_password: partnerFreeForm.password.trim(),
        investor_password: partnerFreeForm.investor.trim() || null,
        mt5_server: partnerFreeForm.server.trim(),
        starting_balance: 1000000,
        current_equity: 1000000,
        current_phase: 1,
        status: "active",
      });
    setDeliveringPartnerFree(false);
    if (taError) return toast.error(taError.message);
    toast.success(`Delivered 1M Elite partner account: login ${partnerFreeForm.login}`);
    setDeliverPartnerFreeFor(null);
    load();
    loadPartners();
  };

  // ---- Telegram settings ----
  const loadTelegramConfig = async () => {
    const { data } = await supabase
      .from("app_config")
      .select("key, value")
      .in("key", ["telegram_bot_token", "telegram_chat_id"]);
    (data ?? []).forEach((row: any) => {
      if (row.key === "telegram_bot_token") setTgBotToken(row.value ?? "");
      if (row.key === "telegram_chat_id") setTgChatId(row.value ?? "");
    });
  };
  useEffect(() => { loadTelegramConfig(); }, []);

  const saveTelegram = async () => {
    setTgSaving(true);
    const rows = [
      { key: "telegram_bot_token", value: tgBotToken.trim() },
      { key: "telegram_chat_id", value: tgChatId.trim() },
    ];
    const { error } = await supabase.from("app_config").upsert(rows as never, { onConflict: "key" });
    setTgSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Telegram settings saved");
  };

  const testTelegram = async () => {
    setTgTesting(true);
    const { error } = await supabase.rpc("send_telegram", {
      p_message: "✅ <b>FundedNG admin test</b>\nTelegram notifications are wired up.",
    });
    setTgTesting(false);
    if (error) return toast.error(error.message);
    toast.success("Test message sent — check your Telegram");
  };

  const sendAdminReply = async () => {
    if (!selectedTicket) return;
    if (!session?.user?.id) return toast.error("Please sign in again");
    const text = replyText.trim();
    if (!text) return toast.error("Type a reply first");
    setReplySaving(true);
    const { error } = await supabase
      .from("ticket_messages")
      .insert({
        ticket_id: selectedTicket.id,
        sender_id: session.user.id,
        sender_role: "admin",
        message: text,
      });
    setReplySaving(false);
    if (error) return toast.error(error.message);

    // Send Telegram notification
    await supabase.rpc("send_telegram", {
      p_message: `<b>Support Ticket Updated</b>\nTrader: ${selectedTicket.profiles?.full_name ?? "—"}\nSubject: ${selectedTicket.subject}\nAdmin replied to ticket.`,
    });

    // Send in-app notification to trader
    await supabase.from("notifications").insert({
      user_id: selectedTicket.user_id,
      title: "Support Ticket Update",
      message: `Admin replied to your ticket "${selectedTicket.subject}".`,
      type: "info",
    });

    toast.success("Reply sent");
    setReplyText("");
    await loadTicketMessages(selectedTicket.id);
    loadTickets();
  };

  const updateTicketStatus = async (t: any, newStatus: string) => {
    setStatusUpdating(t.id);
    const { error } = await supabase
      .from("tickets")
      .update({ status: newStatus } as never)
      .eq("id", t.id);
    setStatusUpdating(null);
    if (error) return toast.error(error.message);

    // Send Telegram notification
    await supabase.rpc("send_telegram", {
      p_message: `<b>Support Ticket ${newStatus.replace("_", " ").toUpperCase()}</b>\nTrader: ${t.profiles?.full_name ?? "—"}\nSubject: ${t.subject}\nStatus changed to ${newStatus.replace("_", " ")}.`,
    });

    // Send in-app notification to trader
    await supabase.from("notifications").insert({
      user_id: t.user_id,
      title: "Support Ticket Updated",
      message: `Your ticket "${t.subject}" status changed to ${newStatus.replace("_", " ")}.`,
      type: "info",
    });

    toast.success(`Status changed to ${newStatus.replace("_", " ")}`);
    if (selectedTicket?.id === t.id) {
      setSelectedTicket((prev: any) => prev ? { ...prev, status: newStatus } : null);
    }
    loadTickets();
  };

  const statusFlow: Record<string, string[]> = {
    open: ["in_progress"],
    in_progress: ["resolved"],
    resolved: ["open"],
  };

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
    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session?.access_token) {
      toast.error("Please sign in again");
      return;
    }
    setDelivering(true);
    try {
      const res = await fetch("/api/deliver-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sess.session.access_token}`,
        },
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
    if (status === "approved") notifyEmail({ type: "payout_approved", payoutId: id });
    if (status === "paid") notifyEmail({ type: "payout_paid", payoutId: id });
    if (status === "rejected") notifyEmail({ type: "payout_rejected", payoutId: id, reason: "Rejected by admin." });
    load();
  };

  const updateAccount = async (id: string, patch: Record<string, any>) => {
    const { error } = await supabase.from("trader_accounts").update(patch as never).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Account updated");
    load();
  };

  // Phase 1 → Phase 2: reset equity to starting balance and bump phase.
  const approvePhase2 = async (a: any) => {
    if (a.current_phase >= 2) return toast.error("Already in Phase 2 or beyond");
    if (!confirm(`Approve Phase 2 for ${a.profiles?.full_name ?? "trader"}? Equity will reset to ${formatNaira(a.starting_balance)}.`)) return;
    const { error } = await supabase.from("trader_accounts").update({
      current_phase: 2,
      current_equity: a.starting_balance,
      peak_equity: a.starting_balance,
      phase1_passed_at: new Date().toISOString(),
      phase2_requested_at: null,
      phase_rejected_reason: null,
      phase_rejected_at: null,
      status: "active",
    } as never).eq("id", a.id);
    if (error) return toast.error(error.message);
    await supabase.from("account_snapshots").insert({
      trader_account_id: a.id,
      equity: a.starting_balance,
      balance: a.starting_balance,
      profit: 0,
      drawdown_percent: 0,
    } as never);
    await supabase.from("notifications").insert({
      user_id: a.user_id,
      title: "🎯 Phase 1 Passed",
      message: "Congratulations — you're now in Phase 2. Your equity has been reset to the starting balance.",
      type: "success",
    } as never);
    toast.success("Phase 2 approved");
    notifyEmail({ type: "phase1_passed", accountId: a.id });
    load();
  };

  const approveFunded = async (a: any) => {
    if (a.status === "funded") return toast.error("Already funded");
    if (!confirm(`Approve Funded status for ${a.profiles?.full_name ?? "trader"}? Equity will reset to ${formatNaira(a.starting_balance)}.`)) return;
    const { error } = await supabase.from("trader_accounts").update({
      status: "funded",
      current_equity: a.starting_balance,
      peak_equity: a.starting_balance,
      phase2_passed_at: new Date().toISOString(),
      funded_at: new Date().toISOString(),
      funded_requested_at: null,
      phase_rejected_reason: null,
      phase_rejected_at: null,
    } as never).eq("id", a.id);
    if (error) return toast.error(error.message);
    await supabase.from("account_snapshots").insert({
      trader_account_id: a.id,
      equity: a.starting_balance,
      balance: a.starting_balance,
      profit: 0,
      drawdown_percent: 0,
    } as never);
    await supabase.from("notifications").insert({
      user_id: a.user_id,
      title: "🏆 You're Funded!",
      message: "Congratulations — your account is now funded. Equity has been reset to the starting balance. Start trading and request payouts.",
      type: "success",
    } as never);
    toast.success("Account funded");
    notifyEmail({ type: "funded", accountId: a.id });
    load();
  };

  const submitEquity = async (account: any) => {
    const raw = equityDraft[account.id]?.trim();
    if (!raw) return toast.error("Enter an equity value");
    const equity = Number(raw);
    if (!Number.isFinite(equity) || equity < 0) return toast.error("Equity must be a positive number");
    setEquitySaving(account.id);
    const starting = Number(account.starting_balance) || 0;
    const peak = Math.max(starting, Number(account.peak_equity ?? starting), equity);
    const profit = equity - starting;
    const drawdown = peak > 0 ? Math.max(0, ((peak - equity) / peak) * 100) : 0;
    const { error } = await supabase.from("account_snapshots").insert({
      trader_account_id: account.id,
      equity,
      balance: equity,
      profit,
      drawdown_percent: Number(drawdown.toFixed(2)),
    } as never);
    setEquitySaving(null);
    if (error) return toast.error(error.message);
    setEquityDraft((d) => ({ ...d, [account.id]: "" }));
    toast.success("Equity recorded — rules evaluated");
    load();
  };

  const openKycVerify = (account: any) => setKycTarget(account);

  const submitKycVerify = async () => {
    if (!kycTarget) return;
    if (!session?.access_token) return toast.error("Please sign in again");
    const accountNumber = (kycTarget.profiles?.bank_account_number ?? "").trim();
    if (!accountNumber) return toast.error("Trader hasn't submitted bank details");
    setKycVerifying(true);
    try {
      const res = await verifyKycServer({
        data: { userId: kycTarget.user_id, accountNumber, accessToken: session.access_token },
      });
      if (!res?.ok) {
        toast.error(res?.error ?? "Verification failed");
        return;
      }
      toast.success("KYC verified");
      setKycTarget(null);
      load();
    } catch (e: any) {
      toast.error(e?.message ?? "Verification failed");
    } finally {
      setKycVerifying(false);
    }
  };

  const openBreachDialog = (account: any) => {
    setBreachTarget(account);
    setBreachReason("");
  };

  const openWarningDialog = (account: any) => {
    setWarnTarget(account);
    setWarnReason("");
  };

  const openRejectDialog = (account: any, type: "phase2" | "funded") => {
    setRejectTarget(account);
    setRejectType(type);
    setRejectReason("");
  };

  const submitRejectPhase = async () => {
    if (!rejectTarget || !rejectType) return;
    const reason = rejectReason.trim();
    if (reason.length < 3) { toast.error("Please write a reason (min 3 chars)."); return; }
    setRejecting(true);
    try {
      const isPhase2 = rejectType === "phase2";
      const patch: Record<string, any> = {
        ...(isPhase2 ? { phase2_requested_at: null } : { funded_requested_at: null }),
        phase_rejected_reason: reason,
        phase_rejected_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("trader_accounts").update(patch as never).eq("id", rejectTarget.id);
      if (error) { toast.error(error.message); return; }
      const phaseLabel = isPhase2 ? "Phase 2" : "Funded";
      await supabase.from("notifications").insert({
        user_id: rejectTarget.user_id,
        title: `❌ ${phaseLabel} Request Rejected`,
        message: `Your ${phaseLabel} request for account ${rejectTarget.mt5_login} has been rejected. Reason: ${reason}`,
        type: "error",
      } as never);
      toast.success(`${phaseLabel} request rejected`);
      notifyEmail({ type: "phase_rejected", accountId: rejectTarget.id, reason, phaseType: rejectType });
      setRejectTarget(null);
      setRejectReason("");
      setRejectType(null);
      load();
    } finally {
      setRejecting(false);
    }
  };

  const submitBreach = async () => {
    if (!breachTarget) return;
    const reason = breachReason.trim();
    if (reason.length < 3) { toast.error("Please write a breach reason (min 3 chars)."); return; }
    setBreaching(true);
    try {
      const { error } = await supabase
        .from("trader_accounts")
        .update({ status: "breached", breach_reason: reason, phase_rejected_reason: null, phase_rejected_at: null } as never)
        .eq("id", breachTarget.id);
      if (error) { toast.error(error.message); return; }
      const adminName = (profile?.full_name && profile.full_name.trim()) || (user?.email ?? null);
      await supabase.from("breach_audit_log").insert({
        trader_account_id: breachTarget.id,
        user_id: breachTarget.user_id,
        admin_id: user?.id ?? null,
        admin_name: adminName,
        admin_email: user?.email ?? null,
        reason,
        mt5_login: breachTarget.mt5_login ?? null,
      } as never).then(({ error: e }) => { if (e) console.error("[breach audit log] insert failed", e.message); });
      await supabase.from("notifications").insert({
        user_id: breachTarget.user_id,
        title: "❌ Account breached",
        message: `Your account ${breachTarget.mt5_login} has been marked as breached. Reason: ${reason}`,
        type: "error",
      } as never);
      toast.success("Account breached. It will disappear from this list in 5 minutes.");
      notifyEmail({ type: "breached", accountId: breachTarget.id, reason });
      setBreachTarget(null);
      setBreachReason("");
      load();
    } finally {
      setBreaching(false);
    }
  };

  const submitWarning = async () => {
    if (!warnTarget) return;
    const reason = warnReason.trim();
    if (reason.length < 3) { toast.error("Please write a warning reason (min 3 chars)."); return; }
    setWarning(true);
    try {
      const { error } = await supabase.from("notifications").insert({
        user_id: warnTarget.user_id,
        title: "⚠️ Trading Warning",
        message: `Warning for account ${warnTarget.mt5_login}: ${reason}`,
        type: "warning",
      } as never);
      if (error) { toast.error(error.message); return; }
      toast.success("Warning sent to trader.");
      setWarnTarget(null);
      setWarnReason("");
    } finally {
      setWarning(false);
    }
  };

  return (
    <>
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-bold">Admin Console</h1>
          <RefreshButton onRefresh={async () => { await load(); toast.success("Admin data updated"); }} />
        </div>
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
              <TabsTrigger value="discounts">Discounts</TabsTrigger>
              <TabsTrigger value="tickets">
                Tickets
                {(() => {
                  const unresolved = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;
                  return unresolved > 0 ? (
                    <span className="ml-1 rounded-full bg-warning/20 px-1.5 text-[10px] text-warning">{unresolved}</span>
                  ) : null;
                })()}
              </TabsTrigger>
              <TabsTrigger value="affiliate">
                Affiliate
                {(affPayouts.filter((p) => p.status === "pending").length + freeClaims.filter((c) => c.status === "pending").length) > 0 && (
                  <span className="ml-1 rounded-full bg-warning/20 px-1.5 text-[10px] text-warning">
                    {affPayouts.filter((p) => p.status === "pending").length + freeClaims.filter((c) => c.status === "pending").length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="partners">
                Partners
                {(partnerPayouts.filter((p) => p.status === "pending").length + partnerFreeAccounts.filter((p) => p.status === "pending").length) > 0 && (
                  <span className="ml-1 rounded-full bg-warning/20 px-1.5 text-[10px] text-warning">
                    {partnerPayouts.filter((p) => p.status === "pending").length + partnerFreeAccounts.filter((p) => p.status === "pending").length}
                  </span>
                )}
              </TabsTrigger>
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
              <>
              <div key={a.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[180px]">
                    <div className="font-semibold">{a.profiles?.full_name ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{a.challenges?.name} · login {a.mt5_login}</div>
                  </div>
                  <div className="text-sm">{formatNaira(a.starting_balance)}</div>
                  <div className="font-display text-sm text-gold">Phase {a.current_phase}</div>
                  <Badge variant="outline" className="font-display">{a.status.toUpperCase()}</Badge>
                </div>
                {/* Account metrics row */}
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
                      <span className="text-muted-foreground">
                        Equity: <span className="font-display text-primary">{formatNaira(eq)}</span>
                      </span>
                      <span className="text-muted-foreground">
                        P/L: <span className={`font-display ${profitPct >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {profitPct >= 0 ? "+" : ""}{profitPct.toFixed(2)}%
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        Drawdown: <span className={`font-display ${ddColor}`}>{ddPct.toFixed(2)}%</span>
                        <span className="text-muted-foreground/60"> / {maxDD}%</span>
                      </span>
                      <span className="text-muted-foreground">
                        Peak: <span className="font-display">{formatNaira(pk)}</span>
                      </span>
                      <span className="text-muted-foreground">
                        DD Limit: <span className="font-display text-red-500">{formatNaira(Math.floor(pk * (1 - maxDD / 100)))}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Days traded: <span className="font-display">{a._trading_days ?? 0}</span>
                      </span>
                      {a.last_synced_at && (
                        <span className="text-muted-foreground/60">
                          Synced: {new Date(a.last_synced_at).toLocaleString()}
                        </span>
                      )}
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
                      return (
                        <>
                          {requested && (
                            <>
                              <Badge variant="outline" className="font-display border-warning/40 text-warning">
                                PHASE 2 REQUESTED
                              </Badge>
                              <Button size="sm" variant="destructive" onClick={() => openRejectDialog(a, "phase2")}>
                                Reject
                              </Button>
                            </>
                          )}
                          {hit ? (
                            <Button size="sm" onClick={() => approvePhase2(a)}>
                              Phase 1 passed → Approve Phase 2
                            </Button>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">
                              Needs {formatNaira(Math.ceil(required))} equity ({target}% target)
                            </span>
                          )}
                        </>
                      );
                    })()}
                    {a.current_phase >= 2 && a.status === "active" && (
                      (() => {
                        const target = Number(a.challenges?.profit_target_percent ?? 10);
                        const equity = Number(a.current_equity ?? a.starting_balance);
                        const required = Number(a.starting_balance) * (1 + target / 100);
                        const hit = equity >= required;
                        const requested = !!a.funded_requested_at;
                          return (
                            <>
                              {requested && (
                                <>
                                  <Badge variant="outline" className="font-display border-warning/40 text-warning">
                                    FUNDED REQUESTED
                                  </Badge>
                                  <Button size="sm" variant="destructive" onClick={() => openRejectDialog(a, "funded")}>
                                    Reject
                                  </Button>
                                </>
                              )}
                              {hit ? (
                                <Button size="sm" onClick={() => approveFunded(a)}>
                                  Phase 2 passed → Approve Funded
                                </Button>
                              ) : (
                                <span className="text-[11px] text-muted-foreground">
                                  Needs {formatNaira(Math.ceil(required))} equity ({target}% target)
                                </span>
                              )}
                            </>
                          );
                      })()
                    )}
                    <Button size="sm" variant="outline" onClick={() => openWarningDialog(a)}>Warning</Button>
                    <Button size="sm" variant="outline" onClick={() => openBreachDialog(a)}>Breach</Button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-end gap-2 rounded-md border border-border bg-background p-3">
                  <div className="flex-1 min-w-[200px]">
                    <Label htmlFor={`eq-${a.id}`} className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Update equity
                    </Label>
                    <Input
                      id={`eq-${a.id}`}
                      type="number"
                      inputMode="decimal"
                      placeholder={`Current: ${a.current_equity ?? a.starting_balance}`}
                      value={equityDraft[a.id] ?? ""}
                      onChange={(e) => setEquityDraft((d) => ({ ...d, [a.id]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === "Enter") submitEquity(a); }}
                      className="mt-1 h-9"
                    />
                  </div>
                  <Button size="sm" onClick={() => submitEquity(a)}>Save</Button>
                </div>
                {a.profiles && (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-background p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">KYC:</span>
                      <Badge variant="outline" className={`font-display text-[10px] ${a.profiles.kyc_verified ? "border-green-500/50 text-green-500" : "border-amber-500/50 text-amber-500"}`}>
                        {a.profiles?.kyc_verified ? "VERIFIED" : "PENDING"}
                      </Badge>
                      {!a.profiles?.kyc_verified && a.profiles?.bank_account_number && (
                        <Button size="sm" onClick={() => openKycVerify(a)}>
                          Verify bank matches MT5
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </>
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
                    <div className="flex flex-col items-end gap-1">
                      {c.challenge_type === "instant" && (
                        <Badge className="font-display bg-primary/20 text-primary border-primary/40 border">INSTANT</Badge>
                      )}
                      <Badge variant="outline" className={`font-display ${c.is_active ? "border-primary/40 text-primary" : "border-muted text-muted-foreground"}`}>
                        {c.is_active ? "ACTIVE" : "INACTIVE"}
                      </Badge>
                    </div>
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
                    <th className="px-4 py-3 text-left">Type</th>
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
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`font-display ${c.challenge_type === "instant" ? "border-primary/40 text-primary" : "border-muted text-muted-foreground"}`}>
                          {c.challenge_type === "instant" ? "INSTANT" : "STANDARD"}
                        </Badge>
                      </td>
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
                    <tr><td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">No challenges yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="discounts" className="mt-6 space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="font-display text-base font-bold">Create Promo Discount</div>
              <p className="mt-1 text-xs text-muted-foreground">Create percentage-off promo codes for checkout. Partner links already apply 15% off automatically.</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-[1fr,120px,140px,180px,180px,auto]">
                <Input placeholder="CODE" value={discountForm.code} onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value.toUpperCase() })} />
                <Input type="number" min={1} max={100} step={0.5} placeholder="% off" value={discountForm.percent_off} onChange={(e) => setDiscountForm({ ...discountForm, percent_off: e.target.value })} />
                <Input type="number" min={1} placeholder="Max uses" value={discountForm.max_redemptions} onChange={(e) => setDiscountForm({ ...discountForm, max_redemptions: e.target.value })} />
                <Input type="datetime-local" value={discountForm.expires_at} onChange={(e) => setDiscountForm({ ...discountForm, expires_at: e.target.value })} />
                <select
                  value={discountForm.challenge_id}
                  onChange={(e) => setDiscountForm({ ...discountForm, challenge_id: e.target.value })}
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors"
                >
                  <option value="">Any Challenge</option>
                  {challengeList.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name} — {Number(c.account_size).toLocaleString()}</option>
                  ))}
                </select>
                <Button onClick={saveDiscountCode} disabled={discountSaving === "new"}>{discountSaving === "new" ? "Saving…" : "Save"}</Button>
              </div>
            </div>

            <div className="space-y-2">
              {discountCodes.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">No promo codes yet.</div>
              ) : discountCodes.map((d) => (
                <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
                  <div>
                    <div className="font-display font-semibold"><span className="font-mono text-primary">{d.code}</span> · {d.percent_off}% off{d.challenge_id ? ` · ${challengeList.find((c: any) => c.id === d.challenge_id)?.name ?? "Specific challenge"}` : ""}</div>
                    <div className="text-xs text-muted-foreground">
                      Used {d.redemption_count ?? 0}{d.max_redemptions ? ` / ${d.max_redemptions}` : ""}
                      {d.expires_at ? ` · Expires ${new Date(d.expires_at).toLocaleString()}` : " · No expiry"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">{d.is_active ? "active" : "inactive"}</Badge>
                    <Button size="sm" variant="outline" onClick={() => toggleDiscountActive(d)} disabled={discountSaving === d.id}>{d.is_active ? "Deactivate" : "Activate"}</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tickets" className="mt-6">
            {!selectedTicket ? (
              <>
                {/* Status filter */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {["all", "open", "in_progress", "resolved"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`rounded-md px-3 py-1.5 text-xs font-display font-medium transition-colors ${
                        statusFilter === s
                          ? "bg-primary text-primary-foreground"
                          : "border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s === "all" ? "All" : s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {tickets.filter((t) => statusFilter === "all" || t.status === statusFilter).length === 0 ? (
                    <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                      No support tickets yet.
                    </div>
                  ) : tickets
                    .filter((t) => statusFilter === "all" || t.status === statusFilter)
                    .map((t) => (
                      <div key={t.id} className="rounded-xl border border-border bg-card p-5">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex-1 min-w-[200px]">
                            <div className="font-semibold">{t.subject}</div>
                            <div className="text-xs text-muted-foreground">
                              {t.profiles?.full_name ?? "—"} · {t.category} · {new Date(t.created_at).toLocaleString()}
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`font-display ${
                              t.status === "open" ? "border-warning/40 text-warning" :
                              t.status === "in_progress" ? "border-info/40 text-info" :
                              "border-primary/40 text-primary"
                            }`}
                          >
                            {t.status === "in_progress" ? "IN PROGRESS" : t.status.toUpperCase()}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            Updated {new Date(t.updated_at).toLocaleDateString()}
                          </div>
                          <Button size="sm" variant="outline" onClick={() => selectTicket(t)}>
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              /* Ticket Detail View */
              <div>
                <button onClick={closeTicketDetail} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4" /> Back to all tickets
                </button>
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-bold">{selectedTicket.subject}</h2>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {selectedTicket.profiles?.full_name ?? "—"} · {selectedTicket.category} · Created {new Date(selectedTicket.created_at).toLocaleString()}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`font-display ${
                        selectedTicket.status === "open" ? "border-warning/40 text-warning" :
                        selectedTicket.status === "in_progress" ? "border-info/40 text-info" :
                        "border-primary/40 text-primary"
                      }`}
                    >
                      {selectedTicket.status === "in_progress" ? "IN PROGRESS" : selectedTicket.status.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Messages Thread */}
                  <div className="mt-6 space-y-4">
                    {ticketMessages.length === 0 && (
                      <div className="py-6 text-center text-sm text-muted-foreground">No messages yet.</div>
                    )}
                    {ticketMessages.map((m) => (
                      <div key={m.id} className={`flex ${m.sender_role === "trader" ? "justify-start" : "justify-end"}`}>
                        <div className={`max-w-[85%] rounded-xl p-4 ${m.sender_role === "trader" ? "bg-muted" : "bg-primary/10 border border-primary/20"}`}>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span className="font-display font-semibold">
                              {m.sender_role === "trader" ? selectedTicket.profiles?.full_name ?? "Trader" : "Admin"}
                            </span>
                            <span>·</span>
                            <span>{new Date(m.created_at).toLocaleString()}</span>
                          </div>
                          <p className="mt-2 whitespace-pre-wrap text-sm">{m.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Admin Reply & Status Controls */}
                  <div className="mt-6 flex flex-wrap items-end gap-3">
                    <div className="flex-1 min-w-[240px]">
                      <Label htmlFor="admin-reply" className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        Reply as Admin
                      </Label>
                      <Textarea
                        id="admin-reply"
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply…"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(statusFlow[selectedTicket.status] ?? []).map((nextStatus) => (
                        <Button
                          key={nextStatus}
                          size="sm"
                          variant={nextStatus === "resolved" ? "default" : "outline"}
                          onClick={() => updateTicketStatus(selectedTicket, nextStatus)}
                          disabled={statusUpdating === selectedTicket.id}
                        >
                          {statusUpdating === selectedTicket.id ? "…" : `Mark ${nextStatus.replace("_", " ")}`}
                        </Button>
                      ))}
                      <Button size="sm" onClick={sendAdminReply} disabled={replySaving || !replyText.trim()}>
                        {replySaving ? "Sending…" : "Send Reply"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="affiliate" className="mt-6 space-y-6">
            {/* Overview stats */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
              {[
                ["Total Affiliates", affiliateSummary.total, ""],
                ["Total Referrals", affiliateSummary.referrals, ""],
                ["Total Earned (₦)", formatNaira(affiliateSummary.earned), "text-primary"],
                ["Total Paid (₦)", formatNaira(affiliateSummary.paid), "text-green-500"],
                ["Pending (₦)", formatNaira(affiliateSummary.pending), "text-warning"],
                ["Revenue Generated (₦)", formatNaira(affiliateSummary.revenue), "text-primary"],
              ].map(([l, v, c]: any) => (
                <div key={l} className="rounded-xl border border-border bg-card p-4">
                  <div className="text-[11px] text-muted-foreground">{l}</div>
                  <div className={`font-display mt-1 text-lg font-bold ${c ?? ""}`}>{v}</div>
                </div>
              ))}
            </div>

            {/* All Affiliates list */}
            <div>
              <h3 className="font-display text-lg font-bold">All Affiliates</h3>
              {affiliateStats.length === 0 ? (
                <div className="mt-3 rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                  No affiliates yet.
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  {affiliateStats.map((a: any) => (
                    <div key={a.id} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex-1 min-w-[160px]">
                          <div className="font-semibold">{a.profile?.full_name ?? "—"}</div>
                          <div className="text-xs text-muted-foreground">
                            Code: <span className="font-mono text-primary">{a.code}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs md:grid-cols-4">
                          <div>
                            <span className="text-muted-foreground">Refs: </span>
                            <span className="font-display">{a.referralCount}</span>
                            {a.paidReferralCount > 0 && (
                              <span className="text-muted-foreground/60"> ({a.paidReferralCount} paid)</span>
                            )}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Earned: </span>
                            <span className="font-display text-primary">{formatNaira(Number(a.total_earned_naira))}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Paid: </span>
                            <span className="font-display text-green-500">{formatNaira(Number(a.total_paid_naira))}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Pending: </span>
                            <span className={`font-display ${a.pendingCommissions > 0 ? "text-warning" : ""}`}>
                              {formatNaira(a.pendingCommissions)}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Revenue: </span>
                            <span className="font-display text-primary">{formatNaira(a.totalRevenue)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Acct Size: </span>
                            <span className="font-display">{formatNaira(a.totalAccountSize)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Free Accts: </span>
                            <span className="font-display">{a.free_accounts_credited} credited / {a.free_accounts_claimed} claimed</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Orders: </span>
                            <span className="font-display">{a.ordersCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payout Requests */}
            <div>
              <h3 className="font-display text-lg font-bold">Payout Requests</h3>
              <div className="mt-3 space-y-3">
                {affPayouts.length === 0 ? (
                  <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                    No affiliate payout requests yet.
                  </div>
                ) : affPayouts.map((p) => {
                  const bd = p.bank_details ?? {};
                  return (
                    <div key={p.id} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold">{p.profiles?.full_name ?? "—"} · {formatNaira(p.amount_naira)}</div>
                          <div className="text-xs text-muted-foreground">
                            Requested {new Date(p.requested_at).toLocaleString()}
                          </div>
                          {bd.account_number && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              {bd.bank_name} · {bd.account_number} · {bd.account_name}
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="capitalize">{p.status}</Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {p.status === "pending" && (
                          <>
                            <Button size="sm" onClick={() => setAffPayoutStatus(p.id, "approved")} disabled={affSaving === p.id}>Approve</Button>
                            <Button size="sm" variant="outline" onClick={() => setAffPayoutStatus(p.id, "rejected")} disabled={affSaving === p.id}>Reject</Button>
                          </>
                        )}
                        {p.status === "approved" && (
                          <Button size="sm" onClick={() => setAffPayoutStatus(p.id, "paid")} disabled={affSaving === p.id}>Mark as paid</Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Free Account Claims */}
            <div>
              <h3 className="font-display text-lg font-bold">Free Account Claims</h3>
              <div className="mt-3 space-y-3">
                {freeClaims.length === 0 ? (
                  <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                    No free-account claims yet.
                  </div>
                ) : freeClaims.map((c) => (
                  <div key={c.id} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold">{c.profiles?.full_name ?? "—"} · Free {formatNaira(c.account_size)} challenge</div>
                        <div className="text-xs text-muted-foreground">
                          Batch #{c.referral_batch} · Claimed {new Date(c.created_at).toLocaleString()}
                          {c.mt5_login && <> · Login <span className="font-mono">{c.mt5_login}</span></>}
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">{c.status}</Badge>
                    </div>
                    {c.status === "pending" && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => openDeliverClaim(c)} disabled={affSaving === c.id}>Deliver account</Button>
                        <Button size="sm" variant="outline" onClick={() => setFreeClaimStatus(c.id, "rejected")} disabled={affSaving === c.id}>Reject</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Telegram Settings */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-display text-lg font-bold">📲 Telegram Admin Notifications</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get realtime pings for new orders, payout requests, free-account claims, support tickets and account-delivery requests.
                Create a bot via <a className="text-primary underline" href="https://t.me/BotFather" target="_blank" rel="noreferrer">@BotFather</a>,
                then send your bot a message and find your <span className="font-mono">chat_id</span> at
                {" "}<a className="text-primary underline" href="https://api.telegram.org/bot&lt;TOKEN&gt;/getUpdates" target="_blank" rel="noreferrer">api.telegram.org/bot&lt;TOKEN&gt;/getUpdates</a>.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="tg-token">Bot token</Label>
                  <Input id="tg-token" type="password" value={tgBotToken} onChange={(e) => setTgBotToken(e.target.value)} placeholder="123456:ABC..." />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="tg-chat">Chat ID</Label>
                  <Input id="tg-chat" value={tgChatId} onChange={(e) => setTgChatId(e.target.value)} placeholder="e.g. 123456789 or -100123..." />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={saveTelegram} disabled={tgSaving}>{tgSaving ? "Saving…" : "Save settings"}</Button>
                <Button variant="outline" onClick={testTelegram} disabled={tgTesting || !tgBotToken || !tgChatId}>
                  {tgTesting ? "Sending…" : "Send test message"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="partners" className="mt-6 space-y-6">
            {/* Add new partner */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="font-display text-base font-bold">Assign Partner Role</div>
              <p className="mt-1 text-xs text-muted-foreground">Enter the user's email and commission rate. Promo code is auto-generated from their name.</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-[1fr,140px,auto]">
                <Input placeholder="user@example.com" value={newPartnerEmail} onChange={(e) => setNewPartnerEmail(e.target.value)} />
                <Input type="number" min={0} max={100} step={0.5} placeholder="Rate %" value={newPartnerRate} onChange={(e) => setNewPartnerRate(e.target.value)} />
                <Button onClick={addPartner} disabled={addingPartner}>{addingPartner ? "Adding…" : "Add Partner"}</Button>
              </div>
            </div>

            {/* Partners list */}
            <div>
              <div className="font-display mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">All Partners</div>
              {partners.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">No partners yet.</div>
              ) : (
                <div className="space-y-2">
                  {partners.map((p) => {
                    const pendingForThis = partnerPayouts.filter((pp) => pp.partner_id === p.user_id && pp.status === "pending").length;
                    const balance = Math.max(0, Number(p.total_earned_naira ?? 0) - Number(p.total_paid_naira ?? 0));
                    return (
                      <div key={p.id} className="rounded-xl border border-border bg-card p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-display font-semibold">
                              {p.profiles?.full_name ?? "—"}
                              <span className="ml-2 font-mono text-xs text-primary">{p.promo_code}</span>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              Commission: <span className="font-bold text-foreground">{p.commission_rate}%</span> ·
                              Earned: <span className="font-bold text-foreground">{formatNaira(p.total_earned_naira)}</span> ·
                              Paid: {formatNaira(p.total_paid_naira)} ·
                              Available: <span className="font-bold text-foreground">{formatNaira(balance)}</span>
                              {pendingForThis > 0 && <span className="ml-2 rounded-full bg-warning/20 px-2 py-0.5 text-[10px] text-warning">{pendingForThis} pending payout</span>}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setEditingPartner(p); setEditRateValue(String(p.commission_rate)); }}>
                              Edit Rate
                            </Button>
                            <Button size="sm" variant={p.is_active ? "outline" : "default"} onClick={() => togglePartnerActive(p)} disabled={partnerSaving === p.id}>
                              {p.is_active ? "Deactivate" : "Activate"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Partner free-account requests */}
            <div>
              <div className="font-display mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">Partner Free 1M Account Requests</div>
              {partnerFreeAccounts.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">No partner free-account requests yet.</div>
              ) : (
                <div className="space-y-2">
                  {partnerFreeAccounts.map((c) => (
                    <div key={c.id} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold">{c.profiles?.full_name ?? "—"}</div>
                          <div className="text-xs text-muted-foreground">
                            Free ₦1,000,000 Elite Challenge
                            {" · "}Requested {new Date(c.requested_at).toLocaleString()}
                            {c.mt5_login && <> · Login <span className="font-mono">{c.mt5_login}</span></>}
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">{c.status}</Badge>
                      </div>
                      {c.status === "pending" && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button size="sm" onClick={() => openDeliverPartnerFree(c)} disabled={partnerSaving === c.id}>Deliver account</Button>
                          <Button size="sm" variant="outline" onClick={async () => { setPartnerSaving(c.id); const { error } = await (supabase as any).from("partner_free_accounts").update({ status: "rejected" }).eq("id", c.id); setPartnerSaving(null); if (error) toast.error(error.message); else { toast.success("Rejected"); loadPartners(); } }} disabled={partnerSaving === c.id}>Reject</Button>
                        </div>
                      )}
                      {c.status === "fulfilled" && c.challenges && (
                        <div className="mt-3 text-xs text-muted-foreground">
                          Delivered: <span className="font-mono">{c.mt5_login}</span> on {c.mt5_server}
                          {" · "}Phase {c.challenges.phases}-step · Target {c.challenges.profit_target_percent}% · Max DD {c.challenges.max_drawdown_percent}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Partner payout requests */}
            <div>
              <div className="font-display mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">Partner Payout Requests</div>
              {partnerPayouts.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">No payout requests yet.</div>
              ) : (
                <div className="space-y-2">
                  {partnerPayouts.map((pp) => {
                    const bd = (pp.bank_details ?? {}) as any;
                    return (
                      <div key={pp.id} className="rounded-xl border border-border bg-card p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="font-semibold">{pp.profiles?.full_name ?? "—"} · {formatNaira(pp.amount_naira)}</div>
                            <div className="text-xs text-muted-foreground">Requested {new Date(pp.requested_at).toLocaleString()}</div>
                            {bd.account_number && (
                              <div className="mt-1 text-xs text-muted-foreground">{bd.bank_name} · {bd.account_number} · {bd.account_name}</div>
                            )}
                          </div>
                          <Badge variant="outline" className="capitalize">{pp.status}</Badge>
                        </div>
                        {pp.status === "pending" && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button size="sm" onClick={() => setPartnerPayoutStatus(pp.id, "approved")} disabled={partnerSaving === pp.id}>Approve</Button>
                            <Button size="sm" variant="outline" onClick={() => setPartnerPayoutStatus(pp.id, "paid")} disabled={partnerSaving === pp.id}>Mark Paid</Button>
                            <Button size="sm" variant="destructive" onClick={() => setPartnerPayoutStatus(pp.id, "rejected")} disabled={partnerSaving === pp.id}>Reject</Button>
                          </div>
                        )}
                        {pp.status === "approved" && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button size="sm" onClick={() => setPartnerPayoutStatus(pp.id, "paid")} disabled={partnerSaving === pp.id}>Mark Paid</Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit partner commission rate dialog */}
      <Dialog open={!!editingPartner} onOpenChange={(o) => !o && setEditingPartner(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Commission Rate</DialogTitle>
            <DialogDescription>{editingPartner?.profiles?.full_name} · {editingPartner?.promo_code}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="edit-rate">Commission %</Label>
            <Input id="edit-rate" type="number" min={0} max={100} step={0.5} value={editRateValue} onChange={(e) => setEditRateValue(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPartner(null)}>Cancel</Button>
            <Button onClick={saveCommissionRate} disabled={!!partnerSaving}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      <Dialog open={!!deliverClaimFor} onOpenChange={(o) => !o && setDeliverClaimFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deliver free affiliate account</DialogTitle>
            <DialogDescription>
              {deliverClaimFor && (
                <>
                  Affiliate: <span className="font-medium">{deliverClaimFor.profiles?.full_name ?? "—"}</span> ·{" "}
                  Free {formatNaira(deliverClaimFor.account_size ?? 200000)} challenge (batch #{deliverClaimFor.referral_batch})
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="claim-login">MT5 Login</Label>
              <Input id="claim-login" value={claimForm.login} onChange={(e) => setClaimForm({ ...claimForm, login: e.target.value })} placeholder="e.g. 12345678" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="claim-server">Server</Label>
              <Input id="claim-server" value={claimForm.server} onChange={(e) => setClaimForm({ ...claimForm, server: e.target.value })} placeholder="e.g. Exness-MT5Demo" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="claim-password">Master password</Label>
              <Input id="claim-password" value={claimForm.password} onChange={(e) => setClaimForm({ ...claimForm, password: e.target.value })} placeholder="Trading password" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="claim-investor">Investor password (optional)</Label>
              <Input id="claim-investor" value={claimForm.investor} onChange={(e) => setClaimForm({ ...claimForm, investor: e.target.value })} placeholder="Read-only password" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeliverClaimFor(null)} disabled={deliveringClaim}>Cancel</Button>
            <Button onClick={submitDeliverClaim} disabled={deliveringClaim}>
              {deliveringClaim ? "Delivering…" : "Deliver to affiliate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deliverPartnerFreeFor} onOpenChange={(o) => !o && setDeliverPartnerFreeFor(null)}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Deliver free 1M Elite partner account</DialogTitle>
            <DialogDescription>
              {deliverPartnerFreeFor && (
                <>Partner: <span className="font-medium">{deliverPartnerFreeFor.profiles?.full_name ?? "—"}</span> · Free ₦1,000,000 Elite Challenge</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="partner-free-login">MT5 Login</Label>
              <Input id="partner-free-login" value={partnerFreeForm.login} onChange={(e) => setPartnerFreeForm({ ...partnerFreeForm, login: e.target.value })} placeholder="e.g. 12345678" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="partner-free-server">Server</Label>
              <Input id="partner-free-server" value={partnerFreeForm.server} onChange={(e) => setPartnerFreeForm({ ...partnerFreeForm, server: e.target.value })} placeholder="e.g. Exness-MT5Demo" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="partner-free-password">Master password</Label>
              <Input id="partner-free-password" value={partnerFreeForm.password} onChange={(e) => setPartnerFreeForm({ ...partnerFreeForm, password: e.target.value })} placeholder="Trading password" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="partner-free-investor">Investor password (optional)</Label>
              <Input id="partner-free-investor" value={partnerFreeForm.investor} onChange={(e) => setPartnerFreeForm({ ...partnerFreeForm, investor: e.target.value })} placeholder="Read-only password" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeliverPartnerFreeFor(null)} disabled={deliveringPartnerFree}>Cancel</Button>
            <Button onClick={submitDeliverPartnerFree} disabled={deliveringPartnerFree}>{deliveringPartnerFree ? "Delivering…" : "Deliver to partner"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!kycTarget} onOpenChange={(o) => !o && !kycVerifying && setKycTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify trader KYC</DialogTitle>
            <DialogDescription>
              Confirm the bank details below match what the trader sent for KYC, then click Verify.
            </DialogDescription>
          </DialogHeader>
          {kycTarget && (
            <div className="grid gap-3 rounded-lg border border-border bg-muted/30 p-4 text-sm">
              <div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Trader</div>
                <div className="font-display font-semibold">{kycTarget.profiles?.full_name ?? "—"}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Account number</div>
                <div className="font-mono text-base text-primary">{kycTarget.profiles?.bank_account_number ?? "—"}</div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Bank</div>
                  <div>{kycTarget.profiles?.bank_name ?? "—"}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Account name</div>
                  <div>{kycTarget.profiles?.bank_account_name ?? "—"}</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                MT5 login: <span className="font-mono">{kycTarget.mt5_login}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setKycTarget(null)} disabled={kycVerifying}>
              Cancel
            </Button>
            <Button onClick={submitKycVerify} disabled={kycVerifying}>
              {kycVerifying ? "Verifying…" : "Verify KYC"}
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
            <div className="grid gap-1.5">
              <Label>Challenge type</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setChallengeForm({ ...challengeForm, challenge_type: "standard", phases: 2 })}
                  className={`rounded-md border px-3 py-2 text-sm font-display ${challengeForm.challenge_type !== "instant" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
                >
                  2-Step Standard
                </button>
                <button
                  type="button"
                  onClick={() => setChallengeForm({ ...challengeForm, challenge_type: "instant", phases: 1 })}
                  className={`rounded-md border px-3 py-2 text-sm font-display ${challengeForm.challenge_type === "instant" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
                >
                  1-Step Instant
                </button>
              </div>
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
                <Label htmlFor="ch-discount">Discount % (0–100)</Label>
                <Input id="ch-discount" type="number" min={0} max={100} step="0.01" value={challengeForm.discount_percent ?? 0} onChange={(e) => setChallengeForm({ ...challengeForm, discount_percent: e.target.value })} />
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
              {challengeForm.challenge_type === "instant" && (
                <>
                  <div className="grid gap-1.5">
                    <Label htmlFor="ch-daily-dd">Max Daily Drawdown %</Label>
                    <Input id="ch-daily-dd" type="number" min={0} step="0.01" value={challengeForm.max_daily_drawdown_percent ?? ""} onChange={(e) => setChallengeForm({ ...challengeForm, max_daily_drawdown_percent: e.target.value })} />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="ch-max-days">Max Trading Days</Label>
                    <Input id="ch-max-days" type="number" min={1} value={challengeForm.max_trading_days ?? ""} onChange={(e) => setChallengeForm({ ...challengeForm, max_trading_days: e.target.value })} />
                  </div>
                </>
              )}
            </div>
            {Number(challengeForm.price_naira) > 0 && Number(challengeForm.account_size) > 0 && (
              <div className="rounded-md border border-border bg-background p-3 text-xs text-muted-foreground">
                Preview: <span className="font-display text-primary">{formatNaira(challengeForm.account_size)}</span> account for{" "}
                {Number(challengeForm.discount_percent) > 0 ? (
                  <>
                    <span className="line-through text-muted-foreground/60">{formatNaira(challengeForm.price_naira)}</span>{" "}
                    <span className="font-display text-primary">{formatNaira(Math.round(Number(challengeForm.price_naira) * (1 - Number(challengeForm.discount_percent) / 100)))}</span>
                    <span className="ml-1 rounded bg-green-500/20 px-1.5 py-0.5 text-[10px] font-bold text-green-600">{Number(challengeForm.discount_percent)}% OFF</span>
                  </>
                ) : (
                  <span className="font-display text-primary">{formatNaira(challengeForm.price_naira)}</span>
                )}
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

      <Dialog open={!!breachTarget} onOpenChange={(o) => !breaching && o && setBreachTarget(null)}>
        <DialogContent className="mx-4 w-[calc(100%-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>Breach Account</DialogTitle>
            <DialogDescription>
              Breaching account for {breachTarget?.profiles?.full_name ?? "trader"} ({breachTarget?.mt5_login}). This will notify the trader.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="breach-reason">Reason for breach</Label>
              <Textarea
                id="breach-reason"
                placeholder="Enter the reason for breaching this account..."
                value={breachReason}
                onChange={(e) => setBreachReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setBreachTarget(null); setBreachReason(""); }} disabled={breaching}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submitBreach} disabled={breaching || !breachReason.trim()}>
              {breaching ? "Breaching…" : "Breach Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!warnTarget} onOpenChange={(o) => !warning && !o && setWarnTarget(null)}>
        <DialogContent className="mx-4 w-[calc(100%-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>Send Warning</DialogTitle>
            <DialogDescription>
              Send a warning to {warnTarget?.profiles?.full_name ?? "trader"} ({warnTarget?.mt5_login}) about their trading activities.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="warn-reason">Warning message</Label>
              <Textarea
                id="warn-reason"
                placeholder="Describe the concerning trading activity..."
                value={warnReason}
                onChange={(e) => setWarnReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setWarnTarget(null); setWarnReason(""); }} disabled={warning}>
              Cancel
            </Button>
            <Button variant="default" onClick={submitWarning} disabled={warning || !warnReason.trim()}>
              {warning ? "Sending…" : "Send Warning"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!rejectTarget} onOpenChange={(o) => !rejecting && !o && setRejectTarget(null)}>
        <DialogContent className="mx-4 w-[calc(100%-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>Reject {rejectType === "phase2" ? "Phase 2" : "Funded"} Request</DialogTitle>
            <DialogDescription>
              Rejecting {rejectType === "phase2" ? "Phase 2" : "Funded"} request for {rejectTarget?.profiles?.full_name ?? "trader"} ({rejectTarget?.mt5_login}). This will notify the trader.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="reject-reason">Reason for rejection</Label>
              <Textarea
                id="reject-reason"
                placeholder="Enter the reason for rejecting this request..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectTarget(null); setRejectReason(""); setRejectType(null); }} disabled={rejecting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submitRejectPhase} disabled={rejecting || !rejectReason.trim()}>
              {rejecting ? "Rejecting…" : "Reject Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}