import { Link, useLocation } from "@tanstack/react-router";
import { Home, ShoppingBag, LayoutDashboard, Users, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { to: "/buy", label: "Buy", icon: ShoppingBag, match: (p: string) => p.startsWith("/buy") },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, match: (p: string) => p.startsWith("/dashboard"), authOnly: true },
  { to: "/community", label: "Community", icon: Users, match: (p: string) => p.startsWith("/community") },
  { to: "/profile", label: "Profile", icon: User, match: (p: string) => p.startsWith("/profile") || p.startsWith("/auth") },
] as const;

export function MobileBottomNav() {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();

  // Hide on full-screen chat pages where the composer needs the bottom space.
  if (/^\/community\/[^/]+/.test(pathname)) return null;

  const items = ITEMS.map((item) => {
    if (item.label === "Profile" && !isAuthenticated) {
      return { ...item, to: "/auth/login" as const };
    }
    if (item.label === "Dashboard" && !isAuthenticated) {
      return { ...item, to: "/auth/login" as const };
    }
    return item;
  });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex h-16 max-w-lg items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "scale-110")} />
              <span className="font-display tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}