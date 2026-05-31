import { createFileRoute } from "@tanstack/react-router";
import { useAdminData } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addSocialProofServer, updateSocialProofServer, deleteSocialProofServer } from "@/server/admin.functions";

export const Route = createFileRoute("/_admin/admin/social")({
  component: SocialPage,
});

function SocialPage() {
  const {
    socialItems, uploadFile, uploadPreview, uploadLabel, uploadCategory, uploadOrder, uploading,
    savingSocialOrder, socialDeleting,
    setUploadFile, setUploadPreview, setUploadLabel, setUploadCategory, setUploadOrder,
    setUploading, loadSocialItems,
  } = useAdminData();

  return (
    <div className="mt-6 space-y-6">
      <h2 className="font-display text-xl font-bold">Social Proof Gallery</h2>

      {/* Upload Form */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="font-display text-base font-bold">Add New Image</div>
        <p className="mt-1 text-xs text-muted-foreground">Upload social proof images for the homepage gallery.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="sp-image">Image (JPG, PNG, WebP — max 5MB)</Label>
            <Input id="sp-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > 5 * 1024 * 1024) { toast.error("File too large — max 5MB"); e.target.value = ""; return; }
                setUploadFile(file); setUploadPreview(URL.createObjectURL(file));
              }
            }} className="h-auto py-1.5 file:mr-3 file:h-7 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:text-xs file:font-medium file:text-primary" />
            {uploadPreview && <div className="mt-1 h-32 w-48 overflow-hidden rounded-lg border border-border"><img src={uploadPreview} alt="Preview" className="h-full w-full object-cover" /></div>}
          </div>
          <div className="grid gap-3">
            <div className="grid gap-1.5"><Label htmlFor="sp-label">Label</Label><Input id="sp-label" value={uploadLabel} onChange={(e) => setUploadLabel(e.target.value)} placeholder="e.g. ₦42,000 Payout — Michael O." /></div>
            <div className="grid gap-1.5">
              <Label htmlFor="sp-category">Category</Label>
              <Select value={uploadCategory} onValueChange={setUploadCategory}>
                <SelectTrigger id="sp-category"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="payout">Payout</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="dashboard">Dashboard</SelectItem>
                  <SelectItem value="funded">Funded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5"><Label htmlFor="sp-order">Display Order</Label><Input id="sp-order" type="number" min={0} value={uploadOrder} onChange={(e) => setUploadOrder(e.target.value)} /></div>
          </div>
        </div>
        <Button className="mt-4" onClick={async () => {
          if (!uploadFile) return toast.error("Select an image");
          if (!uploadLabel.trim()) return toast.error("Enter a label");
          setUploading(true);
          try {
            const filePath = `${crypto.randomUUID()}-${uploadFile.name}`;
            const { error: uploadError } = await supabase.storage.from("social-proof").upload(filePath, uploadFile, { contentType: uploadFile.type, upsert: false });
            if (uploadError) { toast.error(uploadError.message); return; }
            const { data: { publicUrl } } = supabase.storage.from("social-proof").getPublicUrl(filePath);
            const { data: { session: uploadSession } } = await supabase.auth.getSession();
            const result = await addSocialProofServer({ data: { accessToken: uploadSession?.access_token ?? "", label: uploadLabel.trim(), image_url: publicUrl, storage_path: filePath, category: uploadCategory, display_order: Number(uploadOrder) } });
            if (!result.ok) { toast.error(result.error); return; }
            toast.success("Image added to gallery");
            setUploadFile(null); setUploadPreview(""); setUploadLabel(""); setUploadCategory("payout"); setUploadOrder("0");
            loadSocialItems();
          } catch (e: any) { toast.error(e?.message ?? "Upload failed"); }
          finally { setUploading(false); }
        }} disabled={uploading}>{uploading ? "Uploading…" : "Upload & Add to Gallery"}</Button>
      </div>

      {/* Management Table */}
      <div>
        <h3 className="font-display text-lg font-bold">Gallery Items</h3>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Preview</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-20">Order</TableHead>
                <TableHead className="w-20">Visible</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {socialItems.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No items yet. Upload your first image above.</TableCell></TableRow>
              ) : socialItems.map((item) => {
                const catConfig: Record<string, string> = { payout: "bg-green-500/20 text-green-500 border-green-500/40", certificate: "bg-blue-500/20 text-blue-500 border-blue-500/40", dashboard: "bg-purple-500/20 text-purple-500 border-purple-500/40", funded: "bg-amber-500/20 text-amber-500 border-amber-500/40" };
                return (
                  <TableRow key={item.id}>
                    <TableCell><div className="h-12 w-20 overflow-hidden rounded-md border border-border"><img src={item.image_url} alt={item.label} className="h-full w-full object-cover" loading="lazy" /></div></TableCell>
                    <TableCell className="max-w-[240px] truncate font-medium">{item.label}</TableCell>
                    <TableCell><Badge variant="outline" className={`font-display ${catConfig[item.category] ?? ""}`}>{item.category?.toUpperCase() ?? "—"}</Badge></TableCell>
                    <TableCell>
                      <Input type="number" min={0} className="h-8 w-16 text-xs" defaultValue={item.display_order}
                        onBlur={async (e) => {
                          const val = e.target.value;
                          if (Number(val) !== item.display_order) {
                            const { data: { session: orderSess } } = await supabase.auth.getSession();
                            const result = await updateSocialProofServer({ data: { accessToken: orderSess?.access_token ?? "", id: item.id, display_order: Number(val) } });
                            if (!result.ok) return toast.error(result.error);
                            loadSocialItems();
                          }
                        }} />
                    </TableCell>
                    <TableCell>
                      <Switch checked={!!item.is_visible} onCheckedChange={async () => {
                        const { data: { session: visSess } } = await supabase.auth.getSession();
                        const result = await updateSocialProofServer({ data: { accessToken: visSess?.access_token ?? "", id: item.id, is_visible: !item.is_visible } });
                        if (!result.ok) return toast.error(result.error);
                        toast.success(item.is_visible ? "Hidden" : "Visible"); loadSocialItems();
                      }} />
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="h-8 text-xs text-destructive hover:bg-destructive/10" disabled={socialDeleting === item.id}
                        onClick={async () => {
                          if (!confirm(`Delete "${item.label}"?`)) return;
                          const { data: { session: delSess } } = await supabase.auth.getSession();
                          const result = await deleteSocialProofServer({ data: { accessToken: delSess?.access_token ?? "", id: item.id, storage_path: item.storage_path ?? undefined } });
                          if (!result.ok) return toast.error(result.error);
                          toast.success("Item deleted"); loadSocialItems();
                        }}>{socialDeleting === item.id ? "…" : "Delete"}</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
