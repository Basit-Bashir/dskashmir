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

/**
 * Deterministic shuffle seeded by a string (e.g. today's date) — same seed
 * always produces the same order, so a "New Arrivals" pick stays stable for
 * every visitor during the day but rotates to a different set the next day.
 * (mulberry32 PRNG, seeded via a simple string hash.)
 */
export function seededShuffle<T>(items: T[], seed: string): T[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i);
    h |= 0;
  }
  let state = h >>> 0;
  const next = () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const BADGE_STYLES: Record<string, string> = {
  New:         "bg-hp-blue text-white",
  "Best Seller": "bg-hp-black text-white",
  Limited:     "bg-hp-gold text-hp-black",
  Sale:        "bg-red-600 text-white",
};
