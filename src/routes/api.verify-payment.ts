import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Server-side Paystack verification.
 *
 * The browser cannot be trusted to confirm payment success — anyone could
 * fabricate an `onSuccess` payload and create a paid order. This endpoint:
 *  1. Authenticates the caller via their Supabase access token.
 *  2. Asks Paystack directly whether the transaction reference succeeded.
 *  3. Confirms the kobo amount matches the challenge price on file.
 *  4. Inserts the order with the service-role client (bypassing RLS but
 *     scoped to the verified user_id).
 *
 * Idempotent: a duplicate reference returns the existing order.
 */
export const Route = createFileRoute("/api/verify-payment")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // ---- 1. Authenticate caller ----
          const authHeader = request.headers.get("authorization");
          const token = authHeader?.startsWith("Bearer ")
            ? authHeader.slice("Bearer ".length).trim()
            : null;
          if (!token) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
          }
          const { data: userData, error: authErr } =
            await supabaseAdmin.auth.getUser(token);
          if (authErr || !userData?.user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
          }
          const userId = userData.user.id;

          // ---- 2. Parse + validate body ----
          const body = (await request.json().catch(() => ({}))) as {
            reference?: string;
            challenge_id?: string;
          };
          const reference = body.reference?.trim();
          const challengeId = body.challenge_id?.trim();
          if (!reference || !challengeId) {
            return Response.json(
              { error: "reference and challenge_id are required" },
              { status: 400 },
            );
          }

          // ---- 3. Idempotency: existing order for this reference ----
          const { data: existing } = await supabaseAdmin
            .from("orders")
            .select("id, user_id")
            .eq("paystack_reference", reference)
            .maybeSingle();
          if (existing) {
            if (existing.user_id !== userId) {
              return Response.json(
                { error: "Payment reference already used" },
                { status: 409 },
              );
            }
            return Response.json({ ok: true, order_id: existing.id, already: true });
          }

          // ---- 4. Verify with Paystack ----
          const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
          if (!paystackSecret) {
            console.error("[verify-payment] PAYSTACK_SECRET_KEY missing");
            return Response.json(
              { error: "Payment verification is not configured" },
              { status: 500 },
            );
          }
          const paystackRes = await fetch(
            `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
            { headers: { Authorization: `Bearer ${paystackSecret}` } },
          );
          const paystackJson = (await paystackRes.json().catch(() => ({}))) as {
            status?: boolean;
            message?: string;
            data?: {
              status?: string;
              amount?: number;
              currency?: string;
              metadata?: Record<string, unknown>;
            };
          };
          if (!paystackRes.ok || !paystackJson.status || paystackJson.data?.status !== "success") {
            return Response.json(
              { error: paystackJson.message ?? "Payment not successful" },
              { status: 400 },
            );
          }
          if (paystackJson.data?.currency && paystackJson.data.currency !== "NGN") {
            return Response.json(
              { error: `Unexpected currency: ${paystackJson.data.currency}` },
              { status: 400 },
            );
          }

          // ---- 5. Confirm amount matches challenge price ----
          const { data: challenge, error: chErr } = await supabaseAdmin
            .from("challenges")
            .select("id, price_naira, is_active")
            .eq("id", challengeId)
            .maybeSingle();
          if (chErr || !challenge) {
            return Response.json({ error: "Challenge not found" }, { status: 404 });
          }
          const expectedKobo = Number(challenge.price_naira) * 100;
          const paidKobo = Number(paystackJson.data?.amount ?? 0);
          if (paidKobo !== expectedKobo) {
            return Response.json(
              {
                error: `Amount mismatch: expected ${expectedKobo} kobo, got ${paidKobo}`,
              },
              { status: 400 },
            );
          }

          // ---- 6. Create order (service role, scoped to verified user) ----
          const { data: order, error: orderErr } = await supabaseAdmin
            .from("orders")
            .insert({
              user_id: userId,
              challenge_id: challengeId,
              amount_paid: paidKobo,
              status: "paid",
              paystack_reference: reference,
            })
            .select("id")
            .single();
          if (orderErr || !order) {
            return Response.json(
              { error: orderErr?.message ?? "Order creation failed" },
              { status: 500 },
            );
          }

          return Response.json({ ok: true, order_id: order.id });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Verification failed";
          console.error("[verify-payment] unexpected", msg);
          return Response.json({ error: msg }, { status: 500 });
        }
      },
    },
  },
});