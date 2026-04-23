import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/_admin")({ component: AdminLayout });

function AdminLayout() {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && !isAdmin) navigate({ to: "/dashboard" });
  }, [isLoading, isAdmin, navigate]);
  if (isLoading || !isAdmin)
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  return <Outlet />;
}
