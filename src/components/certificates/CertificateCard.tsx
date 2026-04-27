import { useRef, useState } from "react";
import { Download, FileImage, FileText } from "lucide-react";
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const safeName = cert.full_name.replace(/[^a-z0-9]+/gi, "_").toLowerCase();
  const filename = `fundedng-${cert.kind}-${safeName}-${cert.certificate_number}`;

  const renderCanvas = async () => {
    const node = cardRef.current;
    if (!node) throw new Error("Card not ready");
    const { toPng } = await import("html-to-image");
    // html-to-image supports oklch() and modern CSS color functions
    const dataUrl = await toPng(node, {
      pixelRatio: 2,
      backgroundColor: "#0b0b0b",
      cacheBust: true,
    });
    return dataUrl;
  };

  const downloadPng = async () => {
    setExporting(true);
    try {
      const dataUrl = await renderCanvas();
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
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
      const dataUrl = await renderCanvas();
      const img = new Image();
      img.src = dataUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("image load failed"));
      });
      const { jsPDF } = await import("jspdf");
      // Landscape A4: 297 x 210 mm
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 12;
      const maxW = pageW - margin * 2;
      const maxH = pageH - margin * 2;
      const ratio = img.width / img.height;
      let w = maxW;
      let h = w / ratio;
      if (h > maxH) {
        h = maxH;
        w = h * ratio;
      }
      const x = (pageW - w) / 2;
      const y = (pageH - h) / 2;
      pdf.addImage(dataUrl, "PNG", x, y, w, h);
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
        className="relative aspect-[1.55/1] w-full overflow-hidden rounded-2xl border border-primary/30 bg-[#0b0b0b] text-white shadow-[0_10px_40px_-12px_var(--primary-glow)]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.04), transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(16,185,129,0.10), transparent 55%), linear-gradient(135deg, #0b0b0b 0%, #111111 60%, #0b0b0b 100%)",
        }}
      >
        {/* Decorative diagonal stripes (top-right) */}
        <svg
          className="pointer-events-none absolute -right-[8%] -top-[12%] h-[140%] w-[55%] opacity-90"
          viewBox="0 0 400 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g transform="rotate(28 200 300)">
            {[0, 14, 28, 42, 56, 70].map((x) => (
              <rect key={x} x={120 + x} y="-100" width="6" height="800" fill="#ffffff" opacity={0.85} />
            ))}
          </g>
        </svg>

        {/* Decorative concentric circle medallion (right side) */}
        <div className="pointer-events-none absolute right-[-14%] top-1/2 -translate-y-1/2">
          <div className="relative grid h-[130%] place-items-center">
            <div className="absolute h-[22rem] w-[22rem] rounded-full border-[10px] border-white/85 sm:h-[26rem] sm:w-[26rem]" />
            <div className="absolute h-[17rem] w-[17rem] rounded-full border-[8px] border-white/70 sm:h-[20rem] sm:w-[20rem]" />
            <div
              className="absolute h-[12rem] w-[12rem] rounded-full sm:h-[14rem] sm:w-[14rem]"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #1a1a1a 0%, #050505 70%)",
                boxShadow: "inset 0 0 30px rgba(0,0,0,0.6)",
              }}
            />
            <div className="font-display absolute text-5xl font-black tracking-tighter text-white sm:text-6xl">
              <span className="text-primary">F</span>NG
            </div>
          </div>
        </div>

        {/* Top-left brand */}
        <div className="relative flex items-center gap-2 px-6 pt-6 sm:px-10 sm:pt-8">
          <div className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-white/5">
            <span className="font-display text-sm font-black text-primary">F</span>
          </div>
          <span className="font-display text-base font-bold tracking-wider text-white sm:text-lg">
            FUNDED<span className="text-primary">NG</span>
          </span>
        </div>

        {/* Title block */}
        <div className="relative mt-6 max-w-[62%] px-6 sm:mt-10 sm:px-10">
          <div className="font-display text-2xl font-black uppercase tracking-tight text-white sm:text-4xl">
            <span className="border-b-2 border-white pb-1">
              {isPayout ? "Payout" : "Funded Trader"}
            </span>{" "}
            <span className="border-b-2 border-white pb-1">Certificate</span>
          </div>

          <div className="mt-5 text-center text-[10px] font-medium uppercase tracking-[0.32em] text-white/80 sm:text-xs">
            Proudly Presented To
          </div>

          <div
            className="mt-3 text-center text-3xl text-white sm:text-5xl"
            style={{ fontFamily: "'Pinyon Script', 'Great Vibes', cursive", lineHeight: 1.1 }}
          >
            {cert.full_name}
          </div>

          {/* Headline figure */}
          <div className="font-display mt-4 text-center text-3xl font-black tracking-tight text-white sm:text-5xl">
            {isPayout && cert.payout_amount != null
              ? formatNaira(cert.payout_amount)
              : formatNaira(cert.account_size)}
          </div>

          <div className="mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70 sm:text-xs">
            {new Date(cert.issued_at).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Bottom-left signature block */}
        <div className="absolute bottom-5 left-6 max-w-[40%] sm:bottom-7 sm:left-10">
          <div
            className="text-2xl text-white sm:text-3xl"
            style={{ fontFamily: "'Pinyon Script', 'Great Vibes', cursive", lineHeight: 1 }}
          >
            Byemi
          </div>
          <div className="mt-1 h-px w-28 bg-white/70" />
          <div className="font-display mt-2 text-[9px] font-bold tracking-[0.2em] text-white/85 sm:text-[10px]">
            BEN OYEYEMI — CEO
          </div>
        </div>

        {/* Bottom-right cert number */}
        <div className="absolute bottom-5 right-6 text-right sm:bottom-7 sm:right-10">
          <div className="font-display text-[8px] uppercase tracking-[0.25em] text-white/50">
            Certificate No.
          </div>
          <div className="font-mono text-[10px] text-white/90 sm:text-xs">
            {cert.certificate_number}
          </div>
          <div className="font-mono mt-1 text-[9px] text-white/60">MT5 · {cert.mt5_login}</div>
        </div>

        {/* Hidden a11y title for screen readers */}
        <span className="sr-only">{title}</span>
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
