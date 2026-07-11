import { r as reactExports, V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { a as useNavigate, u as useAuth, L as Link, s as supabase } from "./router-DudJYIfW.js";
import { B as Brand } from "./Brand-DUbFz4ZD.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { I as Input } from "./input-Cg1AgxSs.js";
import { L as Label } from "./label-BvHzfEVS.js";
import { A as Alert, a as AlertDescription } from "./alert-D-hhowZT.js";
import { s as subscribeToPush } from "./push-Byh0gYsW.js";
import { n as notifyEmail } from "./notify-email-fIZWdIiB.js";
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
function RegisterPage() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isLoading
  } = useAuth();
  reactExports.useEffect(() => {
    if (!isLoading && isAuthenticated) navigate({
      to: "/dashboard",
      replace: true
    });
  }, [isAuthenticated, isLoading, navigate]);
  const [form, setForm] = reactExports.useState({
    full_name: "",
    email: "",
    phone: "",
    password: ""
  });
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) return setError("Password must be at least 8 characters");
    setLoading(true);
    setError("");
    const {
      data: signUpData,
      error: error2
    } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: form.full_name,
          phone: form.phone
        }
      }
    });
    setLoading(false);
    if (error2) return setError(error2.message);
    try {
      localStorage.setItem("fng-new-user", "1");
    } catch {
    }
    if (signUpData?.user?.id) {
      notifyEmail({
        type: "welcome",
        userId: signUpData.user.id
      });
    }
    if (signUpData?.user?.id) {
      subscribeToPush(signUpData.user.id, supabase);
    }
    navigate({
      to: "/dashboard"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center px-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, { size: "lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display mt-6 text-3xl font-bold", children: "Create Account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Start your trading journey today" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-8", children: [
      error && /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { variant: "destructive", className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: error }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Full Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.full_name, onChange: (e) => setForm({
            ...form,
            full_name: e.target.value
          }), required: true, className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: form.email, onChange: (e) => setForm({
            ...form,
            email: e.target.value
          }), required: true, className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Phone (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.phone, onChange: (e) => setForm({
            ...form,
            phone: e.target.value
          }), placeholder: "08012345678", className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: form.password, onChange: (e) => setForm({
            ...form,
            password: e.target.value
          }), required: true, minLength: 8, placeholder: "Min 8 characters", className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "font-display w-full", disabled: loading, children: loading ? "Creating..." : "Create Account →" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm text-muted-foreground", children: [
      "Already registered? ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/login", className: "text-primary hover:underline", children: "Sign in" })
    ] })
  ] }) });
}
export {
  RegisterPage as component
};
