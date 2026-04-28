import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const REF_KEY = "fng-ref";

/**
 * Reads ?ref=CODE from any URL on the site, persists it in localStorage,
 * and once a user signs in (and has no referrer yet) attaches the referral
 * via attach_referral RPC. Domain-agnostic by design.
 */
export function ReferralCapture() {
  const { user } = useAuth();

  // 1. Capture ?ref=CODE from URL into localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("ref");
      if (code && code.length >= 4) {
        localStorage.setItem(REF_KEY, code.toUpperCase());
      }
    } catch {
      /* ignore */
    }
  }, []);

  // 2. After signin, attach the referral (server-side validates self-ref + dups)
  useEffect(() => {
    if (!user) return;
    let code: string | null = null;
    try { code = localStorage.getItem(REF_KEY); } catch { /* ignore */ }
    if (!code) return;
    supabase.rpc("attach_referral", { _code: code }).then(({ data, error }) => {
      if (!error && data) {
        try { localStorage.removeItem(REF_KEY); } catch { /* ignore */ }
      }
    });
  }, [user]);

  return null;
}
