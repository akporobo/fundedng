import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Server-side Paystack initialization for the redirect/standard checkout flow.
 *
 * Authenticates the caller, looks up the challenge price on the server (so
 * the browser can't tamper with it), then asks Paystack to create a
 * transaction and returns the hosted `authorization_url` for the client to
 * redirect to. After payment Paystack redirects back to `callback_url`, where
 * `/payment/callback` calls `/api/verify-payment` to finalize the order.
 */
export const Route = createFileRoute("/api/initialize-payment")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get("authorization");
          const token = authHeader?.startsWith("Bearer ")
            ? authHeader.slice("Bearer ".length).trim()
            : null;
          if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

          const { data: userData, error: authErr } = await supabaseAdmin.auth.getUser(token);
          if (authErr || !userData?.user?.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
          }
          const user = userData.user;

          const body = (await request.json().catch(() => ({}))) as { challenge_id?: string; discount_code?: string; partner_promo_code?: string };
          const challengeId = body.challenge_id?.trim();
          if (!challengeId) {
            return Response.json({ error: "challenge_id is required" }, { status: 400 });
          }

          const { data: challenge, error: chErr } = await supabaseAdmin
            .from("challenges")
            .select("id, name, price_naira, is_active")
            .eq("id", challengeId)
            .maybeSingle();
          if (chErr || !challenge || !challenge.is_active) {
            return Response.json({ error: "Challenge not available" }, { status: 404 });
          }

          const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
          if (!paystackSecret) {
            console.error("[initialize-payment] PAYSTACK_SECRET_KEY missing");
            return Response.json({ error: "Payment is not configured" }, { status: 500 });
          }

          // Prefer an explicit public site URL (set PUBLIC_SITE_URL secret to
          // e.g. https://fundedng.lovable.app) so Paystack never redirects to
          // localhost or a sandbox preview URL. Fall back to the browser's
          // Origin/Referer header, then finally to the request URL.
          const headerOrigin = request.headers.get("origin");
          const referer = request.headers.get("referer");
          let origin =
            process.env.PUBLIC_SITE_URL?.trim() ||
            headerOrigin ||
            (referer ? new URL(referer).origin : "") ||
            new URL(request.url).origin;
          // Hard guard: never send Paystack a localhost callback in production.
          if (/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(origin)) {
            origin = process.env.PUBLIC_SITE_URL?.trim() || origin;
          }
          const reference = `FNG-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
          const originalAmountNaira = Number(challenge.price_naira);
          let discountCode: string | null = null;
          let partnerPromoCode: string | null = null;
          let promoPercent = 0;
          let partnerPercent = 0;

          if (body.discount_code?.trim()) {
            const code = body.discount_code.trim().toUpperCase();
            const { data: promoRows } = await supabaseAdmin.rpc("validate_discount_code" as never, { _code: code } as never) as any;
            const promo = Array.isArray(promoRows) ? promoRows[0] : null;
            if (promo) {
              discountCode = promo.code;
              promoPercent = Number(promo.percent_off) || 0;
            }
          }

          if (body.partner_promo_code?.trim()) {
            const code = body.partner_promo_code.trim().toUpperCase();
            const { data: partner } = await supabaseAdmin
              .from("partner_profiles")
              .select("promo_code")
              .eq("promo_code", code)
              .eq("is_active", true)
              .maybeSingle();
            if (partner) {
              partnerPromoCode = code;
              partnerPercent = 15;
            }
          }

          if (!partnerPercent) {
            const { data: prof } = await supabaseAdmin
              .from("profiles")
              .select("partner_referred_by")
              .eq("id", user.id)
              .maybeSingle();
            if (prof?.partner_referred_by) {
              const { data: partner } = await supabaseAdmin
                .from("partner_profiles")
                .select("promo_code")
                .eq("user_id", prof.partner_referred_by)
                .eq("is_active", true)
                .maybeSingle();
              if (partner) {
                partnerPromoCode = partner.promo_code;
                partnerPercent = 15;
              }
            }
          }

          const discountPercent = Math.max(promoPercent, partnerPercent);
          const discountAmountNaira = Math.floor(originalAmountNaira * discountPercent / 100);
          const amountKobo = Math.max(0, originalAmountNaira - discountAmountNaira) * 100;

          const initRes = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${paystackSecret}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              amount: amountKobo,
              currency: "NGN",
              reference,
              callback_url: `${origin}/payment/callback?challenge_id=${encodeURIComponent(challengeId)}`,
              metadata: {
                challenge_id: challenge.id,
                challenge_name: challenge.name,
                user_id: user.id,
                original_amount: originalAmountNaira * 100,
                discount_amount: discountAmountNaira * 100,
                discount_percent: discountPercent,
                discount_code: discountCode,
                partner_promo_code: partnerPromoCode,
              },
            }),
          });

          const initJson = (await initRes.json().catch(() => ({}))) as {
            status?: boolean;
            message?: string;
            data?: { authorization_url?: string; reference?: string };
          };

          if (!initRes.ok || !initJson.status || !initJson.data?.authorization_url) {
            return Response.json(
              { error: initJson.message ?? "Could not start payment" },
              { status: 400 },
            );
          }

          return Response.json({
            ok: true,
            authorization_url: initJson.data.authorization_url,
            reference: initJson.data.reference ?? reference,
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Initialization failed";
          console.error("[initialize-payment] unexpected", msg);
          return Response.json({ error: msg }, { status: 500 });
        }
      },
    },
  },
});