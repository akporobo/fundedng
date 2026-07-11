import { r as reactExports, V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { c as cn } from "./utils-vYOMvTwc.js";
import { c as createLucideIcon } from "./createLucideIcon-DQobbSW9.js";
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode);
function RefreshButton({ onRefresh, className, label = "Refresh", size = "sm" }) {
  const [busy, setBusy] = reactExports.useState(false);
  const handle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setBusy(false), 350);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      type: "button",
      variant: "outline",
      size,
      onClick: handle,
      disabled: busy,
      className: cn("gap-1.5", className),
      "aria-label": "Refresh data",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-3.5 w-3.5", busy && "animate-spin") }),
        size !== "icon" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: label })
      ]
    }
  );
}
export {
  RefreshButton as R
};
