import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendEventEmail } from "@/lib/email.server";

interface NewsViolation {
  symbol: string;
  open_time: number;
  event_title: string;
  event_time: number;
  volume: number;
  ticket: number;
}

export const Route = createFileRoute("/api/public/cron/handle-news-violation")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => handleNewsViolation(request),
    },
  },
});

async function handleNewsViolation(request: Request) {
  const secret = request.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    account_id?: string;
    mt5_login?: string;
    violations?: NewsViolation[];
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { account_id, mt5_login, violations } = body;

  if (!account_id || !violations || violations.length === 0) {
    return Response.json({ ok: true, action: "none" });
  }

  // Only process recent violations — ignore anything older than 5 minutes
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 300;
  const recentViolations = violations.filter(v => v.open_time > fiveMinutesAgo);

  if (recentViolations.length === 0) {
    return Response.json({ ok: true, action: "none" });
  }

  // Check if already breached
  const { data: account } = await supabaseAdmin
    .from("trader_accounts")
    .select("id, user_id, status, breach_reason")
    .eq("id", account_id)
    .single();

  if (!account) {
    return Response.json({ error: "Account not found" }, { status: 404 });
  }

  if (account.status === "breached") {
    return Response.json({ ok: true, action: "already_breached" });
  }

  // Build breach reason from the first violation
  const v = recentViolations[0];
  const breachReason = `News trading violation: trade opened on ${v.symbol} near high-impact news event "${v.event_title}". No trades may be opened 5 minutes before or 5 minutes after a high-impact news event. Trade #${v.ticket}`;

  // Update account status to breached
  const { error: updateErr } = await supabaseAdmin
    .from("trader_accounts")
    .update({
      status: "breached",
      breach_reason: breachReason,
    })
    .eq("id", account_id);

  if (updateErr) {
    return Response.json({ error: updateErr.message }, { status: 500 });
  }

  // Insert trader notification
  await supabaseAdmin.from("notifications").insert({
    user_id: account.user_id,
    title: "⚠️ Account Breached — News Trading Violation",
    message: `A trade on ${v.symbol} was opened near a high-impact news event (${v.event_title}). No new trades may be opened 5 minutes before or 5 minutes after a high-impact news event.`,
    type: "breach",
  });

  // Send breach email
  try {
    await sendEventEmail({
      type: "breached",
      accountId: account_id,
      reason: breachReason,
    });
  } catch (emailErr) {
    console.error("[handle-news-violation] Breach email failed:", emailErr);
  }

  return Response.json({
    ok: true,
    action: "breached",
    violations_count: recentViolations.length,
  });
}
