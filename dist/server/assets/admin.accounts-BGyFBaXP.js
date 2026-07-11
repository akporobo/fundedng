import { r as reactExports, V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAdminData } from "./useAdminData-BK4UWKTz.js";
import { s as supabase } from "./router-DudJYIfW.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { B as Badge } from "./badge-Drtmlf7I.js";
import { I as Input } from "./input-Cg1AgxSs.js";
import { L as Label } from "./label-BvHzfEVS.js";
import { b as formatUSD, a as formatNaira } from "./utils-vYOMvTwc.js";
import { C as CertificateCard } from "./CertificateCard-CdYnQtt5.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-CVXx6z81.js";
import { T as Textarea } from "./textarea-DHbGpYnD.js";
import { E as Eye } from "./eye-CKk5fOHO.js";
import { D as Download } from "./download-C5vXGTlG.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./kyc.functions-Ddgzg7nS.js";
import "./client.server-B4evwzKW.js";
import "./notify-email-fIZWdIiB.js";
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
import "./chevron-right-CVZD1doD.js";
import "./createLucideIcon-DQobbSW9.js";
import "./check-CNUFRDbJ.js";
import "./x-CGo4OehW.js";
function AccountsPage() {
  const {
    accounts,
    payouts,
    equityDraft,
    equitySaving,
    setEquityDraft,
    submitEquity,
    kycTarget,
    kycVerifying,
    kycRejectReason,
    kycRejecting,
    setKycTarget,
    setKycRejectReason,
    openKycVerify,
    submitKycVerify,
    submitKycReject,
    breachTarget,
    breachReason,
    breaching,
    breachType,
    setBreachType,
    breachPair,
    setBreachPair,
    breachOpenTime,
    setBreachOpenTime,
    breachCloseTime,
    setBreachCloseTime,
    breachDuration,
    setBreachDuration,
    setBreachTarget,
    setBreachReason,
    openBreachDialog,
    submitBreach,
    warnTarget,
    warnReason,
    warning,
    warnType,
    setWarnType,
    warnPair,
    setWarnPair,
    warnOpenTime,
    setWarnOpenTime,
    warnCloseTime,
    setWarnCloseTime,
    warnDuration,
    setWarnDuration,
    setWarnTarget,
    setWarnReason,
    openWarningDialog,
    submitWarning,
    rejectTarget,
    rejectReason,
    rejecting,
    rejectType,
    setRejectTarget,
    setRejectReason,
    setRejectType,
    openRejectDialog,
    submitRejectPhase,
    approvePhase2,
    approveFunded,
    viewCredsFor,
    setViewCredsFor,
    updateAccount,
    resetAccountBalance
  } = useAdminData();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const [credDraft, setCredDraft] = reactExports.useState({});
  const [credSaving, setCredSaving] = reactExports.useState(null);
  const [certTarget, setCertTarget] = reactExports.useState(null);
  const [certLoading, setCertLoading] = reactExports.useState(null);
  const payoutAccountIds = reactExports.useMemo(() => new Set(payouts.filter((p) => p.trader_account_id).map((p) => p.trader_account_id)), [payouts]);
  async function openFundedCertificate(account) {
    setCertLoading(account.id);
    try {
      const {
        data
      } = await supabase.from("certificates").select("*").eq("trader_account_id", account.id).eq("kind", "funded").order("issued_at", {
        ascending: false
      }).limit(1).maybeSingle();
      if (data) {
        setCertTarget(data);
      } else {
        setCertTarget({
          id: account.id,
          kind: "funded",
          certificate_number: `FNG-FND-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          full_name: account.profiles?.full_name ?? "Trader",
          account_size: account.starting_balance,
          challenge_name: account.challenges?.name ?? "Challenge",
          mt5_login: account.mt5_login ?? "",
          payout_amount: null,
          issued_at: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    } catch {
      setCertTarget({
        id: account.id,
        kind: "funded",
        certificate_number: `FNG-FND-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        full_name: account.profiles?.full_name ?? "Trader",
        account_size: account.starting_balance,
        challenge_name: account.challenges?.name ?? "Challenge",
        mt5_login: account.mt5_login ?? "",
        payout_amount: null,
        issued_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    } finally {
      setCertLoading(null);
    }
  }
  const tabs = [{
    id: "all",
    label: "All"
  }, {
    id: "phase1",
    label: "Phase 1"
  }, {
    id: "phase2",
    label: "Phase 2"
  }, {
    id: "funded",
    label: "Funded"
  }, {
    id: "archived",
    label: "Archived"
  }, {
    id: "has_payout",
    label: "Has Payout"
  }];
  function getBreachReason(type, pair, openTime, closeTime, duration, name) {
    switch (type) {
      case "inactivity":
        return `Hi ${name}, your FundedNG challenge account has been closed due to inactivity. Our rules require at least 1 trade every calendar week to keep your account active. Unfortunately no trading activity was detected on your account within the required period.
You're welcome to start a new challenge anytime at fundedng.fun 💪
— FundedNG Team`;
      case "drawdown":
        return `Hi ${name}, your FundedNG challenge account has been closed due to exceeding the maximum allowed drawdown.
You're welcome to start a new challenge anytime at fundedng.fun 💪
— FundedNG Team`;
      case "scalping":
        return `Hi ${name}, your FundedNG challenge account has been closed due to a scalping violation.
Trade Details:
Pair: ${pair || "—"}
Open: ${openTime || "—"}
Close: ${closeTime || "—"}
Duration: ${duration || "—"}
Our rules require ALL trades to be held for a minimum of 3 minutes (180 seconds) regardless of how they are closed. You get 3 warnings, then the 4th short-held trade breaches your account. Two short trades at the same time is an instant breach.
You're welcome to start a new challenge anytime at fundedng.fun 💪
— FundedNG Team`;
      default:
        return "";
    }
  }
  function getWarnReason(type, pair, openTime, closeTime, duration, name) {
    switch (type) {
      case "inactivity":
        return `Hi ${name}, your FundedNG challenge account is at risk of being closed due to inactivity. Our rules require at least 1 trade every calendar week to keep your account active. Please place a trade to keep your account active.
— FundedNG Team`;
      case "drawdown":
        return `Hi ${name}, your FundedNG challenge account has received a warning for exceeding the maximum allowed drawdown. Please manage your risk carefully.
— FundedNG Team`;
      case "scalping":
        return `Hi ${name}, your FundedNG challenge account has received a warning for scalping.
Trade Details:
Pair: ${pair || "—"}
Open: ${openTime || "—"}
Close: ${closeTime || "—"}
Duration: ${duration || "—"}
Our rules require ALL trades to be held for a minimum of 3 minutes (180 seconds) regardless of close type. You have a 3-warning grace allowance — the 4th short-held trade will breach your account. Two short trades at the same time is an instant breach.
— FundedNG Team`;
      default:
        return "";
    }
  }
  const breachTypes = [{
    value: "inactivity",
    label: "Inactivity"
  }, {
    value: "scalping",
    label: "Scalping"
  }, {
    value: "drawdown",
    label: "Drawdown Exceeded"
  }];
  const warnTypes = [{
    value: "inactivity",
    label: "Inactivity"
  }, {
    value: "scalping",
    label: "Scalping"
  }, {
    value: "drawdown",
    label: "Drawdown Exceeded"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Trader Accounts" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: tabs.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveTab(t.id), className: `rounded-md px-3 py-1 text-sm font-medium transition-colors ${activeTab === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`, children: t.label }, t.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by MT5 login or trader name…", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "h-9 w-full max-w-md" }),
    accounts.filter((a) => {
      if (activeTab === "phase1") return a.current_phase === 1 && a.status === "active";
      if (activeTab === "phase2") return a.current_phase === 2 && a.status === "active";
      if (activeTab === "funded") return a.status === "funded";
      if (activeTab === "archived") return a.status === "breached";
      if (activeTab === "has_payout") return payoutAccountIds.has(a.id);
      return true;
    }).filter((a) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      return (a.mt5_login ?? "").toLowerCase().includes(q) || (a.profiles?.full_name ?? "").toLowerCase().includes(q);
    }).map((a) => {
      const fmt = a.currency === "USD" ? formatUSD : formatNaira;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[180px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: a.profiles?.full_name ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                a.challenges?.name,
                " · login ",
                a.mt5_login,
                " ",
                a.currency === "USD" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "ml-1 border-blue-400/40 text-blue-500 text-[10px]", children: "USD" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: fmt(a.starting_balance) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-sm text-gold", children: [
              "Phase ",
              a.current_phase
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-display", children: a.status.toUpperCase() })
          ] }),
          (() => {
            const eq = Number(a.current_equity ?? a.starting_balance);
            const st = Number(a.starting_balance);
            const pk = Number(a.peak_equity ?? a.starting_balance);
            const profitPct = st > 0 ? (eq - st) / st * 100 : 0;
            const ddPct = pk > 0 ? Math.max(0, (pk - eq) / pk * 100) : 0;
            const maxDD = Number(a.challenges?.max_drawdown_percent ?? 20);
            const ddColor = ddPct / maxDD > 0.75 ? "text-red-500" : ddPct / maxDD > 0.5 ? "text-amber-500" : "text-green-500";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                "Equity: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-primary", children: fmt(eq) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                "P/L: ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-display ${profitPct >= 0 ? "text-green-500" : "text-red-500"}`, children: [
                  profitPct >= 0 ? "+" : "",
                  profitPct.toFixed(2),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                "Drawdown: ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-display ${ddColor}`, children: [
                  ddPct.toFixed(2),
                  "%"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground/60", children: [
                  " / ",
                  maxDD,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                "Peak: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display", children: fmt(pk) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                "DD Limit: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-red-500", children: fmt(Math.floor(pk * (1 - maxDD / 100))) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                "Days traded: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display", children: a.trading_days ?? 0 })
              ] }),
              a.last_synced_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground/60", children: [
                "Synced: ",
                new Date(a.last_synced_at).toLocaleString()
              ] })
            ] });
          })(),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap gap-1", children: [
            (() => {
              if (a.current_phase >= 2 || a.status !== "active") return null;
              const target = Number(a.challenges?.profit_target_percent ?? 10);
              const equity = Number(a.current_equity ?? a.starting_balance);
              const required = Number(a.starting_balance) * (1 + target / 100);
              const hit = equity >= required;
              const requested = !!a.phase2_requested_at;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                requested && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-display border-warning/40 text-warning", children: "PHASE 2 REQUESTED" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "destructive", onClick: () => openRejectDialog(a, "phase2"), children: "Reject" })
                ] }),
                hit ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => approvePhase2(a), children: "Phase 1 passed → Approve Phase 2" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground", children: [
                  "Needs ",
                  fmt(Math.ceil(required)),
                  " equity (",
                  target,
                  "% target)"
                ] })
              ] });
            })(),
            a.current_phase >= 2 && a.status === "active" && (() => {
              const target = Number(a.challenges?.phase2_profit_target_percent ?? a.challenges?.profit_target_percent ?? 10);
              const equity = Number(a.current_equity ?? a.starting_balance);
              const required = Number(a.starting_balance) * (1 + target / 100);
              const hit = equity >= required;
              const requested = !!a.funded_requested_at;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                requested && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-display border-warning/40 text-warning", children: "FUNDED REQUESTED" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "destructive", onClick: () => openRejectDialog(a, "funded"), children: "Reject" })
                ] }),
                hit ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => approveFunded(a), children: "Phase 2 passed → Approve Funded" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground", children: [
                  "Needs ",
                  fmt(Math.ceil(required)),
                  " equity (",
                  target,
                  "% target)"
                ] })
              ] });
            })(),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => openWarningDialog(a), children: "Warning" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => openBreachDialog(a), children: "Breach" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "text-muted-foreground hover:text-foreground", onClick: () => {
              setViewCredsFor(a);
              setCredDraft((d) => ({
                ...d,
                [a.id]: {
                  mt5_login: a.mt5_login ?? "",
                  mt5_server: a.mt5_server ?? "",
                  mt5_password: a.mt5_password ?? "",
                  investor_password: a.investor_password ?? ""
                }
              }));
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "mr-1 h-3.5 w-3.5" }),
              "Credentials"
            ] }),
            a.status === "funded" && payoutAccountIds.has(a.id) && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => resetAccountBalance(a), children: "Reset Balance" }),
            a.status === "funded" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-8 w-8 p-0", disabled: certLoading === a.id, onClick: () => openFundedCertificate(a), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap items-end gap-2 rounded-md border border-border bg-background p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[200px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `eq-${a.id}`, className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: "Update equity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: `eq-${a.id}`, type: "number", inputMode: "decimal", placeholder: `Current: ${a.current_equity ?? a.starting_balance}`, value: equityDraft[a.id] ?? "", onChange: (e) => setEquityDraft((d) => ({
              ...d,
              [a.id]: e.target.value
            })), onKeyDown: (e) => {
              if (e.key === "Enter") submitEquity(a);
            }, className: "mt-1 h-9" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => submitEquity(a), children: "Save" })
        ] }),
        a.profiles && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-background p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "KYC:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `font-display text-[10px] ${a.profiles.kyc_verified ? "border-green-500/50 text-green-500" : "border-amber-500/50 text-amber-500"}`, children: a.profiles?.kyc_verified ? "VERIFIED" : "PENDING" }),
          !a.profiles?.kyc_verified && a.profiles?.bank_account_number && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => openKycVerify(a), children: "Verify bank" }),
          !a.profiles?.kyc_verified && a.profiles?.kyc_document_url && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => openKycVerify(a), children: "Review document" }),
          a.profiles?.kyc_document_url && !a.profiles?.kyc_verified && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-blue-500/50 text-blue-500 text-[10px]", children: "DOCUMENT SUBMITTED" })
        ] }) })
      ] }, a.id);
    }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!viewCredsFor, onOpenChange: (o) => {
      if (!o) {
        setViewCredsFor(null);
        setCredDraft({});
      }
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "MT5 Credentials" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Edit the MT5 login, server, and passwords below." })
      ] }),
      viewCredsFor && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Login" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: credDraft[viewCredsFor.id]?.mt5_login ?? "", onChange: (e) => setCredDraft((d) => ({
            ...d,
            [viewCredsFor.id]: {
              ...d[viewCredsFor.id],
              mt5_login: e.target.value
            }
          })), className: "h-9 font-mono text-sm" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Server" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: credDraft[viewCredsFor.id]?.mt5_server ?? "", onChange: (e) => setCredDraft((d) => ({
            ...d,
            [viewCredsFor.id]: {
              ...d[viewCredsFor.id],
              mt5_server: e.target.value
            }
          })), className: "h-9 font-mono text-sm" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Master Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: credDraft[viewCredsFor.id]?.mt5_password ?? "", onChange: (e) => setCredDraft((d) => ({
            ...d,
            [viewCredsFor.id]: {
              ...d[viewCredsFor.id],
              mt5_password: e.target.value
            }
          })), className: "h-9 font-mono text-sm" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Investor Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: credDraft[viewCredsFor.id]?.investor_password ?? "", onChange: (e) => setCredDraft((d) => ({
            ...d,
            [viewCredsFor.id]: {
              ...d[viewCredsFor.id],
              investor_password: e.target.value
            }
          })), className: "h-9 font-mono text-sm" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => {
          setViewCredsFor(null);
          setCredDraft({});
        }, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
          if (!viewCredsFor) return;
          const draft = credDraft[viewCredsFor.id];
          if (!draft) return;
          setCredSaving(viewCredsFor.id);
          await updateAccount(viewCredsFor.id, {
            mt5_login: draft.mt5_login,
            mt5_server: draft.mt5_server,
            mt5_password: draft.mt5_password,
            investor_password: draft.investor_password || null
          });
          setCredSaving(null);
          setViewCredsFor(null);
          setCredDraft({});
        }, disabled: credSaving === viewCredsFor?.id, children: credSaving === viewCredsFor?.id ? "Saving…" : "Save" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!kycTarget, onOpenChange: (o) => {
      if (!o && !kycVerifying && !kycRejecting) {
        setKycTarget(null);
        setKycRejectReason("");
      }
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Verify trader KYC" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Review the trader's KYC information below." })
      ] }),
      kycTarget && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 rounded-lg border border-border bg-muted/30 p-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: "Trader" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-semibold", children: kycTarget.profiles?.full_name ?? "—" })
        ] }),
        kycTarget.profiles?.kyc_document_url ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: "KYC Document" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1", children: [
            kycTarget.profiles.kyc_document_type && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mb-1", children: [
              "Type: ",
              kycTarget.profiles.kyc_document_type
            ] }),
            kycTarget.profiles.kyc_document_url.match(/\.(png|jpe?g|webp)$/i) ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: kycTarget.profiles.kyc_document_url, alt: "KYC document", className: "max-h-64 rounded border border-border object-contain" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: kycTarget.profiles.kyc_document_url, target: "_blank", rel: "noreferrer", className: "text-primary underline underline-offset-2 text-xs", children: "View document (PDF)" })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: "Account number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-base text-primary", children: kycTarget.profiles?.bank_account_number ?? "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: "Bank" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: kycTarget.profiles?.bank_name ?? "—" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: "Account name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: kycTarget.profiles?.bank_account_name ?? "—" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          "MT5 login: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: kycTarget.mt5_login })
        ] }),
        kycTarget.profiles?.kyc_document_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: "Rejection reason" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Reason for rejection (required to reject)", value: kycRejectReason, onChange: (e) => setKycRejectReason(e.target.value), rows: 2 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: kycTarget?.profiles?.kyc_document_url ? "justify-between" : "", children: kycTarget?.profiles?.kyc_document_url ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: submitKycReject, disabled: kycRejecting || !kycRejectReason.trim(), children: kycRejecting ? "Rejecting…" : "Reject" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => {
            setKycTarget(null);
            setKycRejectReason("");
          }, disabled: kycVerifying || kycRejecting, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submitKycVerify, disabled: kycVerifying, children: kycVerifying ? "Verifying…" : "Verify KYC" })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setKycTarget(null), disabled: kycVerifying, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submitKycVerify, disabled: kycVerifying, children: kycVerifying ? "Verifying…" : "Verify KYC" })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!breachTarget, onOpenChange: (o) => !breaching && !o && setBreachTarget(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "mx-4 w-[calc(100%-2rem)] max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Breach Account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Breaching account for ",
          breachTarget?.profiles?.full_name ?? "trader",
          " (",
          breachTarget?.mt5_login,
          ")."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Breach type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: breachTypes.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: breachType === t.value ? "default" : "outline", onClick: () => {
            setBreachType(t.value);
            setBreachPair("");
            setBreachOpenTime("");
            setBreachCloseTime("");
            setBreachDuration("");
            setBreachReason(getBreachReason(t.value, "", "", "", "", breachTarget?.profiles?.full_name ?? "Trader"));
          }, children: t.label }, t.value)) })
        ] }),
        breachType === "scalping" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Trading Pair" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. EURUSDm", value: breachPair, onChange: (e) => {
              setBreachPair(e.target.value);
              setBreachReason(getBreachReason(breachType, e.target.value, breachOpenTime, breachCloseTime, breachDuration, breachTarget?.profiles?.full_name ?? "Trader"));
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Open Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. 2026-06-08 23:41:00", value: breachOpenTime, onChange: (e) => {
              setBreachOpenTime(e.target.value);
              setBreachReason(getBreachReason(breachType, breachPair, e.target.value, breachCloseTime, breachDuration, breachTarget?.profiles?.full_name ?? "Trader"));
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Close Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. 2026-06-08 23:41:32", value: breachCloseTime, onChange: (e) => {
              setBreachCloseTime(e.target.value);
              setBreachReason(getBreachReason(breachType, breachPair, breachOpenTime, e.target.value, breachDuration, breachTarget?.profiles?.full_name ?? "Trader"));
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Duration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. 32 seconds", value: breachDuration, onChange: (e) => {
              setBreachDuration(e.target.value);
              setBreachReason(getBreachReason(breachType, breachPair, breachOpenTime, breachCloseTime, e.target.value, breachTarget?.profiles?.full_name ?? "Trader"));
            } })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "breach-reason", children: "Reason for breach" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "breach-reason", placeholder: "Enter the reason for breaching this account...", value: breachReason, onChange: (e) => setBreachReason(e.target.value), rows: 3 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => {
          setBreachTarget(null);
          setBreachReason("");
        }, disabled: breaching, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: submitBreach, disabled: breaching || !breachReason.trim(), children: breaching ? "Breaching…" : "Breach Account" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!warnTarget, onOpenChange: (o) => !warning && !o && setWarnTarget(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "mx-4 w-[calc(100%-2rem)] max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Send Warning" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Send a warning to ",
          warnTarget?.profiles?.full_name ?? "trader",
          " (",
          warnTarget?.mt5_login,
          ")."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Warning type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: warnTypes.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: warnType === t.value ? "default" : "outline", onClick: () => {
            setWarnType(t.value);
            setWarnPair("");
            setWarnOpenTime("");
            setWarnCloseTime("");
            setWarnDuration("");
            setWarnReason(getWarnReason(t.value, "", "", "", "", warnTarget?.profiles?.full_name ?? "Trader"));
          }, children: t.label }, t.value)) })
        ] }),
        warnType === "scalping" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Trading Pair" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. EURUSDm", value: warnPair, onChange: (e) => {
              setWarnPair(e.target.value);
              setWarnReason(getWarnReason(warnType, e.target.value, warnOpenTime, warnCloseTime, warnDuration, warnTarget?.profiles?.full_name ?? "Trader"));
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Open Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. 2026-06-08 23:41:00", value: warnOpenTime, onChange: (e) => {
              setWarnOpenTime(e.target.value);
              setWarnReason(getWarnReason(warnType, warnPair, e.target.value, warnCloseTime, warnDuration, warnTarget?.profiles?.full_name ?? "Trader"));
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Close Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. 2026-06-08 23:41:32", value: warnCloseTime, onChange: (e) => {
              setWarnCloseTime(e.target.value);
              setWarnReason(getWarnReason(warnType, warnPair, warnOpenTime, e.target.value, warnDuration, warnTarget?.profiles?.full_name ?? "Trader"));
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Duration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. 32 seconds", value: warnDuration, onChange: (e) => {
              setWarnDuration(e.target.value);
              setWarnReason(getWarnReason(warnType, warnPair, warnOpenTime, warnCloseTime, e.target.value, warnTarget?.profiles?.full_name ?? "Trader"));
            } })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "warn-reason", children: "Warning message" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "warn-reason", placeholder: "Describe the concerning trading activity...", value: warnReason, onChange: (e) => setWarnReason(e.target.value), rows: 3 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => {
          setWarnTarget(null);
          setWarnReason("");
        }, disabled: warning, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "default", onClick: submitWarning, disabled: warning || !warnReason.trim(), children: warning ? "Sending…" : "Send Warning" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!rejectTarget, onOpenChange: (o) => !rejecting && !o && setRejectTarget(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "mx-4 w-[calc(100%-2rem)] max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
          "Reject ",
          rejectType === "phase2" ? "Phase 2" : "Funded",
          " Request"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Rejecting request for ",
          rejectTarget?.profiles?.full_name ?? "trader",
          " (",
          rejectTarget?.mt5_login,
          ")."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reject-reason", children: "Reason for rejection" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "reject-reason", placeholder: "Enter the reason for rejecting this request...", value: rejectReason, onChange: (e) => setRejectReason(e.target.value), rows: 4 })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => {
          setRejectTarget(null);
          setRejectReason("");
          setRejectType(null);
        }, disabled: rejecting, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: submitRejectPhase, disabled: rejecting || !rejectReason.trim(), children: rejecting ? "Rejecting…" : "Reject Request" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!certTarget, onOpenChange: (o) => {
      if (!o) setCertTarget(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Funded Certificate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Preview and download the same certificate traders see." })
      ] }),
      certTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(CertificateCard, { cert: certTarget })
    ] }) })
  ] });
}
export {
  AccountsPage as component
};
