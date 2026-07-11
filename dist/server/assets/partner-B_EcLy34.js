import { a2 as createServerFn, r as reactExports, V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAuth, a as useNavigate, t as toast, s as supabase } from "./router-DudJYIfW.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { I as Input } from "./input-Cg1AgxSs.js";
import { B as Badge } from "./badge-Drtmlf7I.js";
import { L as Label } from "./label-BvHzfEVS.js";
import { a as formatNaira } from "./utils-vYOMvTwc.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BIdxB6Jz.js";
import { R as RefreshButton } from "./refresh-button-AmVH5llR.js";
import { c as createSsrRpc, l as listNigerianBanks, v as verifyKycPaystack } from "./kyc.functions-Ddgzg7nS.js";
import { o as objectType, f as arrayType, s as stringType } from "./client.server-B4evwzKW.js";
import { C as Copy } from "./copy-C8-365PD.js";
import { S as Share2 } from "./share-2-Cw7Dc8OK.js";
import { G as Gift } from "./gift-DxQj5ZIr.js";
import { S as ShieldCheck } from "./shield-check-CoWiH9kN.js";
import { S as ShieldAlert, L as Landmark, M as Mail } from "./shield-alert-B1WUpkKc.js";
import { c as createLucideIcon } from "./createLucideIcon-DQobbSW9.js";
import { U as Users } from "./users-IaM0z4Ba.js";
import { W as Wallet } from "./wallet-C6DygIpk.js";
import { S as Send } from "./send-DLdGIVO8.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./email.server-Czm4Ciez.js";
import "crypto";
import "buffer";
import "stream";
import "util";
import "url";
import "https";
import "net";
import "tls";
import "assert";
import "os";
import "http";
import "./index-BXyXc4LB.js";
import "./index-BX1kfvFW.js";
import "./index-DtbDbYbe.js";
import "./index-CYEXyF5B.js";
import "./index-DoApm__Q.js";
import "./check-CNUFRDbJ.js";
const __iconNode$1 = [
  ["path", { d: "M14 4.1 12 6", key: "ita8i4" }],
  ["path", { d: "m5.1 8-2.9-.8", key: "1go3kf" }],
  ["path", { d: "m6 12-1.9 2", key: "mnht97" }],
  ["path", { d: "M7.2 2.2 8 5.1", key: "1cfko1" }],
  [
    "path",
    {
      d: "M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z",
      key: "s0h3yz"
    }
  ]
];
const MousePointerClick = createLucideIcon("mouse-pointer-click", __iconNode$1);
const __iconNode = [
  ["line", { x1: "19", x2: "5", y1: "5", y2: "19", key: "1x9vlm" }],
  ["circle", { cx: "6.5", cy: "6.5", r: "2.5", key: "4mh3h7" }],
  ["circle", { cx: "17.5", cy: "17.5", r: "2.5", key: "1mdrzq" }]
];
const Percent = createLucideIcon("percent", __iconNode);
const GetBuyerInfoInput = objectType({
  accessToken: stringType().min(1),
  userIds: arrayType(stringType().uuid())
});
const getBuyerInfo = createServerFn({
  method: "POST"
}).inputValidator((input) => GetBuyerInfoInput.parse(input)).handler(createSsrRpc("ad940f6248f636634e2ce234c17324e050727e8ce4bcf815feab5a83707835ae"));
function PartnerPage() {
  const {
    user,
    profile
  } = useAuth();
  const navigate = useNavigate();
  const [pp, setPp] = reactExports.useState(null);
  const [referrals, setReferrals] = reactExports.useState([]);
  const [payouts, setPayouts] = reactExports.useState([]);
  const [freeAccounts, setFreeAccounts] = reactExports.useState([]);
  const [freeChallenge, setFreeChallenge] = reactExports.useState(null);
  const [clicks, setClicks] = reactExports.useState(0);
  const [signups, setSignups] = reactExports.useState(0);
  const [buyerEmails, setBuyerEmails] = reactExports.useState({});
  const [buyerNames, setBuyerNames] = reactExports.useState({});
  const [pendingReserved, setPendingReserved] = reactExports.useState(0);
  const [amount, setAmount] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [claiming, setClaiming] = reactExports.useState(false);
  const [banks, setBanks] = reactExports.useState([]);
  const [kycVerified, setKycVerified] = reactExports.useState(!!profile?.kyc_verified);
  const [kycDocUploading, setKycDocUploading] = reactExports.useState(false);
  const [kycDocFile, setKycDocFile] = reactExports.useState(null);
  const [bankAccountNumber, setBankAccountNumber] = reactExports.useState(profile?.bank_account_number ?? "");
  const [bankName, setBankName] = reactExports.useState(profile?.bank_name ?? "");
  const [bankAccountName, setBankAccountName] = reactExports.useState(profile?.bank_account_name ?? "");
  const [bankCode, setBankCode] = reactExports.useState("");
  const [verifyingKyc, setVerifyingKyc] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  const load = async () => {
    if (!user) return;
    const [profRes, refRes, payRes, clickRes, signupRes, freeRes] = await Promise.all([supabase.from("partner_profiles").select("promo_code,commission_rate,total_earned_naira,total_paid_naira,is_active,free_account_challenge_id").eq("user_id", user.id).maybeSingle(), supabase.from("partner_referrals").select("*").eq("partner_id", user.id).order("created_at", {
      ascending: false
    }), supabase.from("partner_payouts").select("*").eq("partner_id", user.id).order("requested_at", {
      ascending: false
    }), supabase.from("partner_clicks").select("*", {
      count: "exact",
      head: true
    }).eq("partner_id", user.id), supabase.from("profiles").select("*", {
      count: "exact",
      head: true
    }).eq("partner_referred_by", user.id), supabase.from("partner_free_accounts").select("*, challenges(name, account_size, currency)").eq("partner_id", user.id).order("requested_at", {
      ascending: false
    })]);
    const refList = refRes.data ?? [];
    const partnerData = profRes.data ?? null;
    setPp(partnerData);
    setReferrals(refList);
    const list = payRes.data ?? [];
    setPayouts(list);
    setPendingReserved(list.filter((x) => ["pending", "approved"].includes(x.status)).reduce((s, x) => s + Number(x.amount_naira), 0));
    setFreeAccounts(freeRes.data ?? []);
    setClicks(clickRes.count ?? 0);
    setSignups(signupRes.count ?? 0);
    if (partnerData?.free_account_challenge_id) {
      const {
        data: ch
      } = await supabase.from("challenges").select("id, name, account_size, currency").eq("id", partnerData.free_account_challenge_id).maybeSingle();
      setFreeChallenge(ch ?? null);
    } else {
      setFreeChallenge(null);
    }
    const {
      data: sess
    } = await supabase.auth.getSession();
    if (sess.session && refList.length > 0) {
      const uids = [...new Set(refList.map((r) => r.referred_user_id))];
      const res = await getBuyerInfo({
        accessToken: sess.session.access_token,
        userIds: uids
      });
      if (res.ok) {
        setBuyerEmails(res.emails);
        setBuyerNames(res.names);
      }
    }
    setLoading(false);
  };
  reactExports.useEffect(() => {
    load();
    listNigerianBanks().then((res) => {
      if (res.ok && Array.isArray(res.banks)) setBanks(res.banks);
    });
  }, [user]);
  const verifyBankWithPaystack = async () => {
    const acct = bankAccountNumber.replace(/\s+/g, "");
    if (!/^\d{10}$/.test(acct)) return toast.error("Account number must be 10 digits.");
    if (!bankCode) return toast.error("Select your bank.");
    const {
      data: sess
    } = await supabase.auth.getSession();
    if (!sess.session) return toast.error("Please sign in again.");
    const bank = banks.find((b) => b.code === bankCode);
    setVerifyingKyc(true);
    try {
      const res = await verifyKycPaystack({
        data: {
          accessToken: sess.session.access_token,
          accountNumber: acct,
          bankCode,
          bankName: bank?.name ?? bankName.trim() ?? ""
        }
      });
      if (!res.ok) return toast.error(res.error);
      setKycVerified(true);
      setBankAccountNumber(acct);
      setBankName(bank?.name ?? bankName.trim() ?? "");
      setBankAccountName(res.accountName ?? "");
      toast.success(`Verified · ${res.accountName}`);
      await refresh();
    } finally {
      setVerifyingKyc(false);
    }
  };
  if (!loading && !pp) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 py-16 text-center md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold", children: "Partner Program" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "You don't have a partner profile yet. Reach out to admin to be onboarded." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-6", onClick: () => navigate({
        to: "/dashboard"
      }), children: "Back to Dashboard" })
    ] });
  }
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const refLink = pp ? `${origin}/?ref=${pp.promo_code}` : "";
  const copy = async (text, label = "Copied!") => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(label);
    } catch {
      toast.error("Copy failed");
    }
  };
  const share = async () => {
    if (!refLink) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join FundedNG",
          text: "Get funded to trade",
          url: refLink
        });
        return;
      } catch {
      }
    }
    copy(refLink, "Partner link copied!");
  };
  const lastRequest = payouts.find((p) => ["pending", "approved", "paid"].includes(p.status));
  const cooldownEnds = lastRequest ? new Date(lastRequest.requested_at).getTime() + 7 * 24 * 60 * 60 * 1e3 : 0;
  const cooldownActive = cooldownEnds > Date.now();
  const daysLeft = cooldownActive ? Math.ceil((cooldownEnds - Date.now()) / (24 * 60 * 60 * 1e3)) : 0;
  const balance = pp ? pp.total_earned_naira - pp.total_paid_naira - pendingReserved : 0;
  const purchases = referrals.length;
  const uploadKycDocument = async () => {
    if (!kycDocFile) return toast.error("Select a file first");
    if (kycDocFile.size > 5 * 1024 * 1024) return toast.error("File must be under 5MB");
    const {
      data: sess
    } = await supabase.auth.getSession();
    if (!sess.session) return toast.error("Please sign in again.");
    setKycDocUploading(true);
    try {
      const ext = kycDocFile.name.split(".").pop() ?? "jpg";
      const path = `${sess.session.user.id}/${Date.now()}.${ext}`;
      const {
        error: uploadErr
      } = await supabase.storage.from("kyc-documents").upload(path, kycDocFile, {
        contentType: kycDocFile.type
      });
      if (uploadErr) {
        toast.error(uploadErr.message);
        return;
      }
      const {
        data: urlData
      } = await supabase.storage.from("kyc-documents").createSignedUrl(path, 604800);
      if (!urlData?.signedUrl) {
        toast.error("Failed to get document URL");
        return;
      }
      const docType = kycDocFile.type.startsWith("image/") ? "Image" : "PDF";
      const {
        error: updErr
      } = await supabase.from("profiles").update({
        kyc_document_url: urlData.signedUrl,
        kyc_document_type: docType
      }).eq("id", sess.session.user.id);
      if (updErr) {
        toast.error(updErr.message);
        return;
      }
      toast.success("KYC document uploaded. Admin will review it.");
      setKycDocFile(null);
      await load();
    } catch (e) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setKycDocUploading(false);
    }
  };
  const claimFreeAccount = async () => {
    if (freeAccounts.length > 0) return toast.error("You've already requested your free partnership account.");
    setClaiming(true);
    const {
      error
    } = await supabase.rpc("claim_partner_free_account");
    setClaiming(false);
    if (error) return toast.error(error.message);
    toast.success("Free partnership account requested. Admin will deliver your MT5 credentials.");
    load();
  };
  const requestPayout = async () => {
    const amt = Number(amount.replace(/[^0-9]/g, ""));
    if (!amt || amt < 5e3) return toast.error("Minimum payout is ₦5,000");
    if (amt > balance) return toast.error("Amount exceeds available balance");
    if (!kycVerified) return toast.error("Verify your bank account above first.");
    setSubmitting(true);
    const {
      error
    } = await supabase.rpc("request_partner_payout", {
      _amount: amt
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Payout requested.");
    setAmount("");
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-8 md:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold", children: "Partner Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Earn ",
          pp?.commission_rate ?? 20,
          "% on every sale through your link."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshButton, { onRefresh: async () => {
        await load();
        toast.success("Updated");
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-primary/40 bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-sm font-semibold text-primary", children: "YOUR PARTNER LINK" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-col gap-2 sm:flex-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { readOnly: true, value: refLink, className: "flex-1 font-mono text-xs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => copy(refLink, "Link copied!"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "mr-1 h-4 w-4" }),
            "Copy"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: share, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "mr-1 h-4 w-4" }),
            "Share"
          ] })
        ] })
      ] }),
      pp && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-xs text-muted-foreground", children: [
        "Promo code: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-foreground", children: pp.promo_code }),
        " · ",
        "Buyer discount: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: "15%" }),
        " · ",
        "Commission rate: ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
          pp.commission_rate,
          "%"
        ] })
      ] })
    ] }),
    (freeChallenge || freeAccounts.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl border border-gold/40 bg-gold/5 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-base font-bold", children: [
            "🎁 Free ",
            freeChallenge?.name ?? "Partnership",
            " Account"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
            "After 5 referral purchases, you unlock a free ",
            freeChallenge ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              freeChallenge.name,
              " (",
              freeChallenge.currency === "USD" ? "$" : "₦",
              Number(freeChallenge.account_size).toLocaleString(),
              ")"
            ] }) : "partnership",
            " challenge account. You have ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
              purchases,
              "/5"
            ] }),
            " purchases."
          ] })
        ] }),
        freeAccounts.length === 0 ? purchases >= 5 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: claimFreeAccount, disabled: claiming, className: "font-display", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "mr-1 h-4 w-4" }),
          claiming ? "Requesting..." : "Request Account"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: true, className: "font-display opacity-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "mr-1 h-4 w-4" }),
            "Request Account"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
            5 - purchases,
            " more purchase(s) needed"
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "capitalize", children: freeAccounts[0].status })
      ] }),
      freeAccounts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 rounded-md border border-border bg-background p-3 text-sm", children: freeAccounts[0].status === "fulfilled" && freeAccounts[0].mt5_login ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground", children: [
          freeAccounts[0].challenges?.name ?? freeAccounts[0].challenge_name ?? "Challenge",
          " (",
          freeAccounts[0].challenges?.currency === "USD" ? "$" : "₦",
          Number(freeAccounts[0].challenges?.account_size ?? freeAccounts[0].account_size).toLocaleString(),
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1 font-mono text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Login: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: freeAccounts[0].mt5_login })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Server: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: freeAccounts[0].mt5_server })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Password: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: freeAccounts[0].mt5_password })
          ] }),
          freeAccounts[0].investor_password && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Investor pw: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: freeAccounts[0].investor_password })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "Your request for a free ",
        freeAccounts[0]?.challenges?.name ?? freeAccounts[0]?.challenge_name ?? "partnership",
        " account is with admin. MT5 credentials will appear here after delivery."
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `mt-6 rounded-2xl border p-6 ${kycVerified ? "border-primary/30 bg-primary/5" : "border-warning/40 bg-warning/5"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display flex items-center gap-2 text-base font-semibold", children: [
            kycVerified ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-4 w-4 text-warning" }),
            "Payout Bank Account"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Verify your bank account via Paystack to receive payouts. The account name must match your profile name." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `font-display ${kycVerified ? "bg-primary/15 text-primary border-primary/30" : "bg-warning/15 text-warning border-warning/30"}`, children: kycVerified ? "VERIFIED" : "PENDING" })
      ] }),
      kycVerified ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-md border border-border bg-background p-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: "Verified bank account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display mt-1 text-primary break-words", children: [
          bankAccountNumber,
          " · ",
          bankName,
          " · ",
          bankAccountName
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[11px] text-muted-foreground", children: "Need to change it? Re-verify with new details — KYC will reset until the new account passes." })
      ] }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid gap-3 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "partner-bank-acct", children: "Account number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "partner-bank-acct", inputMode: "numeric", maxLength: 10, placeholder: "10-digit NUBAN", className: "mt-1 font-mono", value: bankAccountNumber, onChange: (e) => setBankAccountNumber(e.target.value.replace(/\D/g, "")) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "partner-bank-select", children: "Bank" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: bankCode, onValueChange: (v) => {
            setBankCode(v);
            setBankName(banks.find((b) => b.code === v)?.name ?? "");
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "partner-bank-select", className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: banks.length ? "Select your bank" : "Loading banks…" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-72", children: banks.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: b.code, children: b.name }, b.code)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-[11px] text-muted-foreground", children: [
        "We'll fetch the registered account name from your bank and approve KYC instantly if it matches your profile name (",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-foreground", children: profile?.full_name || "—" }),
        ")."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "mt-4 font-display", onClick: verifyBankWithPaystack, disabled: verifyingKyc || !bankCode || bankAccountNumber.length !== 10, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Landmark, { className: "mr-1 h-4 w-4" }),
        verifyingKyc ? "Verifying…" : kycVerified ? "Re-verify bank" : "Verify bank account"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-xl border border-border bg-card p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-sm font-semibold", children: "KYC Document Upload" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "For USD accounts or as an alternative to bank verification, upload a valid government-issued ID or passport. Max 5MB (PNG, JPG, PDF)." }),
      profile?.kyc_document_url && !kycVerified ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-amber-500", children: "Document submitted — " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "awaiting admin review. Check back later." })
      ] }) : null,
      !kycVerified && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-col gap-2 sm:flex-row sm:items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "file", accept: "image/png,image/jpeg,image/jpg,image/webp,application/pdf", onChange: (e) => setKycDocFile(e.target.files?.[0] ?? null), className: "file:mr-2 file:rounded file:border-0 file:bg-primary/10 file:px-2 file:py-1 file:text-xs file:font-medium file:text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: uploadKycDocument, disabled: kycDocUploading || !kycDocFile, children: kycDocUploading ? "Uploading…" : "Upload document" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: MousePointerClick, label: "Clicks", value: clicks.toString() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Users, label: "Signups", value: signups.toString(), sub: `${purchases} purchases` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Percent, label: "Total earned", value: formatNaira(pp?.total_earned_naira ?? 0), sub: `Paid: ${formatNaira(pp?.total_paid_naira ?? 0)}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Wallet, label: "Available", value: formatNaira(Math.max(0, balance)), sub: "Min ₦5,000" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base font-bold", children: "Request a Payout" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Minimum ₦5,000 · one request per 7 days · processed within 24hrs of admin approval." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-col gap-2 sm:flex-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", inputMode: "numeric", placeholder: `Up to ${formatNaira(Math.max(0, balance))}`, value: amount, onChange: (e) => setAmount(e.target.value), className: "flex-1", disabled: cooldownActive }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: requestPayout, disabled: submitting || balance < 5e3 || cooldownActive || !kycVerified, className: "font-display", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "mr-1 h-4 w-4" }),
          submitting ? "Requesting..." : "Request Payout"
        ] })
      ] }),
      cooldownActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-amber-500", children: [
        "You can request your next payout in ",
        daysLeft,
        " day",
        daysLeft === 1 ? "" : "s",
        "."
      ] }),
      !cooldownActive && balance < 5e3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-muted-foreground", children: [
        "You need at least ",
        formatNaira(5e3),
        " available balance to request a payout."
      ] }),
      !kycVerified ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-amber-500", children: "Verify your bank account above to enable payouts." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-green-500", children: "Bank account verified. You can now request payouts." }),
        bankAccountNumber && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 rounded-md border border-border bg-background p-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Payout destination: " }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-foreground", children: [
            bankAccountNumber,
            " · ",
            bankName,
            " · ",
            bankAccountName
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base font-bold", children: "Recent Purchases" }),
      referrals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "No purchases yet. Share your link to start earning." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 divide-y divide-border", children: referrals.slice(0, 15).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: new Date(r.created_at).toLocaleDateString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground/70", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3 w-3" }),
            buyerEmails[r.referred_user_id] ?? "—",
            buyerNames[r.referred_user_id] && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground/50", children: [
              "· ",
              buyerNames[r.referred_user_id]
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Sale: ",
            formatNaira(r.amount_paid_naira)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-semibold text-primary", children: [
            "+",
            formatNaira(r.commission_amount_naira)
          ] })
        ] })
      ] }, r.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base font-bold", children: "Payout History" }),
      payouts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "No payouts yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 divide-y divide-border", children: payouts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: new Date(p.requested_at).toLocaleDateString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "capitalize", children: p.status }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold", children: formatNaira(p.amount_naira) })
        ] })
      ] }, p.id)) })
    ] })
  ] });
}
function Stat({
  icon: Icon,
  label,
  value,
  sub
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
      " ",
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display mt-2 text-2xl font-bold", children: value }),
    sub && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[11px] text-muted-foreground", children: sub })
  ] });
}
export {
  PartnerPage as component
};
