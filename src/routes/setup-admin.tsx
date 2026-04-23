import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { SiteNav } from "@/components/site/SiteNav";
import { toast } from "sonner";

export const Route = createFileRoute("/setup-admin")({ component: SetupAdmin });

function SetupAdmin() {
  const { isAuthenticated, isAdmin, isLoading, refresh } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const claim = async () => {
    setBusy(true);
    const { data, error } = await supabase.rpc("claim_admin_if_unclaimed");
    setBusy(false);
    if (error) return toast.error(error.message);
    if (data) {
      toast.success("You are now an admin.");
      await refresh();
      navigate({ to: "/admin" });
    } else {
      toast.error("An admin already exists. Ask them to grant you the admin role.");
    }
  };

  return (
    <div className="min-h-screen">
      <SiteNav />
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <h1 className="font-display text-4xl font-bold">First-time admin setup</h1>
        <p className="mt-3 text-muted-foreground">
          Claim the admin role for this platform. This works only once — as soon as the first admin
          exists, this page is locked.
        </p>
        {isLoading ? (
          <p className="mt-8 text-muted-foreground">Loading…</p>
        ) : !isAuthenticated ? (
          <div className="mt-8 space-y-3">
            <p>You need to sign in first.</p>
            <Link to="/auth/login"><Button>Sign in</Button></Link>
          </div>
        ) : isAdmin ? (
          <div className="mt-8 space-y-3">
            <p>You're already an admin.</p>
            <Link to="/admin"><Button>Open admin console</Button></Link>
          </div>
        ) : (
          <Button className="mt-8" onClick={claim} disabled={busy}>
            {busy ? "Claiming…" : "Claim admin role"}
          </Button>
        )}
      </div>
    </div>
  );
}