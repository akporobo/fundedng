import { useEffect, useState } from "react";
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

const FLAG = "fng-new-user";

/**
 * Shown ONCE to a freshly signed-up user, immediately after they land on
 * their dashboard for the first time. Encourages installing the PWA on
 * their device. The flag is set in the register flow and cleared here so
 * existing users never see it.
 */
export function NewUserInstallPrompt() {
  const { available, install, isIOS, isStandalone } = useInstallPrompt();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let isNew = false;
    try {
      isNew = localStorage.getItem(FLAG) === "1";
    } catch {
      /* ignore */
    }
    if (!isNew) return;
    // Already installed — no need to prompt; just clear the flag.
    if (isStandalone) {
      try { localStorage.removeItem(FLAG); } catch { /* ignore */ }
      return;
    }
    const t = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(t);
  }, [isStandalone]);

  const close = () => {
    setOpen(false);
    try { localStorage.removeItem(FLAG); } catch { /* ignore */ }
  };

  const handleInstall = async () => {
    const ok = await install();
    if (!ok) {
      toast.info("Use your browser menu → 'Install app' / 'Add to Home Screen'.");
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
          {!isIOS && available && (
            <Button className="font-display" onClick={handleInstall}>
              <Download className="mr-2 h-4 w-4" /> Install App
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
