import { Link } from "@tanstack/react-router";
import { Brand } from "./Brand";

/**
 * Minimal public header — logo on the left, "Sign In" link on the right.
 * Used on /, /rules, /agreement.
 */
export function PublicHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Brand />
        <Link
          to="/auth/login"
          className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}