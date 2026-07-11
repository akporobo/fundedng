import { r as reactExports, V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-D4cmXPic.js";
import { I as Input } from "./input-Cg1AgxSs.js";
import { L as Label } from "./label-BvHzfEVS.js";
import { t as toast, s as supabase } from "./router-DudJYIfW.js";
import { L as LoaderCircle } from "./loader-circle-DcDrkJ-1.js";
import { c as createLucideIcon } from "./createLucideIcon-DQobbSW9.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./utils-vYOMvTwc.js";
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
const __iconNode = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
function SettingsPage() {
  const [rate, setRate] = reactExports.useState(null);
  const [inputValue, setInputValue] = reactExports.useState("");
  const [updatedAt, setUpdatedAt] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const loadRate = async () => {
    try {
      const res = await fetch("/api/exchange-rate");
      const data = await res.json();
      if (data?.rate) {
        setRate(data.rate);
        setInputValue(data.rate.toString());
        setUpdatedAt(data.updatedAt ?? null);
      }
    } catch {
    }
  };
  reactExports.useEffect(() => {
    loadRate();
  }, []);
  const handleSave = async () => {
    const parsed = parseFloat(inputValue);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error("Enter a valid positive number");
      return;
    }
    setSaving(true);
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        toast.error("Not authenticated");
        return;
      }
      const res = await fetch("/api/admin/set-exchange-rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rate: parsed
        })
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to save");
        return;
      }
      setRate(parsed);
      setUpdatedAt((/* @__PURE__ */ new Date()).toISOString());
      toast.success(`Rate updated: ₦${parsed.toLocaleString()}/$`);
    } catch {
      toast.error("Failed to save rate");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base", children: "USD/NGN Exchange Rate" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/30 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Current Rate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display mt-1 text-2xl font-bold text-primary", children: rate ? `₦${rate.toLocaleString()}` : "—" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Per" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display mt-1 text-lg font-semibold", children: "$1 USD" })
            ] })
          ] }),
          updatedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-xs text-muted-foreground", children: [
            "Last updated: ",
            new Date(updatedAt).toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "rate-input", children: "Set Exchange Rate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "rate-input", type: "number", step: "1", min: "1", placeholder: "e.g. 1550", value: inputValue, onChange: (e) => setInputValue(e.target.value), className: "max-w-xs" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, disabled: saving, size: "sm", children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1 h-4 w-4 animate-spin" }),
              " Saving…"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-1 h-4 w-4" }),
              " Save"
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Enter the current USD/NGN exchange rate manually. This rate is used to calculate Naira prices for USD challenges. Update it when the market rate changes significantly. Default fallback is ₦1,550." })
      ] }) })
    ] })
  ] });
}
export {
  SettingsPage as component
};
