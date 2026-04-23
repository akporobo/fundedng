import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({ component: AuthLayout });

function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate({ to: "/auth/login" });
  }, [isLoading, isAuthenticated, navigate]);
  if (isLoading || !isAuthenticated)
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  return <Outlet />;
}
