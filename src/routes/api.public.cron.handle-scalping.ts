import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendEventEmail } from "@/lib/email.server";

interface ScalpingViolation {
  symbol: string;
  open_time: number;
  close_time: number;
  duration_seconds: number;
  profit: number;
  volume: number;
  ticket: number;
}

export const Route = createFileRoute("/api/public/cron/handle-scalping")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => handleScalping(request),
    },
  },
});

function hasOverlappingTrades(violations: ScalpingViolation[]): boolean {
  for (let i = 0; i < violations.length; i++) {
    for (let j = i + 1; j < violations.length; j++) {
      const a = violations[i];
      const b = violations[j];
      if (a.open_time < b.close_time && b.open_time < a.close_time) {
        return true;
      }
    }
  }
  return false;
}

async function handleScalping(request: Request) {
  const secret = request.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    account_id?: string;
    mt5_login?: string;
    violations?: ScalpingViolation[];
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

  const twoMinutesAgo = Math.floor(Date.now() / 1000) - 120;
  const recentViolations = violations.filter(v => v.close_time > twoMinutesAgo);

  if (recentViolations.length === 0) {
    return Response.json({ ok: true, action: "none" });
  }

  const { data: account } = await supabaseAdmin
    .from("trader_accounts")
    .select("id, user_id, status, breach_reason, scalping_warnings")
    .eq("id", account_id)
    .single();

  if (!account) {
    return Response.json({ error: "Account not found" }, { status: 404 });
  }

  if (account.status === "breached") {
    return Response.json({ ok: true, action: "already_breached" });
  }

  // Two short-held trades open at the same time → instant breach
  if (hasOverlappingTrades(recentViolations)) {
    const v = recentViolations[0];
    const breachReason = `Scalping violation: two short-held trades overlapped in time (e.g., ${v.symbol} ticket #${v.ticket}). All trades must be held a minimum of 3 minutes (180s) regardless of close type.`;

    await supabaseAdmin
      .from("trader_accounts")
      .update({
        status: "breached",
        breach_reason: breachReason,
        scalping_warnings: 0,
      })
      .eq("id", account_id);

    await supabaseAdmin.from("notifications").insert({
      user_id: account.user_id,
      title: "⚠️ Account Breached — Scalping Violation",
      message: `Two trades were held for less than 3 minutes at the same time. All trades must be held a minimum of 3 minutes.`,
      type: "breach",
    });

    try {
      await sendEventEmail({
        type: "breached",
        accountId: account_id,
        reason: breachReason,
      });
    } catch (emailErr) {
      console.error("[handle-scalping] Breach email failed:", emailErr);
    }

    return Response.json({ ok: true, action: "breached", reason: "overlapping_short_trades" });
  }

  const currentWarnings = account.scalping_warnings ?? 0;
  const newTotal = currentWarnings + recentViolations.length;

  // 5th (or more) short-held trade → breach
  if (newTotal >= 5) {
    const v = recentViolations[0];
    const breachReason = `Scalping violation: ${v.symbol} trade closed in ${v.duration_seconds}s (warning #${newTotal}). All trades must be held a minimum of 3 minutes (180s) regardless of close type. Trade #${v.ticket}. Account accumulated ${newTotal} short-held trades.`;

    await supabaseAdmin
      .from("trader_accounts")
      .update({
        status: "breached",
        breach_reason: breachReason,
        scalping_warnings: 0,
      })
      .eq("id", account_id);

    await supabaseAdmin.from("notifications").insert({
      user_id: account.user_id,
      title: "⚠️ Account Breached — Scalping Violation",
      message: `A trade on ${v.symbol} was closed in ${v.duration_seconds} seconds. This was the ${newTotal}th short-held trade — the account has been breached.`,
      type: "breach",
    });

    try {
      await sendEventEmail({
        type: "breached",
        accountId: account_id,
        reason: breachReason,
      });
    } catch (emailErr) {
      console.error("[handle-scalping] Breach email failed:", emailErr);
    }

    return Response.json({
      ok: true,
      action: "breached",
      violations_count: recentViolations.length,
      total_warnings: newTotal,
    });
  }

  // 1st through 4th short-held trade → warning
  await supabaseAdmin
    .from("trader_accounts")
    .update({
      scalping_warnings: newTotal,
    })
    .eq("id", account_id);

  const v = recentViolations[0];
  const warningNum = newTotal;
  await supabaseAdmin.from("notifications").insert({
    user_id: account.user_id,
    title: `⚠️ Scalping Warning ${warningNum}/4`,
    message: `A trade on ${v.symbol} was closed in ${v.duration_seconds} seconds. Warning ${warningNum} of 4 — ${4 - warningNum} more short-held trades and the account will be breached. All trades must be held a minimum of 3 minutes.`,
    type: "warning",
  });

  return Response.json({
    ok: true,
    action: "warning",
    warnings_count: newTotal,
    violations_count: recentViolations.length,
  });
}
