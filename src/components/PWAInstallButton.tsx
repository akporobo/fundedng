import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
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
 * Floating PWA install button. Shown to all visitors on the homepage and
 * to authenticated users on the dashboard. Hidden in iframes/preview hosts
 * and once installed or dismissed.
 */
export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BIPEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isPreviewOrIframe()) return;
    if (window.matchMedia?.("(display-mode: standalone)").matches) return;
    if (localStorage.getItem("pwa-dismissed")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BIPEvent);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem("pwa-dismissed", "1");
    } catch {
      /* ignore */
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 z-[60] mx-auto w-[min(420px,calc(100%-1.5rem))] md:bottom-4">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background/95 p-3 shadow-lg backdrop-blur-xl">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <Download className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-sm font-semibold">Install FundedNG</div>
          <div className="truncate text-[11px] text-muted-foreground">Add to home screen</div>
        </div>
        <Button size="sm" onClick={install} className="font-display">
          Install
        </Button>
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
 * Imperatively trigger the install prompt if available, returning whether
 * it was actually shown. Used by the post-purchase modal.
 */
export function triggerInstallPrompt(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    const w = window as unknown as { __fundedngBIP?: BIPEvent };
    const evt = w.__fundedngBIP;
    if (!evt) return resolve(false);
    evt
      .prompt()
      .then(() => evt.userChoice)
      .then(({ outcome }) => resolve(outcome === "accepted"))
      .catch(() => resolve(false));
  });
}

// Capture beforeinstallprompt globally so triggerInstallPrompt can fire it
// even when the floating banner isn't mounted.
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    (window as unknown as { __fundedngBIP?: Event }).__fundedngBIP = e;
  });
}