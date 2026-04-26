import { useEffect, useState } from "react";
import { Download, X, Share, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Module-level shared state so any component can call install()
let globalDeferredPrompt: BIPEvent | null = null;
const listeners: Array<() => void> = [];

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    e.preventDefault();
    globalDeferredPrompt = e as BIPEvent;
    notifyListeners();
  });
  window.addEventListener("appinstalled", () => {
    globalDeferredPrompt = null;
    try {
      localStorage.setItem("pwa-installed", "1");
    } catch {
      /* ignore */
    }
    notifyListeners();
  });
}

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

/**
 * Hook to query the shared install prompt. Works across components.
 */
export function useInstallPrompt() {
  const [available, setAvailable] = useState(!!globalDeferredPrompt);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = navigator.userAgent;
    setIsIOS(/iphone|ipad|ipod/i.test(ua) && !/crios|fxios/i.test(ua));
    setIsStandalone(
      window.matchMedia?.("(display-mode: standalone)").matches ||
        // @ts-expect-error iOS standalone
        !!window.navigator.standalone,
    );

    const update = () => setAvailable(!!globalDeferredPrompt);
    listeners.push(update);
    return () => {
      const idx = listeners.indexOf(update);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!globalDeferredPrompt) return false;
    try {
      await globalDeferredPrompt.prompt();
      const { outcome } = await globalDeferredPrompt.userChoice;
      if (outcome === "accepted") {
        globalDeferredPrompt = null;
        notifyListeners();
        return true;
      }
    } catch {
      /* ignore */
    }
    return false;
  };

  return { available, install, isIOS, isStandalone };
}

/**
 * Floating PWA install banner. Auto-shows after 3s on the homepage / dashboard
 * when installable. Hidden in iframes/preview hosts and once dismissed.
 */
export function PWAInstallButton() {
  const { available, install, isIOS, isStandalone } = useInstallPrompt();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isPreviewOrIframe()) return;
    try {
      if (localStorage.getItem("pwa-dismissed")) {
        setDismissed(true);
        return;
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (dismissed || isStandalone) return;
    if (available || isIOS) {
      const t = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(t);
    }
  }, [available, isIOS, isStandalone, dismissed]);

  const handleInstall = async () => {
    const ok = await install();
    if (ok) setShow(false);
  };

  const dismiss = () => {
    setShow(false);
    setDismissed(true);
    try {
      localStorage.setItem("pwa-dismissed", "1");
    } catch {
      /* ignore */
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 z-[60] mx-auto w-[min(420px,calc(100%-1.5rem))] md:bottom-4">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background/95 p-3 shadow-2xl backdrop-blur-xl">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <Download className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-sm font-semibold">Install FundedNG</div>
          {isIOS ? (
            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
              Tap <Share className="inline h-3 w-3" /> then <Plus className="inline h-3 w-3" /> Add to Home Screen
            </div>
          ) : (
            <div className="truncate text-[11px] text-muted-foreground">
              Add to home screen for the best experience
            </div>
          )}
        </div>
        {!isIOS && available && (
          <Button size="sm" onClick={handleInstall} className="font-display">
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

/**
 * Backwards-compat wrapper for older callers.
 */
export async function triggerInstallPrompt(): Promise<boolean> {
  if (!globalDeferredPrompt) return false;
  try {
    await globalDeferredPrompt.prompt();
    const { outcome } = await globalDeferredPrompt.userChoice;
    if (outcome === "accepted") {
      globalDeferredPrompt = null;
      notifyListeners();
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}
