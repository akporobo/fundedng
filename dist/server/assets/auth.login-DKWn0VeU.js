import { r as reactExports, V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { a as useNavigate, u as useAuth, L as Link, s as supabase } from "./router-DudJYIfW.js";
import { B as Brand } from "./Brand-DUbFz4ZD.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { I as Input } from "./input-Cg1AgxSs.js";
import { L as Label } from "./label-BvHzfEVS.js";
import { A as Alert, a as AlertDescription } from "./alert-D-hhowZT.js";
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
function LoginPage() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isLoading,
    isAdmin
  } = useAuth();
  reactExports.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({
        to: isAdmin ? "/admin" : "/dashboard",
        replace: true
      });
    }
  }, [isAuthenticated, isLoading, isAdmin, navigate]);
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const {
      data: signInData,
      error: error2
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);
    if (error2) return setError(error2.message);
    const uid = signInData.user?.id;
    const {
      data: roles
    } = uid ? await supabase.from("user_roles").select("role").eq("user_id", uid) : {
      data: null
    };
    const isAdminUser = roles?.some((r) => r.role === "admin");
    navigate({
      to: isAdminUser ? "/admin" : "/dashboard",
      replace: true
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, { size: "lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display mt-6 text-3xl font-bold", children: "Welcome back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Sign in to your trader dashboard" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-8", children: [
      error && /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { variant: "destructive", className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: error }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/forgot-password", className: "text-xs text-primary hover:underline", children: "Forgot?" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "font-display w-full", disabled: loading, children: loading ? "Signing in..." : "Sign In →" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm text-muted-foreground", children: [
      "New to FundedNG? ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/register", className: "text-primary hover:underline", children: "Create account" })
    ] })
  ] }) });
}
export {
  LoginPage as component
};
