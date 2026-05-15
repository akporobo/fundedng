import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNaira = (amount: number | string | null | undefined): string => {
  const n = Number(amount ?? 0);
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
};

export const formatPercent = (val: number | string | null | undefined): string => {
  const n = Number(val ?? 0);
  return `${n.toFixed(2)}%`;
};

export const formatUSD = (amount: number | string | null | undefined): string => {
  const n = Number(amount ?? 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
};

export const formatCompactSize = (size: number, currency: "NGN" | "USD"): string => {
  if (currency === "USD") {
    if (size >= 1000) return `$${size / 1000}k`;
    return `$${size}`;
  }
  if (size >= 1000000) return `₦${(size / 1000000).toFixed(0)}M`;
  if (size >= 1000) return `₦${(size / 1000).toFixed(0)}k`;
  return formatNaira(size);
};
