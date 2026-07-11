import { r as reactExports, V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { c as Route, u as useAuth, a as useNavigate, t as toast, L as Link } from "./router-DudJYIfW.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { A as Alert, a as AlertDescription } from "./alert-D-hhowZT.js";
import { L as LoaderCircle } from "./loader-circle-DcDrkJ-1.js";
import { C as CircleCheck } from "./circle-check-CaHXACS8.js";
import { A as ArrowRight } from "./arrow-right-DLtychK9.js";
import { C as CircleX } from "./circle-x-DOG0OKl-.js";
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
import "./utils-vYOMvTwc.js";
import "./createLucideIcon-DQobbSW9.js";
function PaymentCallback() {
  const {
    reference,
    trxref,
    challenge_id,
    dp,
    dc,
    pp,
    oa
  } = Route.useSearch();
  const {
    session,
    isLoading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  const ranRef = reactExports.useRef(false);
  const [status, setStatus] = reactExports.useState("verifying");
  const [message, setMessage] = reactExports.useState("Confirming your payment with Squad…");
  const [orderId, setOrderId] = reactExports.useState(null);
  const ref = reference ?? trxref;
  reactExports.useEffect(() => {
    if (authLoading) return;
    if (ranRef.current) return;
    ranRef.current = true;
    (async () => {
      if (!ref || !challenge_id) {
        setStatus("error");
        setMessage("Missing payment reference. If you were charged, contact support.");
        return;
      }
      if (!session?.access_token) {
        setStatus("error");
        setMessage("Your session expired. Please sign in again to confirm your payment.");
        return;
      }
      try {
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            reference: ref,
            challenge_id,
            discount_percent: dp,
            discount_code: dc,
            partner_promo_code: pp,
            original_amount: oa
          })
        });
        const result = await res.json().catch(() => ({}));
        if (!res.ok || !result.ok || !result.order_id) {
          setStatus("error");
          setMessage(result.error ?? "Payment verification failed");
          return;
        }
        setOrderId(result.order_id);
        setStatus("success");
        setMessage("Payment confirmed! Your account is being prepared.");
        toast.success("Payment confirmed!");
        fetch("/api/notify-new-purchase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            order_id: result.order_id
          }),
          keepalive: true
        }).catch(() => {
        });
      } catch (e) {
        setStatus("error");
        setMessage(e instanceof Error ? e.message : "Payment verification failed");
      }
    })();
  }, [authLoading, ref, challenge_id, session?.access_token]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid min-h-screen place-items-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-xl border border-border bg-card p-8 text-center", children: [
    status === "verifying" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mx-auto h-10 w-10 animate-spin text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display mt-4 text-2xl font-bold", children: "Verifying payment" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: message })
    ] }),
    status === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mx-auto h-12 w-12 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display mt-4 text-2xl font-bold", children: "Payment successful" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: message }),
      orderId && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-muted-foreground", children: [
        "Order #",
        orderId.slice(0, 8)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "font-display mt-6 w-full", onClick: () => navigate({
        to: "/dashboard"
      }), children: [
        "Continue to dashboard ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
      ] })
    ] }),
    status === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "mx-auto h-12 w-12 text-destructive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display mt-4 text-2xl font-bold", children: "Verification failed" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { variant: "destructive", className: "mt-4 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: message }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "font-display", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/buy", children: "Back to checkout" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", children: "Go to dashboard" }) })
      ] })
    ] })
  ] }) });
}
export {
  PaymentCallback as component
};
