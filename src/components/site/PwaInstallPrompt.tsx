import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Captures the browser's `beforeinstallprompt` event and shows a styled
 * install banner. Hidden inside iframes / Lovable preview hosts and once
 * the user dismisses or installs.
 */

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "fundedng-pwa-dismissed-at";
const DISMISS_DAYS = 7;

function isPreviewOrIframe() {
  if (typeof window === "undefined") return true;
  try {
    if (window.self !== window.top) return true;
  } catch {
    return true;
  }
  const h = window.location.hostname;
  return h.includes("id-preview--") || h.includes("lovableproject.com") || h.includes("lovable.dev");
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function recentlyDismissed() {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = parseInt(raw, 10);
    return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export function PwaInstallPrompt() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if (isPreviewOrIframe() || isStandalone() || recentlyDismissed()) return;

    const onBIP = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", onBIP);

    // iOS Safari never fires beforeinstallprompt — show a manual hint instead.
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    if (isIOS && isSafari) {
      const t = window.setTimeout(() => setIosHint(true), 4000);
      return () => {
        window.clearTimeout(t);
        window.removeEventListener("beforeinstallprompt", onBIP);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setEvt(null);
    setIosHint(false);
  };

  const install = async () => {
    if (!evt) return;
    await evt.prompt();
    const { outcome } = await evt.userChoice;
    if (outcome === "accepted") setEvt(null);
    else dismiss();
  };

  if (!evt && !iosHint) return null;

  return (
    <div className="fixed inset-x-0 bottom-16 z-[60] mx-auto w-[min(420px,calc(100%-1.5rem))] md:bottom-4">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background/95 p-3 shadow-lg backdrop-blur-xl">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <Download className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-sm font-semibold">Install FundedNG</div>
          <div className="truncate text-[11px] text-muted-foreground">
            {evt ? "Add to your home screen for instant access & alerts." : "Tap Share, then \"Add to Home Screen\"."}
          </div>
        </div>
        {evt && (
          <Button size="sm" onClick={install} className="font-display">
            Install
          </Button>
        )}
        <button
          onClick={dismiss}
          className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}