import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  createMt5DemoAccount,
  deployMetaApiAccount,
  getUserEmail,
} from "@/lib/metaapi.server";

/**
 * Provisions a real MT5 demo account on ICMarkets-Demo via MetaApi,
 * stores the credentials on trader_accounts, marks the order delivered,
 * and notifies the user. Idempotent: re-runs are safe.
 */
export const Route = createFileRoute("/api/deliver-account")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { order_id } = (await request.json()) as { order_id?: string };
          if (!order_id) {
            return Response.json({ error: "order_id required" }, { status: 400 });
          }

          const { data: order } = await supabaseAdmin
            .from("orders")
            .select("*")
            .eq("id", order_id)
            .maybeSingle();
          if (!order) return Response.json({ error: "Order not found" }, { status: 404 });

          // Idempotency: account already exists for this order.
          const { data: existing } = await supabaseAdmin
            .from("trader_accounts")
            .select("id, mt5_login")
            .eq("order_id", order.id)
            .maybeSingle();
          if (existing) {
            return Response.json({ ok: true, already: true, login: existing.mt5_login });
          }

          const { data: ch } = await supabaseAdmin
            .from("challenges")
            .select("*")
            .eq("id", order.challenge_id)
            .single();
          if (!ch) return Response.json({ error: "Challenge missing" }, { status: 500 });

          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("full_name, phone")
            .eq("id", order.user_id)
            .single();

          const email = await getUserEmail(order.user_id);
          if (!email) {
            return Response.json(
              { error: "Could not resolve user email" },
              { status: 500 },
            );
          }

          // Call MetaApi to create the actual MT5 demo account.
          let mtCreds;
          try {
            mtCreds = await createMt5DemoAccount({
              email,
              name: profile?.full_name || "FundedNG Trader",
              phone: profile?.phone || "+2348000000000",
              balance: ch.account_size,
            });
          } catch (e) {
            const msg = e instanceof Error ? e.message : "MetaApi failed";
            await supabaseAdmin
              .from("account_requests")
              .update({
                status: "failed",
                failure_reason: msg,
                attempts: 1,
                provider_response: { error: msg },
              })
              .eq("order_id", order.id);
            await supabaseAdmin.from("mt5_worker_events").insert({
              event_type: "metaapi_create_failed",
              worker_id: "metaapi",
              payload: { order_id: order.id, error: msg },
            });
            return Response.json({ error: msg }, { status: 502 });
          }

          // Deploy to MetaApi cloud so we can poll equity later.
          const metaapiAccountId = await deployMetaApiAccount({
            login: mtCreds.login,
            password: mtCreds.password,
            serverName: mtCreds.serverName,
            name: `${profile?.full_name ?? "Trader"} - ${ch.name}`,
          });

          // Persist credentials on trader_accounts.
          const { error: insertErr } = await supabaseAdmin.from("trader_accounts").insert({
            user_id: order.user_id,
            order_id: order.id,
            challenge_id: order.challenge_id,
            mt5_login: mtCreds.login,
            mt5_password: mtCreds.password,
            investor_password: mtCreds.investorPassword,
            mt5_server: mtCreds.serverName,
            metaapi_account_id: metaapiAccountId,
            provider: "metaapi",
            starting_balance: ch.account_size,
            current_equity: ch.account_size,
            current_phase: 1,
            status: "active",
          });
          if (insertErr) {
            return Response.json({ error: insertErr.message }, { status: 500 });
          }

          await supabaseAdmin
            .from("orders")
            .update({ status: "delivered" })
            .eq("id", order.id);

          await supabaseAdmin
            .from("account_requests")
            .update({
              status: "fulfilled",
              fulfilled_at: new Date().toISOString(),
              claimed_by: "metaapi",
              provider_response: { login: mtCreds.login, server: mtCreds.serverName },
            })
            .eq("order_id", order.id);

          await supabaseAdmin.from("mt5_worker_events").insert({
            event_type: "metaapi_create_ok",
            worker_id: "metaapi",
            payload: { order_id: order.id, login: mtCreds.login, metaapi_account_id: metaapiAccountId },
          });

          await supabaseAdmin.from("notifications").insert({
            user_id: order.user_id,
            title: "🎉 Your MT5 Account is Ready",
            message: `${ch.name} active. Login: ${mtCreds.login} · Server: ${mtCreds.serverName}. Open the dashboard to view your password.`,
            type: "welcome",
          });

          return Response.json({ ok: true, login: mtCreds.login, server: mtCreds.serverName });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "fail";
          console.error("[deliver-account] unexpected", msg);
          return Response.json({ error: msg }, { status: 500 });
        }
      },
    },
  },
});