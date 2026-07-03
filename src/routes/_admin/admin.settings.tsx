import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_admin/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [rate, setRate] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
      // silent
    }
  };

  useEffect(() => { loadRate(); }, []);

  const handleSave = async () => {
    const parsed = parseFloat(inputValue);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error("Enter a valid positive number");
      return;
    }
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) { toast.error("Not authenticated"); return; }

      const res = await fetch("/api/admin/set-exchange-rate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rate: parsed }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Failed to save"); return; }

      setRate(parsed);
      setUpdatedAt(new Date().toISOString());
      toast.success(`Rate updated: ₦${parsed.toLocaleString()}/$`);
    } catch {
      toast.error("Failed to save rate");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-6 space-y-6">
      <h2 className="font-display text-xl font-bold">Settings</h2>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">USD/NGN Exchange Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Current Rate</div>
                  <div className="font-display mt-1 text-2xl font-bold text-primary">
                    {rate ? `₦${rate.toLocaleString()}` : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Per</div>
                  <div className="font-display mt-1 text-lg font-semibold">$1 USD</div>
                </div>
              </div>
              {updatedAt && (
                <div className="mt-3 text-xs text-muted-foreground">
                  Last updated: {new Date(updatedAt).toLocaleString()}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate-input">Set Exchange Rate</Label>
              <div className="flex gap-2">
                <Input
                  id="rate-input"
                  type="number"
                  step="1"
                  min="1"
                  placeholder="e.g. 1550"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="max-w-xs"
                />
                <Button onClick={handleSave} disabled={saving} size="sm">
                  {saving ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Saving…</> : <><Save className="mr-1 h-4 w-4" /> Save</>}
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Enter the current USD/NGN exchange rate manually. This rate is used to calculate Naira prices for USD challenges. Update it when the market rate changes significantly. Default fallback is ₦1,550.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
