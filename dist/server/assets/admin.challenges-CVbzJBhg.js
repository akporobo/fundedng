import { r as reactExports, V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAdminData } from "./useAdminData-BK4UWKTz.js";
import { u as useComposedRefs, B as Button } from "./button-CVkRzbLJ.js";
import { B as Badge } from "./badge-Drtmlf7I.js";
import { S as Switch } from "./switch-ByCRi_GF.js";
import { I as Input } from "./input-Cg1AgxSs.js";
import { L as Label } from "./label-BvHzfEVS.js";
import { P as Primitive, u as useControllableState, c as composeEventHandlers, b as createContextScope } from "./index-BXyXc4LB.js";
import { u as usePrevious } from "./index-DoApm__Q.js";
import { u as useSize } from "./index-CYEXyF5B.js";
import { P as Presence, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-CVXx6z81.js";
import { c as cn, b as formatUSD, a as formatNaira } from "./utils-vYOMvTwc.js";
import { C as Check } from "./check-CNUFRDbJ.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-DudJYIfW.js";
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
import "./kyc.functions-Ddgzg7nS.js";
import "./notify-email-fIZWdIiB.js";
import "./x-CGo4OehW.js";
import "./createLucideIcon-DQobbSW9.js";
var CHECKBOX_NAME = "Checkbox";
var [createCheckboxContext] = createContextScope(CHECKBOX_NAME);
var [CheckboxProviderImpl, useCheckboxContext] = createCheckboxContext(CHECKBOX_NAME);
function CheckboxProvider(props) {
  const {
    __scopeCheckbox,
    checked: checkedProp,
    children,
    defaultChecked,
    disabled,
    form,
    name,
    onCheckedChange,
    required,
    value = "on",
    // @ts-expect-error
    internal_do_not_use_render
  } = props;
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: CHECKBOX_NAME
  });
  const [control, setControl] = reactExports.useState(null);
  const [bubbleInput, setBubbleInput] = reactExports.useState(null);
  const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
  const isFormControl = control ? !!form || !!control.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    true
  );
  const context = {
    checked,
    disabled,
    setChecked,
    control,
    setControl,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
    required,
    defaultChecked: isIndeterminate(defaultChecked) ? false : defaultChecked,
    isFormControl,
    bubbleInput,
    setBubbleInput
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CheckboxProviderImpl,
    {
      scope: __scopeCheckbox,
      ...context,
      children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
    }
  );
}
var TRIGGER_NAME = "CheckboxTrigger";
var CheckboxTrigger = reactExports.forwardRef(
  ({ __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }, forwardedRef) => {
    const {
      control,
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      hasConsumerStoppedPropagationRef,
      isFormControl,
      bubbleInput
    } = useCheckboxContext(TRIGGER_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setControl);
    const initialCheckedStateRef = reactExports.useRef(checked);
    reactExports.useEffect(() => {
      const form = control?.form;
      if (form) {
        const reset = () => setChecked(initialCheckedStateRef.current);
        form.addEventListener("reset", reset);
        return () => form.removeEventListener("reset", reset);
      }
    }, [control, setChecked]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        "aria-required": required,
        "data-state": getState(checked),
        "data-disabled": disabled ? "" : void 0,
        disabled,
        value,
        ...checkboxProps,
        ref: composedRefs,
        onKeyDown: composeEventHandlers(onKeyDown, (event) => {
          if (event.key === "Enter") event.preventDefault();
        }),
        onClick: composeEventHandlers(onClick, (event) => {
          setChecked((prevChecked) => isIndeterminate(prevChecked) ? true : !prevChecked);
          if (bubbleInput && isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })
      }
    );
  }
);
CheckboxTrigger.displayName = TRIGGER_NAME;
var Checkbox$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCheckbox,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      form,
      ...checkboxProps
    } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckboxProvider,
      {
        __scopeCheckbox,
        checked,
        defaultChecked,
        disabled,
        required,
        onCheckedChange,
        name,
        form,
        value,
        internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxTrigger,
            {
              ...checkboxProps,
              ref: forwardedRef,
              __scopeCheckbox
            }
          ),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxBubbleInput,
            {
              __scopeCheckbox
            }
          )
        ] })
      }
    );
  }
);
Checkbox$1.displayName = CHECKBOX_NAME;
var INDICATOR_NAME = "CheckboxIndicator";
var CheckboxIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCheckbox, forceMount, ...indicatorProps } = props;
    const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Presence,
      {
        present: forceMount || isIndeterminate(context.checked) || context.checked === true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            "data-state": getState(context.checked),
            "data-disabled": context.disabled ? "" : void 0,
            ...indicatorProps,
            ref: forwardedRef,
            style: { pointerEvents: "none", ...props.style }
          }
        )
      }
    );
  }
);
CheckboxIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "CheckboxBubbleInput";
var CheckboxBubbleInput = reactExports.forwardRef(
  ({ __scopeCheckbox, ...props }, forwardedRef) => {
    const {
      control,
      hasConsumerStoppedPropagationRef,
      checked,
      defaultChecked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput
    } = useCheckboxContext(BUBBLE_INPUT_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = bubbleInput;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      const bubbles = !hasConsumerStoppedPropagationRef.current;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        input.indeterminate = isIndeterminate(checked);
        setChecked.call(input, isIndeterminate(checked) ? false : checked);
        input.dispatchEvent(event);
      }
    }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);
    const defaultCheckedRef = reactExports.useRef(isIndeterminate(checked) ? false : checked);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: defaultChecked ?? defaultCheckedRef.current,
        required,
        disabled,
        name,
        value,
        form,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME;
