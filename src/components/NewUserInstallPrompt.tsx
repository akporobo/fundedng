import { useEffect, useRef, useState } from "react";
import { Download, Smartphone, Share, Plus as PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/components/PWAInstallButton";
import { toast } from "sonner";

// Set by the registration flow to mark this browser as a freshly signed-up user.
const NEW_USER_FLAG = "fng-new-user";
// Set permanently after we've shown (or attempted) the prompt — survives refresh,
// so we never nag the same browser twice even if they dismiss without installing.
const PROMPT_SHOWN_FLAG = "fng-install-prompt-shown";

/**
 * Shown ONCE to a freshly signed-up user, immediately after they land on
 * their dashboard for the first time. Triggers the native PWA install flow
 * on supported browsers (Chrome / Edge / Android via beforeinstallprompt)
 * and shows native Add-to-Home-Screen instructions on iOS Safari.
 *
 * Once shown, a permanent localStorage flag is set so the dialog never
 * reappears for this browser — even after refresh, sign-out, or dismiss.
 */
export function NewUserInstallPrompt() {
  const { available, install, isIOS, isStandalone } = useInstallPrompt();
  const [open, setOpen] = useState(false);
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (triggeredRef.current) return;

    let isNew = false;
    let alreadyShown = false;
    try {
      isNew = localStorage.getItem(NEW_USER_FLAG) === "1";
      alreadyShown = localStorage.getItem(PROMPT_SHOWN_FLAG) === "1";
    } catch {
      /* ignore */
    }

    if (!isNew) return;
    if (alreadyShown) {
      // Cleanup stale new-user flag — they've already seen the prompt.
      try { localStorage.removeItem(NEW_USER_FLAG); } catch { /* ignore */ }
      return;
    }
    // Already installed — no need to prompt; persist both flags and bail.
    if (isStandalone) {
      try {
        localStorage.setItem(PROMPT_SHOWN_FLAG, "1");
        localStorage.removeItem(NEW_USER_FLAG);
      } catch { /* ignore */ }
      return;
    }
    // On non-iOS, wait briefly to let the browser fire `beforeinstallprompt`
    // before we render — that way the "Install App" button is enabled.
    const delay = isIOS ? 800 : 1500;
    const t = setTimeout(() => {
      triggeredRef.current = true;
      setOpen(true);
      // Persist immediately on open so a refresh mid-dialog never reshows it.
      try {
        localStorage.setItem(PROMPT_SHOWN_FLAG, "1");
        localStorage.removeItem(NEW_USER_FLAG);
      } catch { /* ignore */ }
    }, delay);
    return () => clearTimeout(t);
  }, [isStandalone, isIOS]);

  const close = () => {
    setOpen(false);
  };

  const handleInstall = async () => {
    const ok = await install();
    if (!ok) {
      toast.info(
        "Open your browser menu (⋮) and tap 'Install app' or 'Add to Home Screen'.",
      );
    }
    close();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : close())}>
      <DialogContent className="mx-4 w-[calc(100%-2rem)] max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            👋 Welcome to FundedNG
          </DialogTitle>
          <DialogDescription>
            Install the app on your device for instant alerts on equity,
            drawdown and payouts — and one-tap access to your dashboard.
          </DialogDescription>
        </DialogHeader>

        {isIOS && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
            <div className="font-display mb-2 font-semibold">
              Install on iPhone / iPad
            </div>
            <p className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              Tap the <Share className="inline h-3.5 w-3.5" /> Share button in
              Safari, then <PlusIcon className="inline h-3.5 w-3.5" />
              <strong>Add to Home Screen</strong>.
            </p>
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-2">
          <Button variant="outline" onClick={close} className="font-display">
            <Smartphone className="mr-2 h-4 w-4" /> Maybe later
          </Button>
          {!isIOS && (
            <Button className="font-display" onClick={handleInstall}>
              <Download className="mr-2 h-4 w-4" /> Install Now
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
