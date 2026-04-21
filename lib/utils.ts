import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(price);
}

export const BADGE_STYLES: Record<string, string> = {
  New:         "bg-hp-blue text-white",
  "Best Seller": "bg-hp-black text-white",
  Limited:     "bg-hp-gold text-hp-black",
  Sale:        "bg-red-600 text-white",
};