function isFunction(value) {
  return typeof value === "function";
}
function isIndeterminate(checked) {
  return checked === "indeterminate";
}
function getState(checked) {
  return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
const Checkbox = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Checkbox$1,
  {
    ref,
    className: cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckboxIndicator, { className: cn("grid place-content-center text-current"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) })
  }
));
Checkbox.displayName = Checkbox$1.displayName;
function ChallengesPage() {
  const {
    challengeList,
    challengeEditOpen,
    editingChallenge,
    challengeForm,
    savingChallenge,
    openNewChallenge,
    openEditChallenge,
    saveChallenge,
    toggleChallengeActive,
    deleteChallenge,
    deletingChallengeId,
    setDeletingChallengeId,
    setChallengeEditOpen,
    setChallengeForm
  } = useAdminData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Challenges" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Add, edit, activate or deactivate challenge tiers." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: openNewChallenge, className: "font-display", children: "+ Add Challenge" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 md:hidden", children: [
      challengeList.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-semibold", children: c.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              (c.currency === "USD" ? formatUSD : formatNaira)(c.account_size),
              " account"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1", children: [
            c.challenge_type === "instant" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "font-display bg-primary/20 text-primary border-primary/40 border", children: "INSTANT" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `font-display ${c.currency === "USD" ? "border-blue-500/40 text-blue-500" : "border-green-500/40 text-green-500"}`, children: c.currency === "USD" ? "USD" : "NGN" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `font-display ${c.is_active ? "border-primary/40 text-primary" : "border-muted text-muted-foreground"}`, children: c.is_active ? "ACTIVE" : "INACTIVE" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Fee:" }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-primary", children: c.currency === "USD" ? formatUSD(c.usd_price) : formatNaira(c.price_naira) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Phases:" }),
            " ",
            c.phases
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Target:" }),
            " ",
            c.phase2_profit_target_percent ? `${c.profit_target_percent}% / ${c.phase2_profit_target_percent}%` : `${c.profit_target_percent}%`
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Drawdown:" }),
            " ",
            c.max_drawdown_percent,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => openEditChallenge(c), children: "Edit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => toggleChallengeActive(c), children: c.is_active ? "Deactivate" : "Activate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "text-destructive border-destructive/30 hover:bg-destructive/10", onClick: () => setDeletingChallengeId(c.id), disabled: deletingChallengeId === c.id, children: deletingChallengeId === c.id ? "Deleting…" : "Delete" })
        ] })
      ] }, c.id)),
      challengeList.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground", children: "No challenges yet." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden overflow-x-auto rounded-xl border border-border bg-card md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "border-b border-border bg-background/50 text-xs uppercase tracking-wide text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Currency" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Account Size" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Fee" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Target %" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Max DD %" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Phases" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Active" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        challengeList.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border last:border-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-display font-semibold", children: c.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `font-display ${c.currency === "USD" ? "border-blue-500/40 text-blue-500" : "border-green-500/40 text-green-500"}`, children: c.currency === "USD" ? "USD" : "NGN" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `font-display ${c.challenge_type === "instant" ? "border-primary/40 text-primary" : "border-muted text-muted-foreground"}`, children: c.challenge_type === "instant" ? "INSTANT" : "STANDARD" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: c.currency === "USD" ? formatUSD(c.account_size) : formatNaira(c.account_size) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-display text-primary", children: c.currency === "USD" ? formatUSD(c.usd_price) : formatNaira(c.price_naira) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: c.phase2_profit_target_percent ? `${c.profit_target_percent}% / ${c.phase2_profit_target_percent}%` : `${c.profit_target_percent}%` }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
            c.max_drawdown_percent,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: c.phases }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: c.is_active, onCheckedChange: () => toggleChallengeActive(c) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right flex gap-1 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => openEditChallenge(c), children: "Edit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "text-destructive border-destructive/30 hover:bg-destructive/10", onClick: () => setDeletingChallengeId(c.id), disabled: deletingChallengeId === c.id, children: deletingChallengeId === c.id ? "Deleting…" : "Delete" })
          ] })
        ] }, c.id)),
        challengeList.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 10, className: "px-4 py-8 text-center text-muted-foreground", children: "No challenges yet." }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: challengeEditOpen, onOpenChange: (o) => !savingChallenge && setChallengeEditOpen(o), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "mx-4 w-[calc(100%-2rem)] max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editingChallenge?.id ? "Edit challenge" : "Add challenge" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Configure pricing and rules for this challenge tier." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ch-name", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ch-name", value: challengeForm.name, onChange: (e) => setChallengeForm({
            ...challengeForm,
            name: e.target.value
          }), placeholder: "e.g. Starter" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Currency" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setChallengeForm({
              ...challengeForm,
              currency: "NGN",
              price_naira: challengeForm.price_naira || 12e3
            }), className: `rounded-md border px-3 py-2 text-sm font-display ${challengeForm.currency !== "USD" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`, children: "NGN" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setChallengeForm({
              ...challengeForm,
              currency: "USD",
              usd_price: challengeForm.usd_price || 19
            }), className: `rounded-md border px-3 py-2 text-sm font-display ${challengeForm.currency === "USD" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`, children: "USD" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Challenge type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setChallengeForm({
              ...challengeForm,
              challenge_type: "standard",
              phases: 2
            }), className: `rounded-md border px-3 py-2 text-sm font-display ${challengeForm.challenge_type !== "instant" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`, children: "2-Step Standard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setChallengeForm({
              ...challengeForm,
              challenge_type: "instant",
              phases: 1
            }), className: `rounded-md border px-3 py-2 text-sm font-display ${challengeForm.challenge_type === "instant" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`, children: "1-Step Instant" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Drawdown Calculation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setChallengeForm({
                ...challengeForm,
                drawdown_type: "trailing_equity"
              }), className: `rounded-md border px-3 py-2 text-sm font-display ${challengeForm.drawdown_type !== "static_balance" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`, children: "Trailing (Equity)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setChallengeForm({
                ...challengeForm,
                drawdown_type: "static_balance"
              }), className: `rounded-md border px-3 py-2 text-sm font-display ${challengeForm.drawdown_type === "static_balance" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`, children: "Static (Balance)" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "ch-size", children: [
              "Account Size ",
              challengeForm.currency === "USD" ? "($)" : "(₦)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ch-size", type: "number", min: 0, value: challengeForm.account_size, onChange: (e) => setChallengeForm({
              ...challengeForm,
              account_size: e.target.value
            }) })
          ] }),
          challengeForm.currency === "USD" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ch-usd-fee", children: "Fee ($)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ch-usd-fee", type: "number", min: 0, step: "0.01", value: challengeForm.usd_price, onChange: (e) => setChallengeForm({
              ...challengeForm,
              usd_price: e.target.value
            }) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ch-fee", children: "Fee (₦)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ch-fee", type: "number", min: 0, value: challengeForm.price_naira, onChange: (e) => setChallengeForm({
              ...challengeForm,
              price_naira: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ch-discount", children: "Discount % (0–100)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ch-discount", type: "number", min: 0, max: 100, step: "0.01", value: challengeForm.discount_percent ?? 0, onChange: (e) => setChallengeForm({
              ...challengeForm,
              discount_percent: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ch-target", children: "Phase 1 Profit Target %" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ch-target", type: "number", min: 0, step: "0.01", value: challengeForm.profit_target_percent, onChange: (e) => setChallengeForm({
              ...challengeForm,
              profit_target_percent: e.target.value
            }) })
          ] }),
          Number(challengeForm.phases) >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ch-target-2", children: "Phase 2 Profit Target %" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ch-target-2", type: "number", min: 0, step: "0.01", value: challengeForm.phase2_profit_target_percent, onChange: (e) => setChallengeForm({
              ...challengeForm,
              phase2_profit_target_percent: e.target.value
            }), placeholder: "Same as Phase 1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ch-dd", children: "Max Drawdown %" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ch-dd", type: "number", min: 0, step: "0.01", value: challengeForm.max_drawdown_percent, onChange: (e) => setChallengeForm({
              ...challengeForm,
              max_drawdown_percent: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ch-phases", children: "Phases" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ch-phases", type: "number", min: 1, max: 5, value: challengeForm.phases, onChange: (e) => setChallengeForm({
              ...challengeForm,
              phases: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { id: "ch-active", checked: !!challengeForm.is_active, onCheckedChange: (v) => setChallengeForm({
              ...challengeForm,
              is_active: !!v
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ch-active", className: "cursor-pointer", children: "Active" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ch-daily-dd", children: "Max Daily Drawdown %" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ch-daily-dd", type: "number", min: 0, step: "0.01", value: challengeForm.max_daily_drawdown_percent ?? "", onChange: (e) => setChallengeForm({
              ...challengeForm,
              max_daily_drawdown_percent: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ch-min-days", children: "Min Trading Days" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ch-min-days", type: "number", min: 1, value: challengeForm.min_trading_days ?? 3, onChange: (e) => setChallengeForm({
              ...challengeForm,
              min_trading_days: e.target.value
            }) })
          ] }),
          challengeForm.challenge_type === "instant" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ch-max-days", children: "Max Trading Days" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ch-max-days", type: "number", min: 1, value: challengeForm.max_trading_days ?? "", onChange: (e) => setChallengeForm({
              ...challengeForm,
              max_trading_days: e.target.value
            }) })
          ] })
        ] }),
        (() => {
          const isUsd = challengeForm.currency === "USD";
          const size = Number(challengeForm.account_size);
          const fee = isUsd ? Number(challengeForm.usd_price) : Number(challengeForm.price_naira);
          const fmt = isUsd ? formatUSD : formatNaira;
          if (fee > 0 && size > 0) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-background p-3 text-xs text-muted-foreground", children: [
            "Preview: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-primary", children: fmt(challengeForm.account_size) }),
            " account for",
            " ",
            Number(challengeForm.discount_percent) > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-through text-muted-foreground/60", children: fmt(fee) }),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-primary", children: fmt(Math.round(fee * (1 - Number(challengeForm.discount_percent) / 100))) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 rounded bg-green-500/20 px-1.5 py-0.5 text-[10px] font-bold text-green-600", children: [
                Number(challengeForm.discount_percent),
                "% OFF"
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-primary", children: fmt(fee) })
          ] });
        })()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setChallengeEditOpen(false), disabled: savingChallenge, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveChallenge, disabled: savingChallenge, children: savingChallenge ? "Saving…" : editingChallenge?.id ? "Save changes" : "Add challenge" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!deletingChallengeId && challengeList.some((c) => c.id === deletingChallengeId), onOpenChange: (o) => {
      if (!o) setDeletingChallengeId(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete challenge?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: (() => {
          const c = challengeList.find((c2) => c2.id === deletingChallengeId);
          if (!c) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Are you sure you want to delete ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: c.name }),
            " (",
            c.currency === "USD" ? formatUSD(c.account_size) : formatNaira(c.account_size),
            ")? This action cannot be undone."
          ] });
        })() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDeletingChallengeId(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: () => {
          const c = challengeList.find((c2) => c2.id === deletingChallengeId);
          if (c) deleteChallenge(c);
        }, children: "Delete" })
      ] })
    ] }) })
  ] });
}
export {
  ChallengesPage as component
};
