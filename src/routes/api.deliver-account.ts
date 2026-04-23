import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/deliver-account")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { order_id } = (await request.json()) as { order_id?: string };
          if (!order_id) return new Response(JSON.stringify({ error: "order_id required" }), { status: 400 });

          const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", order_id).maybeSingle();
          if (!order) return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
          if (order.status === "delivered") return new Response(JSON.stringify({ ok: true, already: true }));

          const { data: ch } = await supabaseAdmin.from("challenges").select("*").eq("id", order.challenge_id).single();
          if (!ch) return new Response(JSON.stringify({ error: "Challenge missing" }), { status: 500 });

          const login = String(10000000 + Math.floor(Math.random() * 89999999));
          const password = `Tr${Math.random().toString(36).slice(2, 10)}!`;

          const { error: insertErr } = await supabaseAdmin.from("trader_accounts").insert({
            user_id: order.user_id,
            order_id: order.id,
            challenge_id: order.challenge_id,
            mt5_login: login,
            mt5_password: password,
            mt5_server: "Exness-MT5Demo",
            starting_balance: ch.account_size,
            current_equity: ch.account_size,
            current_phase: 1,
            status: "active",
          });
          if (insertErr) return new Response(JSON.stringify({ error: insertErr.message }), { status: 500 });

          await supabaseAdmin.from("orders").update({ status: "delivered" }).eq("id", order.id);
          await supabaseAdmin.from("notifications").insert({
            user_id: order.user_id,
            title: "🎉 Your MT5 Account is Ready",
            message: `${ch.name} challenge active. Login: ${login} · Server: Exness-MT5Demo. Password sent separately.`,
            type: "welcome",
          });

          return Response.json({ ok: true, login });
        } catch (e) {
          return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "fail" }), { status: 500 });
        }
      },
    },
  },
});
