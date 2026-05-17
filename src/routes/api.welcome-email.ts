import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendWelcomeEmail } from "@/lib/email.server";

export const Route = createFileRoute("/api/welcome-email")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json().catch(() => ({}))) as {
            userId?: string;
            email?: string;
            fullName?: string;
          };
          const { userId, email, fullName } = body;
          if (!userId || !email || !fullName) {
            return Response.json(
              { error: "userId, email, and fullName are required" },
              { status: 400 },
            );
          }

          const { data: user, error: userErr } =
            await supabaseAdmin.auth.admin.getUserById(userId);
          if (userErr || !user?.user) {
            return Response.json({ error: "User not found" }, { status: 404 });
          }

          const firstName = fullName.split(" ")[0] || fullName;
          sendWelcomeEmail(email, firstName);

          return Response.json({ ok: true });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Welcome email failed";
          console.error("[welcome-email] unexpected", msg);
          return Response.json({ error: msg }, { status: 500 });
        }
      },
    },
  },
});
