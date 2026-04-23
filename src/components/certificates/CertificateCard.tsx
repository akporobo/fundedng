import { useRef, useState } from "react";
import { Award, Trophy, Download, FileImage, FileText } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export interface Certificate {
  id: string;
  kind: "funded" | "payout";
  certificate_number: string;
  full_name: string;
  account_size: number;
  challenge_name: string;
  mt5_login: string;
  payout_amount: number | null;
  issued_at: string;
}

export function CertificateCard({ cert }: { cert: Certificate }) {
  const isPayout = cert.kind === "payout";
  const title = isPayout ? "Payout Certificate" : "Funded Trader Certificate";
  const Icon = isPayout ? Award : Trophy;
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const safeName = cert.full_name.replace(/[^a-z0-9]+/gi, "_").toLowerCase();
  const filename = `fundedng-${cert.kind}-${safeName}-${cert.certificate_number}`;

  const renderCanvas = async () => {
    const node = cardRef.current;
    if (!node) throw new Error("Card not ready");
    const html2canvas = (await import("html2canvas")).default;
    return html2canvas(node, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });
  };

  const downloadPng = async () => {
    setExporting(true);
    try {
      const canvas = await renderCanvas();
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Certificate downloaded");
    } catch (e) {
      console.error(e);
      toast.error("Could not export certificate");
    } finally {
      setExporting(false);
    }
  };

  const downloadPdf = async () => {
    setExporting(true);
    try {
      const canvas = await renderCanvas();
      const { jsPDF } = await import("jspdf");
      const imgData = canvas.toDataURL("image/png");
      // Landscape A4: 297 x 210 mm
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 12;
      const maxW = pageW - margin * 2;
      const maxH = pageH - margin * 2;
      const ratio = canvas.width / canvas.height;
      let w = maxW;
      let h = w / ratio;
      if (h > maxH) {
        h = maxH;
        w = h * ratio;
      }
      const x = (pageW - w) / 2;
      const y = (pageH - h) / 2;
      pdf.addImage(imgData, "PNG", x, y, w, h);
      pdf.save(`${filename}.pdf`);
      toast.success("Certificate PDF saved");
    } catch (e) {
      console.error(e);
      toast.error("Could not export PDF");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-[0_10px_40px_-12px_var(--primary-glow)]"
      >
        {/* Decorative ring */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />

        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-primary/40 bg-primary/10 p-2.5">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">FundedNG</div>
              <div className="font-display text-base font-bold text-foreground">{title}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Cert No.</div>
            <div className="font-mono text-[11px] text-primary">{cert.certificate_number}</div>
          </div>
        </div>

        <div className="relative mt-6">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Awarded to</div>
          <div className="font-display mt-1 text-2xl font-bold text-foreground">{cert.full_name}</div>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {isPayout
              ? `For a successful profit payout from a funded ${cert.challenge_name} account.`
              : `For successfully passing all evaluation phases of the ${cert.challenge_name} program.`}
          </p>
        </div>

        <div className="relative mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Account Size" value={formatNaira(cert.account_size)} />
          <Stat label="MT5 Login" value={cert.mt5_login} mono />
          {isPayout && cert.payout_amount != null ? (
            <Stat label="Payout" value={formatNaira(cert.payout_amount)} accent />
          ) : (
            <Stat label="Status" value="FUNDED" accent />
          )}
          <Stat
            label="Issued"
            value={new Date(cert.issued_at).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          />
        </div>

        <div className="relative mt-6 flex items-end justify-between border-t border-border/60 pt-4">
          <div>
            <div className="font-display text-lg italic text-primary">FundedNG</div>
            <div className="text-[10px] text-muted-foreground">Authorized Signatory</div>
          </div>
          <div className="rounded-md border border-primary/30 bg-primary/5 px-2 py-1">
            <div className="font-display text-[10px] uppercase tracking-[0.18em] text-primary">
              Verified · Naira-funded
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" disabled={exporting}>
              <Download className="mr-1 h-4 w-4" />
              {exporting ? "Exporting…" : "Download"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={downloadPdf}>
              <FileText className="mr-2 h-4 w-4" /> PDF (A4 landscape)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={downloadPng}>
              <FileImage className="mr-2 h-4 w-4" /> PNG image
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  mono,
  accent,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div
        className={`mt-1 text-sm font-semibold ${accent ? "text-primary font-display" : ""} ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
