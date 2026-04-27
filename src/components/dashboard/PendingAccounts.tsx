import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Clock, LifeBuoy } from "lucide-react";
import { toast } from "sonner";
import { formatNaira } from "@/lib/utils";

const PREP_MS = 5 * 60 * 1000;

interface PendingOrder {
  id: string;
  created_at: string;
  amount_paid: number;
  challenges?: { name: string; account_size: number } | null;
}

function format(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

function Countdown({ readyAt, onElapsed }: { readyAt: number; onElapsed: () => void }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = readyAt - Date.now();
  useEffect(() => {
    if (diff <= 0) onElapsed();
  }, [diff, onElapsed]);
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return (
    <div className="font-display text-3xl font-bold text-primary tabular-nums">
      {format(minutes)}:{format(seconds)}
    </div>
  );
}

export function PendingAccounts({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [openTicketFor, setOpenTicketFor] = useState<PendingOrder | null>(null);
  const [subject, setSubject] = useState("My account login is not ready");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [, force] = useState(0);

  const load = async () => {
    const { data: paidOrders } = await supabase
      .from("orders")
      .select("id, created_at, amount_paid, challenges(name, account_size)")
      .eq("user_id", userId)
      .eq("status", "paid")
      .order("created_at", { ascending: false });

    const list = (paidOrders ?? []) as unknown as PendingOrder[];
    if (list.length === 0) {
      setOrders([]);
      return;
    }

    // Filter out orders that already have a trader account
    const { data: existing } = await supabase
      .from("trader_accounts")
      .select("order_id")
      .in("order_id", list.map((o) => o.id));
    const fulfilled = new Set((existing ?? []).map((r: any) => r.order_id));
    setOrders(list.filter((o) => !fulfilled.has(o.id)));
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const submitTicket = async () => {
    if (!openTicketFor) return;
    if (!message.trim()) return toast.error("Please describe what you need");
    setSubmitting(true);
    const { error } = await supabase.from("tickets").insert({
      user_id: userId,
      order_id: openTicketFor.id,
      subject: subject.trim() || "Account login request",
      message: message.trim(),
    } as never);
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Ticket opened — admin will get back to you shortly.");
    setOpenTicketFor(null);
    setMessage("");
  };

  if (orders.length === 0) return null;

  return (
    <>
      <div className="mt-6 space-y-3">
        {orders.map((o) => {
          const readyAt = new Date(o.created_at).getTime() + PREP_MS;
          const elapsed = Date.now() >= readyAt;
          return (
            <div
              key={o.id}
              className="rounded-2xl border border-primary/30 bg-primary/5 p-5 md:p-6"
            >
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <div className="font-display text-lg font-bold">
                    We're preparing your account
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {o.challenges?.name ?? "Challenge"} · {formatNaira(o.challenges?.account_size ?? 0)}
                    {" · "}
                    {elapsed
                      ? "Taking longer than expected — open a ticket and we'll send your logins."
                      : "Should be ready in about 5 minutes."}
                  </p>
                </div>
                {elapsed ? (
                  <Button onClick={() => setOpenTicketFor(o)} className="font-display">
                    <LifeBuoy className="mr-2 h-4 w-4" /> Open ticket
                  </Button>
                ) : (
                  <Countdown readyAt={readyAt} onElapsed={() => force((n) => n + 1)} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!openTicketFor} onOpenChange={(v) => !v && setOpenTicketFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open a support ticket</DialogTitle>
            <DialogDescription>
              We'll respond as soon as possible with your account logins.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="ticket-subject">Subject</Label>
              <Input
                id="ticket-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ticket-message">Message</Label>
              <Textarea
                id="ticket-message"
                rows={4}
                placeholder="e.g. I purchased a ₦200,000 account and I need my login credentials."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenTicketFor(null)}>
              Cancel
            </Button>
            <Button onClick={submitTicket} disabled={submitting}>
              {submitting ? "Sending…" : "Send ticket"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}