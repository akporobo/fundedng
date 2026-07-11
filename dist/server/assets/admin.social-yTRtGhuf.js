import { V as jsxRuntimeExports } from "./worker-entry-DS7H0w4O.js";
import { u as useAdminData } from "./useAdminData-BK4UWKTz.js";
import { B as Button } from "./button-CVkRzbLJ.js";
import { B as Badge } from "./badge-Drtmlf7I.js";
import { I as Input } from "./input-Cg1AgxSs.js";
import { L as Label } from "./label-BvHzfEVS.js";
import { S as Switch } from "./switch-ByCRi_GF.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BIdxB6Jz.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-kOBQTArc.js";
import { t as toast, s as supabase } from "./router-DudJYIfW.js";
import { a as addSocialProofServer, u as updateSocialProofServer, d as deleteSocialProofServer } from "./admin.functions-BiyUIzOK.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./utils-vYOMvTwc.js";
import "./kyc.functions-Ddgzg7nS.js";
import "./client.server-B4evwzKW.js";
import "./notify-email-fIZWdIiB.js";
import "./index-BXyXc4LB.js";
import "./index-DoApm__Q.js";
import "./index-CYEXyF5B.js";
import "./index-BX1kfvFW.js";
import "./index-DtbDbYbe.js";
import "./createLucideIcon-DQobbSW9.js";
import "./check-CNUFRDbJ.js";
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
function SocialPage() {
  const {
    socialItems,
    uploadFile,
    uploadPreview,
    uploadLabel,
    uploadCategory,
    uploadOrder,
    uploading,
    savingSocialOrder,
    socialDeleting,
    setUploadFile,
    setUploadPreview,
    setUploadLabel,
    setUploadCategory,
    setUploadOrder,
    setUploading,
    loadSocialItems
  } = useAdminData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Social Proof Gallery" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base font-bold", children: "Add New Image" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Upload social proof images for the homepage gallery." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sp-image", children: "Image (JPG, PNG, WebP — max 5MB)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "sp-image", type: "file", accept: "image/jpeg,image/png,image/webp", onChange: (e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 5 * 1024 * 1024) {
                toast.error("File too large — max 5MB");
                e.target.value = "";
                return;
              }
              setUploadFile(file);
              setUploadPreview(URL.createObjectURL(file));
            }
          }, className: "h-auto py-1.5 file:mr-3 file:h-7 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:text-xs file:font-medium file:text-primary" }),
          uploadPreview && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-32 w-48 overflow-hidden rounded-lg border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: uploadPreview, alt: "Preview", className: "h-full w-full object-cover" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sp-label", children: "Label" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "sp-label", value: uploadLabel, onChange: (e) => setUploadLabel(e.target.value), placeholder: "e.g. ₦42,000 Payout — Michael O." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sp-category", children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: uploadCategory, onValueChange: setUploadCategory, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "sp-category", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select category" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "payout", children: "Payout" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "certificate", children: "Certificate" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "dashboard", children: "Dashboard" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "funded", children: "Funded" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sp-order", children: "Display Order" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "sp-order", type: "number", min: 0, value: uploadOrder, onChange: (e) => setUploadOrder(e.target.value) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-4", onClick: async () => {
        if (!uploadFile) return toast.error("Select an image");
        if (!uploadLabel.trim()) return toast.error("Enter a label");
        setUploading(true);
        try {
          const filePath = `${crypto.randomUUID()}-${uploadFile.name}`;
          const {
            error: uploadError
          } = await supabase.storage.from("social-proof").upload(filePath, uploadFile, {
            contentType: uploadFile.type,
            upsert: false
          });
          if (uploadError) {
            toast.error(uploadError.message);
            return;
          }
          const {
            data: {
              publicUrl
            }
          } = supabase.storage.from("social-proof").getPublicUrl(filePath);
          const {
            data: {
              session: uploadSession
            }
          } = await supabase.auth.getSession();
          const result = await addSocialProofServer({
            data: {
              accessToken: uploadSession?.access_token ?? "",
              label: uploadLabel.trim(),
              image_url: publicUrl,
              storage_path: filePath,
              category: uploadCategory,
              display_order: Number(uploadOrder)
            }
          });
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          toast.success("Image added to gallery");
          setUploadFile(null);
          setUploadPreview("");
          setUploadLabel("");
          setUploadCategory("payout");
          setUploadOrder("0");
          loadSocialItems();
        } catch (e) {
          toast.error(e?.message ?? "Upload failed");
        } finally {
          setUploading(false);
        }
      }, disabled: uploading, children: uploading ? "Uploading…" : "Upload & Add to Gallery" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-bold", children: "Gallery Items" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 overflow-x-auto rounded-xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-24", children: "Preview" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Label" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-20", children: "Order" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-20", children: "Visible" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-20", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: socialItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "py-8 text-center text-sm text-muted-foreground", children: "No items yet. Upload your first image above." }) }) : socialItems.map((item) => {
          const catConfig = {
            payout: "bg-green-500/20 text-green-500 border-green-500/40",
            certificate: "bg-blue-500/20 text-blue-500 border-blue-500/40",
            dashboard: "bg-purple-500/20 text-purple-500 border-purple-500/40",
            funded: "bg-amber-500/20 text-amber-500 border-amber-500/40"
          };
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-20 overflow-hidden rounded-md border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.image_url, alt: item.label, className: "h-full w-full object-cover", loading: "lazy" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "max-w-[240px] truncate font-medium", children: item.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `font-display ${catConfig[item.category] ?? ""}`, children: item.category?.toUpperCase() ?? "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0, className: "h-8 w-16 text-xs", defaultValue: item.display_order, onBlur: async (e) => {
              const val = e.target.value;
              if (Number(val) !== item.display_order) {
                const {
                  data: {
                    session: orderSess
                  }
                } = await supabase.auth.getSession();
                const result = await updateSocialProofServer({
                  data: {
                    accessToken: orderSess?.access_token ?? "",
                    id: item.id,
                    display_order: Number(val)
                  }
                });
                if (!result.ok) return toast.error(result.error);
                loadSocialItems();
              }
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: !!item.is_visible, onCheckedChange: async () => {
              const {
                data: {
                  session: visSess
                }
              } = await supabase.auth.getSession();
              const result = await updateSocialProofServer({
                data: {
                  accessToken: visSess?.access_token ?? "",
                  id: item.id,
                  is_visible: !item.is_visible
                }
              });
              if (!result.ok) return toast.error(result.error);
              toast.success(item.is_visible ? "Hidden" : "Visible");
              loadSocialItems();
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-8 text-xs text-destructive hover:bg-destructive/10", disabled: socialDeleting === item.id, onClick: async () => {
              if (!confirm(`Delete "${item.label}"?`)) return;
              const {
                data: {
                  session: delSess
                }
              } = await supabase.auth.getSession();
              const result = await deleteSocialProofServer({
                data: {
                  accessToken: delSess?.access_token ?? "",
                  id: item.id,
                  storage_path: item.storage_path ?? void 0
                }
              });
              if (!result.ok) return toast.error(result.error);
              toast.success("Item deleted");
              loadSocialItems();
            }, children: socialDeleting === item.id ? "…" : "Delete" }) })
          ] }, item.id);
        }) })
      ] }) })
    ] })
  ] });
}
export {
  SocialPage as component
};
