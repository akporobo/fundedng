import { createFileRoute } from "@tanstack/react-router";
import { useAdminData } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { formatNaira } from "@/lib/utils";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_admin/admin/challenges")({
  component: ChallengesPage,
});

function ChallengesPage() {
  const {
    challengeList, challengeEditOpen, editingChallenge, challengeForm, savingChallenge,
    openNewChallenge, openEditChallenge, saveChallenge, toggleChallengeActive, setChallengeEditOpen, setChallengeForm,
  } = useAdminData();

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Challenges</h2>
          <p className="text-xs text-muted-foreground">Add, edit, activate or deactivate challenge tiers.</p>
        </div>
        <Button size="sm" onClick={openNewChallenge} className="font-display">+ Add Challenge</Button>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {challengeList.map((c) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div><div className="font-display font-semibold">{c.name}</div><div className="text-xs text-muted-foreground">{formatNaira(c.account_size)} account</div></div>
              <div className="flex flex-col items-end gap-1">
                {c.challenge_type === "instant" && <Badge className="font-display bg-primary/20 text-primary border-primary/40 border">INSTANT</Badge>}
                <Badge variant="outline" className={`font-display ${c.is_active ? "border-primary/40 text-primary" : "border-muted text-muted-foreground"}`}>{c.is_active ? "ACTIVE" : "INACTIVE"}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-muted-foreground">Fee:</span> <span className="font-display text-primary">{formatNaira(c.price_naira)}</span></div>
              <div><span className="text-muted-foreground">Phases:</span> {c.phases}</div>
              <div><span className="text-muted-foreground">Target:</span> {c.profit_target_percent}%</div>
              <div><span className="text-muted-foreground">Drawdown:</span> {c.max_drawdown_percent}%</div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button size="sm" variant="outline" onClick={() => openEditChallenge(c)}>Edit</Button>
              <Button size="sm" variant="outline" onClick={() => toggleChallengeActive(c)}>{c.is_active ? "Deactivate" : "Activate"}</Button>
            </div>
          </div>
        ))}
        {challengeList.length === 0 && (<div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">No challenges yet.</div>)}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-background/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Account Size</th>
              <th className="px-4 py-3 text-left">Fee</th>
              <th className="px-4 py-3 text-left">Target %</th>
              <th className="px-4 py-3 text-left">Max DD %</th>
              <th className="px-4 py-3 text-left">Phases</th>
              <th className="px-4 py-3 text-left">Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {challengeList.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-display font-semibold">{c.name}</td>
                <td className="px-4 py-3"><Badge variant="outline" className={`font-display ${c.challenge_type === "instant" ? "border-primary/40 text-primary" : "border-muted text-muted-foreground"}`}>{c.challenge_type === "instant" ? "INSTANT" : "STANDARD"}</Badge></td>
                <td className="px-4 py-3">{formatNaira(c.account_size)}</td>
                <td className="px-4 py-3 font-display text-primary">{formatNaira(c.price_naira)}</td>
                <td className="px-4 py-3">{c.profit_target_percent}%</td>
                <td className="px-4 py-3">{c.max_drawdown_percent}%</td>
                <td className="px-4 py-3">{c.phases}</td>
                <td className="px-4 py-3"><Switch checked={c.is_active} onCheckedChange={() => toggleChallengeActive(c)} /></td>
                <td className="px-4 py-3 text-right"><Button size="sm" variant="outline" onClick={() => openEditChallenge(c)}>Edit</Button></td>
              </tr>
            ))}
            {challengeList.length === 0 && (<tr><td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">No challenges yet.</td></tr>)}
          </tbody>
        </table>
      </div>

      {/* Challenge edit dialog */}
      <Dialog open={challengeEditOpen} onOpenChange={(o) => !savingChallenge && setChallengeEditOpen(o)}>
        <DialogContent className="mx-4 w-[calc(100%-2rem)] max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingChallenge?.id ? "Edit challenge" : "Add challenge"}</DialogTitle>
            <DialogDescription>Configure pricing and rules for this challenge tier.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="ch-name">Name</Label>
              <Input id="ch-name" value={challengeForm.name} onChange={(e) => setChallengeForm({ ...challengeForm, name: e.target.value })} placeholder="e.g. Starter" />
            </div>
            <div className="grid gap-1.5">
              <Label>Challenge type</Label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setChallengeForm({ ...challengeForm, challenge_type: "standard", phases: 2 })}
                  className={`rounded-md border px-3 py-2 text-sm font-display ${challengeForm.challenge_type !== "instant" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>2-Step Standard</button>
                <button type="button" onClick={() => setChallengeForm({ ...challengeForm, challenge_type: "instant", phases: 1 })}
                  className={`rounded-md border px-3 py-2 text-sm font-display ${challengeForm.challenge_type === "instant" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>1-Step Instant</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5"><Label htmlFor="ch-size">Account Size (₦)</Label><Input id="ch-size" type="number" min={0} value={challengeForm.account_size} onChange={(e) => setChallengeForm({ ...challengeForm, account_size: e.target.value })} /></div>
              <div className="grid gap-1.5"><Label htmlFor="ch-fee">Fee (₦)</Label><Input id="ch-fee" type="number" min={0} value={challengeForm.price_naira} onChange={(e) => setChallengeForm({ ...challengeForm, price_naira: e.target.value })} /></div>
              <div className="grid gap-1.5"><Label htmlFor="ch-discount">Discount % (0–100)</Label><Input id="ch-discount" type="number" min={0} max={100} step="0.01" value={challengeForm.discount_percent ?? 0} onChange={(e) => setChallengeForm({ ...challengeForm, discount_percent: e.target.value })} /></div>
              <div className="grid gap-1.5"><Label htmlFor="ch-target">Profit Target %</Label><Input id="ch-target" type="number" min={0} step="0.01" value={challengeForm.profit_target_percent} onChange={(e) => setChallengeForm({ ...challengeForm, profit_target_percent: e.target.value })} /></div>
              <div className="grid gap-1.5"><Label htmlFor="ch-dd">Max Drawdown %</Label><Input id="ch-dd" type="number" min={0} step="0.01" value={challengeForm.max_drawdown_percent} onChange={(e) => setChallengeForm({ ...challengeForm, max_drawdown_percent: e.target.value })} /></div>
              <div className="grid gap-1.5"><Label htmlFor="ch-phases">Phases</Label><Input id="ch-phases" type="number" min={1} max={5} value={challengeForm.phases} onChange={(e) => setChallengeForm({ ...challengeForm, phases: e.target.value })} /></div>
              <div className="flex items-end gap-2"><Checkbox id="ch-active" checked={!!challengeForm.is_active} onCheckedChange={(v) => setChallengeForm({ ...challengeForm, is_active: !!v })} /><Label htmlFor="ch-active" className="cursor-pointer">Active</Label></div>
              {challengeForm.challenge_type === "instant" && (
                <>
                  <div className="grid gap-1.5"><Label htmlFor="ch-daily-dd">Max Daily Drawdown %</Label><Input id="ch-daily-dd" type="number" min={0} step="0.01" value={challengeForm.max_daily_drawdown_percent ?? ""} onChange={(e) => setChallengeForm({ ...challengeForm, max_daily_drawdown_percent: e.target.value })} /></div>
                  <div className="grid gap-1.5"><Label htmlFor="ch-max-days">Max Trading Days</Label><Input id="ch-max-days" type="number" min={1} value={challengeForm.max_trading_days ?? ""} onChange={(e) => setChallengeForm({ ...challengeForm, max_trading_days: e.target.value })} /></div>
                </>
              )}
            </div>
            {Number(challengeForm.price_naira) > 0 && Number(challengeForm.account_size) > 0 && (
              <div className="rounded-md border border-border bg-background p-3 text-xs text-muted-foreground">
                Preview: <span className="font-display text-primary">{formatNaira(challengeForm.account_size)}</span> account for{" "}
                {Number(challengeForm.discount_percent) > 0 ? (
                  <><span className="line-through text-muted-foreground/60">{formatNaira(challengeForm.price_naira)}</span>{" "}<span className="font-display text-primary">{formatNaira(Math.round(Number(challengeForm.price_naira) * (1 - Number(challengeForm.discount_percent) / 100)))}</span><span className="ml-1 rounded bg-green-500/20 px-1.5 py-0.5 text-[10px] font-bold text-green-600">{Number(challengeForm.discount_percent)}% OFF</span></>
                ) : <span className="font-display text-primary">{formatNaira(challengeForm.price_naira)}</span>}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChallengeEditOpen(false)} disabled={savingChallenge}>Cancel</Button>
            <Button onClick={saveChallenge} disabled={savingChallenge}>{savingChallenge ? "Saving…" : editingChallenge?.id ? "Save changes" : "Add challenge"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
