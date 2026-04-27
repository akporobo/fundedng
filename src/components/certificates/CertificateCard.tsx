import { useRef, useState } from "react";
import { Download, FileImage, FileText, BarChart3 } from "lucide-react";
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

// Convert a number into English words (for payout amount in words)
function numberToWords(n: number): string {
  if (n === 0) return "Zero";
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const chunk = (num: number): string => {
    let s = "";
    if (num >= 100) {
      s += ones[Math.floor(num / 100)] + " Hundred";
      num %= 100;
      if (num) s += " ";
    }
    if (num >= 20) {
      s += tens[Math.floor(num / 10)];
      if (num % 10) s += "-" + ones[num % 10];
    } else if (num > 0) {
      s += ones[num];
    }
    return s;
  };
  const units = ["", "Thousand", "Million", "Billion"];
  let i = 0;
  let words = "";
  while (n > 0) {
    const c = n % 1000;
    if (c) {
      words = chunk(c) + (units[i] ? " " + units[i] : "") + (words ? " " + words : "");
    }
    n = Math.floor(n / 1000);
    i++;
  }
  return words;
}

export function CertificateCard({ cert }: { cert: Certificate }) {
  const isPayout = cert.kind === "payout";
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const safeName = cert.full_name.replace(/[^a-z0-9]+/gi, "_").toLowerCase();
  const filename = `fundedng-${cert.kind}-${safeName}-${cert.certificate_number}`;

  const dateStr = new Date(cert.issued_at).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const renderCanvas = async () => {
    const node = cardRef.current;
    if (!node) throw new Error("Card not ready");
    const { toPng } = await import("html-to-image");
    return toPng(node, {
      pixelRatio: 2,
      backgroundColor: "#000000",
      cacheBust: true,
    });
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
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 10;
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

  // Shared frame (gold for payout, green for funded)
  const accent = isPayout ? "#D4AF37" : "#10B981";
  const accentSoft = isPayout ? "rgba(212,175,55,0.35)" : "rgba(16,185,129,0.35)";

  return (
    <div className="space-y-3">
      <div
        ref={cardRef}
        className="relative aspect-[1/1.4] w-full overflow-hidden rounded-2xl text-white"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #0a1410 0%, #050a08 55%, #000000 100%)",
          boxShadow: `0 20px 60px -20px ${accentSoft}`,
        }}
      >
        {/* Outer ornate double-line frame */}
        <div
          className="pointer-events-none absolute inset-3 rounded-lg border"
          style={{ borderColor: accent, borderWidth: 2 }}
        />
        <div
          className="pointer-events-none absolute inset-5 rounded-md border"
          style={{ borderColor: accentSoft, borderWidth: 1 }}
        />

        {/* Decorative corner brackets */}
        {[
          "left-3 top-3",
          "right-3 top-3 rotate-90",
          "right-3 bottom-3 rotate-180",
          "left-3 bottom-3 -rotate-90",
        ].map((pos) => (
          <svg
            key={pos}
            className={`pointer-events-none absolute h-12 w-12 ${pos}`}
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden="true"
          >
            <path d="M2 18 V2 H18" stroke={accent} strokeWidth="2" />
            <path d="M6 22 V6 H22" stroke={accentSoft} strokeWidth="1" />
          </svg>
        ))}

        {/* Decorative wavy lines (payout style) on right */}
        {isPayout && (
          <svg
            className="pointer-events-none absolute right-5 top-5 h-[calc(100%-2.5rem)] w-1/2 opacity-40"
            viewBox="0 0 200 600"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            {Array.from({ length: 18 }).map((_, i) => (
              <path
                key={i}
                d={`M${20 + i * 10} 0 Q ${60 + i * 8} 200, ${30 + i * 10} 400 T ${
                  40 + i * 10
                } 600`}
                stroke={accent}
                strokeWidth="0.6"
                opacity={0.5 - i * 0.02}
              />
            ))}
          </svg>
        )}

        {/* Header */}
        <div className="relative pt-10 text-center">
          <div className="font-display text-xl font-black tracking-[0.15em] sm:text-2xl">
            FUNDED<span style={{ color: accent }}>NG</span>
          </div>
          <div
            className="mt-1 text-[8px] font-semibold uppercase tracking-[0.35em] sm:text-[10px]"
            style={{ color: accent }}
          >
            Nigeria's Prop Trading Firm
          </div>
        </div>

        {/* Laurel / chart icon */}
        <div className="relative mt-5 flex justify-center">
          <div className="flex items-center gap-2">
            <span
              className="block h-px w-10"
              style={{ background: `linear-gradient(to right, transparent, ${accent})` }}
            />
            <BarChart3 className="h-5 w-5" style={{ color: accent }} />
            <span
              className="block h-px w-10"
              style={{ background: `linear-gradient(to left, transparent, ${accent})` }}
            />
          </div>
        </div>

        {/* Title block */}
        <div className="relative mt-4 px-6 text-center sm:px-10">
          <div className="font-display text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl">
            {isPayout ? "PAYOUT" : "FUNDED"}
          </div>
          <div
            className="font-display mt-2 text-base font-bold uppercase tracking-[0.25em] sm:text-xl"
            style={{ color: accent }}
          >
            {isPayout ? "Certificate" : "Trader Certificate"}
          </div>
        </div>

        {/* Recipient */}
        <div className="relative mt-6 px-6 text-center sm:px-10">
          <div className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/85 sm:text-xs">
            {isPayout ? "Proudly Presented To" : "This Certifies That"}
          </div>
          <div
            className="mt-2 text-3xl sm:text-5xl"
            style={{
              fontFamily: "'Pinyon Script', 'Great Vibes', cursive",
              color: accent,
              lineHeight: 1.1,
            }}
          >
            {cert.full_name}
          </div>
          <div
            className="mx-auto mt-1 h-px w-3/4"
            style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
          />
        </div>

        {/* Body */}
        {isPayout ? (
          <>
            <div className="relative mt-4 px-6 text-center sm:px-10">
              <div className="text-xs font-bold sm:text-sm" style={{ color: accent }}>
                Congratulations!
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-white/85 sm:text-xs">
                You have received a payout from FundedNG
                <br />
                for your outstanding performance.
              </p>
            </div>

            {/* Payout amount box */}
            <div className="relative mt-4 px-6 sm:px-10">
              <div
                className="rounded-md border-2 p-3 text-center sm:p-4"
                style={{ borderColor: accent }}
              >
                <div
                  className="text-[9px] font-bold uppercase tracking-[0.3em] sm:text-[11px]"
                  style={{ color: accent }}
                >
                  Payout Amount
                </div>
                <div className="font-display mt-1 text-2xl font-black tracking-tight text-white sm:text-4xl">
                  {formatNaira(cert.payout_amount ?? 0)}
                </div>
                <div className="mt-1 text-[9px] text-white/80 sm:text-[11px]">
                  {numberToWords(cert.payout_amount ?? 0)} Naira Only
                </div>
              </div>
            </div>

            {/* Two columns: date + method */}
            <div className="relative mt-4 grid grid-cols-2 gap-3 px-6 sm:px-10">
              <div>
                <div
                  className="text-[8px] font-bold uppercase tracking-[0.25em] sm:text-[10px]"
                  style={{ color: accent }}
                >
                  Payout Date
                </div>
                <div className="mt-1 text-[11px] text-white sm:text-sm">{dateStr}</div>
              </div>
              <div>
                <div
                  className="text-[8px] font-bold uppercase tracking-[0.25em] sm:text-[10px]"
                  style={{ color: accent }}
                >
                  Payment Method
                </div>
                <div className="mt-1 text-[11px] text-white sm:text-sm">Bank Transfer</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="relative mt-4 px-6 text-center text-[10px] leading-relaxed text-white/85 sm:px-10 sm:text-xs">
              has successfully passed all evaluation phases
              <br />
              and is now a funded trader of FundedNG.
              <br />
              You have proven your skill, discipline, and
              <br />
              consistency. We are proud to have you
              <br />
              on our team.
            </p>

            {/* Stats row */}
            <div className="relative mt-5 grid grid-cols-4 gap-2 px-6 text-center sm:px-10">
              {[
                { v: "24h", l: "Payouts" },
                { v: "80%", l: "Profit Split" },
                { v: "3", l: "Simple Rules" },
                { v: formatNaira(cert.account_size), l: "Account Size" },
              ].map((s) => (
                <div key={s.l}>
                  <div
                    className="font-display text-base font-black sm:text-xl"
                    style={{ color: accent }}
                  >
                    {s.v}
                  </div>
                  <div className="mt-0.5 text-[8px] uppercase tracking-wider text-white/70 sm:text-[10px]">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer: signature + cert id */}
        <div className="absolute inset-x-0 bottom-6 px-6 sm:px-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div
                className="text-2xl text-white sm:text-3xl"
                style={{
                  fontFamily: "'Pinyon Script', 'Great Vibes', cursive",
                  lineHeight: 1,
                }}
              >
                Byemi
              </div>
              <div
                className="mt-1 h-px w-28"
                style={{ background: accent }}
              />
              <div
                className="font-display mt-1 text-[8px] font-bold tracking-[0.2em] sm:text-[10px]"
                style={{ color: accent }}
              >
                CEO, FUNDEDNG
              </div>
            </div>

            <div className="text-right">
              <div
                className="font-display text-[8px] font-bold uppercase tracking-[0.25em] sm:text-[10px]"
                style={{ color: accent }}
              >
                {isPayout ? "Certificate ID" : "Date"}
              </div>
              <div className="mt-1 font-mono text-[10px] text-white sm:text-xs">
                {isPayout ? cert.certificate_number : dateStr}
              </div>
              {!isPayout && (
                <div className="mt-1 font-mono text-[8px] text-white/60 sm:text-[10px]">
                  {cert.certificate_number}
                </div>
              )}
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
              <FileText className="mr-2 h-4 w-4" /> PDF (A4 portrait)
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
