import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Home, PlusCircle, Users, User, ShieldCheck, LogOut } from "lucide-react";
import { Brand } from "./Brand";
import { NotificationBell } from "./NotificationBell";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: Home, match: (p: string) => p.startsWith("/dashboard") },
  { to: "/buy", label: "Buy", icon: PlusCircle, match: (p: string) => p.startsWith("/buy") },
  { to: "/community", label: "Community", icon: Users, match: (p: string) => p.startsWith("/community") },
  { to: "/profile", label: "Profile", icon: User, match: (p: string) => p.startsWith("/profile") },
] as const;

/**
 * Persistent authenticated app layout.
 * - Top bar with logo + notification bell
 * - Mobile: bottom nav with 4 tabs
 * - Desktop: left sidebar with same items + user card at bottom
 */
export function AppShell() {
  const { pathname } = useLocation();
  const { user, profile, isAdmin, signOut } = useAuth();

  // On the full-screen chat route the composer lives at the bottom, so we
  // hide the mobile bottom-nav there. The top bar + desktop sidebar stay
  // visible for navigation consistency.
  const isChat = /^\/community\/[^/]+/.test(pathname);

  const initials = (profile?.full_name || user?.email || "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-background/60 md:flex md:fixed md:inset-y-0 md:left-0">
        <div className="flex h-16 items-center px-6">
          <Brand />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <ShieldCheck className="h-4 w-4" /> Admin
            </Link>
          )}
        </nav>

        {/* User card at bottom */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-md p-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 font-display text-xs font-bold text-primary">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-display truncate text-sm font-semibold">
                {profile?.full_name || "Trader"}
              </div>
              <div className="truncate text-[10px] text-muted-foreground">{user?.email}</div>
            </div>
            <button
              onClick={signOut}
              className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="min-w-0 flex-1 md:ml-60">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
          <div className="md:hidden">
            <Brand />
          </div>
          <div className="hidden md:block" />
          <NotificationBell />
        </header>

        <main className={cn(isChat ? "pb-0" : "pb-24 md:pb-0")}>
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl md:hidden",
          isChat && "hidden",
        )}
      >
        <div className="mx-auto flex h-16 max-w-lg items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
          {NAV.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5", active && "scale-110")} />
                <span className="font-display tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
