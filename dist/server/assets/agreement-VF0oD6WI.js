import { V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { L as Link } from "./router-DudJYIfW.js";
import { P as PublicHeader } from "./PublicHeader-sTgvg8bT.js";
import { B as Brand } from "./Brand-DUbFz4ZD.js";
import { B as Badge } from "./badge-Drtmlf7I.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { c as createLucideIcon } from "./createLucideIcon-DQobbSW9.js";
import { S as ShieldCheck } from "./shield-check-CoWiH9kN.js";
import { T as TriangleAlert } from "./triangle-alert-CQOpTpD9.js";
import { W as Wallet } from "./wallet-C6DygIpk.js";
import { A as ArrowRight } from "./arrow-right-DLtychK9.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./client.server-B4evwzKW.js";
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
import "./ThemeToggle-DWCK5KFm.js";
import "./utils-vYOMvTwc.js";
import "./download-C5vXGTlG.js";
import "./x-CGo4OehW.js";
import "./menu-DSFmR6XS.js";
const __iconNode = [
  ["path", { d: "M15 12h-5", key: "r7krc0" }],
  ["path", { d: "M15 8h-5", key: "1khuty" }],
  ["path", { d: "M19 17V5a2 2 0 0 0-2-2H4", key: "zz82l3" }],
  [
    "path",
    {
      d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",
      key: "1ph1d7"
    }
  ]
];
const ScrollText = createLucideIcon("scroll-text", __iconNode);
function Section({
  icon: Icon,
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-xl border border-border bg-card p-6 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-primary/30 bg-primary/10 p-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold md:text-2xl", children: title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground", children })
  ] });
}
function AgreementPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden border-b border-border bg-surface", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 gradient-radial-primary opacity-20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-4xl px-4 py-16 text-center md:px-6 md:py-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-display border-primary/40 text-primary", children: "LEGAL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display mt-4 text-4xl font-bold leading-tight md:text-5xl", children: [
          "Trader Agreement & ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary text-glow", children: "Risk Disclosure" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mx-auto mt-4 max-w-2xl text-muted-foreground", children: [
          "Last updated: ",
          (/* @__PURE__ */ new Date()).toLocaleDateString("en-NG", {
            year: "numeric",
            month: "long",
            day: "numeric"
          }),
          ". Please read these terms carefully before purchasing a challenge."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl space-y-5 px-4 py-12 md:px-6 md:py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { icon: ScrollText, title: "1. About FundedNG", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: `FundedNG ("we", "us", "our") is a Nigerian proprietary trading evaluation platform. We provide MT5 evaluation accounts on the FundedNG server and assess traders' performance against published rules. Successful traders receive payouts denominated in Naira from our company funds, calculated as a percentage of the evaluation profits achieved.` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "FundedNG is not a broker, not a deposit-taking institution, and does not execute live market orders on behalf of users." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { icon: ShieldCheck, title: "2. Trader Agreement", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "By purchasing a challenge you agree to trade only on the MT5 evaluation account provisioned by FundedNG, to follow all published rules (see",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/rules", className: "text-primary hover:underline", children: "/rules" }),
          "), and to refrain from any prohibited strategies including but not limited to tick scalping (closing trades in less than 3 minutes regardless of close type — 3 warnings then breach on 4th), cross-account hedging, copy trading from a third party, undisclosed expert advisors, any form of price manipulation, and creating or using multiple accounts to participate in free giveaway challenges or promotions."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "You agree that the challenge fee is a one-time service fee for the evaluation and is non-refundable once the MT5 account credentials have been delivered. If we are unable to deliver an account within 24 hours of payment, you are entitled to a full refund." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "You agree that all payouts are processed only to the bank account on file with KYC-verified details that match your registered name. We reserve the right to delay or decline a payout if the rules were breached, if KYC is incomplete, or if there is a reasonable suspicion of fraud, account sharing, or coordinated trading across users." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { icon: TriangleAlert, title: "3. Risk Disclosure", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Trading foreign exchange, CFDs, indices and crypto carries a high level of risk. While FundedNG accounts are simulated and you cannot lose real money on the platform, the skills you practise here may not translate into live-market profits, and any decision to trade live capital after participating in our evaluation is entirely your own responsibility." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Past performance — yours, ours, or any other trader's — does not guarantee future results. Profit targets, drawdown limits, and payout multiples are illustrative of the evaluation rules and not promises of future earnings. There is no guarantee that you will pass an evaluation, become funded, or receive any payout." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { icon: Wallet, title: "4. Payouts & KYC", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Funded traders keep 80% of evaluation profits, paid in Naira. Payouts are processed within 24 hours of approval, with a 7-day cycle between requests, to a verified Nigerian bank account." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "We require basic KYC — your full legal name, phone number, and a 10-digit NUBAN bank account whose holder name matches your trader account. We do not request additional documents unless we receive a specific compliance request from a regulator." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { icon: ScrollText, title: "5. Termination", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "We may close any account that breaches the trading rules, attempts to circumvent the evaluation, or engages in abusive behaviour in our community channels. Gaming the system — including using multiple accounts for free giveaways or promotions — will result in all associated accounts being permanently terminated. In serious cases of fraud or attempted fraud we reserve the right to forfeit any pending payouts and ban the user from future challenges." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "You may terminate your account at any time by contacting support." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { icon: ScrollText, title: "6. Liability", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "FundedNG's total aggregate liability to any single user is limited to the amount that user has paid us in challenge fees during the 12 months preceding the claim. We are not liable for any indirect, incidental, or consequential damages." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { icon: ScrollText, title: "7. Governing Law", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "This agreement is governed by the laws of the Federal Republic of Nigeria. Any dispute will be resolved exclusively in the courts of Lagos State." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/30 bg-primary/5 p-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "By purchasing a FundedNG challenge you confirm that you have read, understood, and agreed to this entire document." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/buy", className: "mt-4 inline-block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "font-display", children: [
          "I agree — pick a challenge ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t border-border px-4 py-12 text-center md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-xs text-muted-foreground/60", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " FundedNG. All rights reserved."
      ] })
    ] })
  ] });
}
export {
  AgreementPage as component
};
