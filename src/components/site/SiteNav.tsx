import { Link } from "@tanstack/react-router";
import { Brand } from "./Brand";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { ThemeToggle } from "./ThemeToggle";

export function SiteNav() {
  const { isAuthenticated, isAdmin } = useAuth();
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Brand />
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm">Admin</Button>
                </Link>
              )}
              <Link to="/rules">
                <Button variant="ghost" size="sm">Rules</Button>
              </Link>
              <Link to="/community">
                <Button variant="ghost" size="sm">Community</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              <Link to="/buy">
                <Button size="sm" className="font-display">Get Funded →</Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/rules">
                <Button variant="ghost" size="sm">Rules</Button>
              </Link>
              <Link to="/community">
                <Button variant="ghost" size="sm">Community</Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/buy">
                <Button size="sm" className="font-display">Get Funded →</Button>
              </Link>
            </>
          )}
        </div>
        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
