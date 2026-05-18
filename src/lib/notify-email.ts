import { supabase } from "@/integrations/supabase/client";

export type EmailEvent =
  | { type: "welcome"; userId: string }
  | { type: "purchase_confirmed"; orderId: string }
  | { type: "mt5_delivered"; orderId: string; mt5Login: string; mt5Password: string; mt5Server: string }
  | { type: "phase1_passed"; accountId: string }
  | { type: "funded"; accountId: string }
  | { type: "payout_requested"; payoutId: string }
  | { type: "payout_approved"; payoutId: string }
  | { type: "payout_rejected"; payoutId: string; reason?: string }
  | { type: "breached"; accountId: string; reason: string }
  | { type: "kyc_approved"; userId: string };

export async function notifyEmail(event: EmailEvent) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ event }),
    });
  } catch (e) {
    console.warn("[notifyEmail] failed", e);
  }
}
