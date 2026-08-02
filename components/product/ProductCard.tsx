"use client";

import Link from "next/link";
import { Heart, Cpu, HardDrive, Monitor, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/lib/products";
import { BADGE_STYLES, cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  // Extract key specs for the card summary. Word-boundary matching avoids
  // false positives like "Postcards" containing the substring "os".
  const getSpecValue = (keywords: string[], exclude?: RegExp) =>
    product.specs.find(
      (s) => !(exclude && exclude.test(s.label)) && keywords.some((k) => new RegExp(`\\b${k}\\b`, "i").test(s.label))
    )?.value;

  const os = getSpecValue(["operating system"]);
  const processor = getSpecValue(["processor", "cpu"]);
  // "Storage temperature" (an environmental spec) also contains the word
  // "storage" — exclude it so printers don't show a bogus RAM/SSD line.
  const memoryStorage = getSpecValue(["memory and storage", "storage", "ram", "memory"], /temperature/i);
  // Fallback bullet for products with no OS/CPU/RAM spec (printers, accessories) —
  // skip promo/asset links and long paragraphs so it doesn't show noise.
  const fallbackSpec = product.specs.find((s) => s.value.length < 60 && !/^https?:\/\//i.test(s.value));

  const categoryLabel = product.category
    ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
    : "HP Product";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3), ease: "easeOut" }}
      className="product-card group flex flex-col h-full bg-white border border-hp-light hover:border-hp-gray/40 transition-all duration-300 shadow-sm hover:shadow-md"
    >
      <Link href={`/product/${product.slug}`} className="block relative">
        {/* Image Area */}
        <div className="product-card-img aspect-[4/3] bg-hp-cream/40 relative overflow-hidden flex items-center justify-center p-4">
          {/* Category Tag */}
          <span className="absolute top-3 left-3 bg-hp-black text-white text-[9px] tracking-[0.12em] uppercase font-semibold px-2 py-0.5 z-10 rounded-xs">
            {categoryLabel}
          </span>

          {/* SKU Pill */}
          {product.productNumber && (
            <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-hp-gray text-[9px] font-mono px-2 py-0.5 z-10 border border-hp-light rounded-xs">
              {product.productNumber}
            </span>
          )}

          {/* Badge */}
          {product.badge && (
            <span
              className={cn(
                "absolute bottom-3 left-3 text-[9px] tracking-[0.12em] uppercase font-medium px-2.5 py-1 z-10",
                BADGE_STYLES[product.badge] || "bg-hp-blue text-white"
              )}
            >
              {product.badge}
            </span>
          )}

          {/* Live Image or Fallback */}
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-auto h-auto max-h-[180px] object-contain group-hover:scale-[1.05] transition-transform duration-500"
            />
          ) : (
            <div className="text-center p-4">
              <p className="font-serif text-2xl font-light text-hp-gray/40">{product.name}</p>
              <p className="text-[10px] tracking-widest uppercase text-hp-gray/30 mt-1">{product.series}</p>
            </div>
          )}

          {/* Hover Overlay Button */}
          <div className="product-card-overlay bg-black/20 backdrop-blur-[2px] transition-opacity duration-300">
            <span className="bg-white text-hp-black text-[10px] tracking-[0.15em] uppercase font-semibold px-5 py-2.5 shadow-md group-hover:scale-105 transition-transform duration-200">
              View Details
            </span>
          </div>
        </div>
      </Link>

      {/* Info & Spec Summary */}
      <div className="bg-white p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <Link href={`/product/${product.slug}`} className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-hp-black hover:text-hp-blue transition-colors leading-snug line-clamp-2">
                {product.name}
              </h3>
            </Link>
            <button
              aria-label="Add to wishlist"
              className="text-hp-gray/40 hover:text-hp-blue transition-colors flex-shrink-0 mt-0.5"
            >
              <Heart size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Key Specifications Bullet List (Patterned after sigmainfotech hp-product) */}
          <ul className="mt-3 space-y-1.5 border-t border-hp-light/60 pt-3">
            {os && (
              <li className="flex items-start gap-1.5 text-[11px] text-hp-gray font-light leading-tight">
                <span className="font-medium text-hp-black flex-shrink-0">OS:</span>
                <span className="truncate">{os}</span>
              </li>
            )}
            {processor && (
              <li className="flex items-start gap-1.5 text-[11px] text-hp-gray font-light leading-tight">
                <span className="font-medium text-hp-black flex-shrink-0">CPU:</span>
                <span className="truncate">{processor}</span>
              </li>
            )}
            {memoryStorage && (
              <li className="flex items-start gap-1.5 text-[11px] text-hp-gray font-light leading-tight">
                <span className="font-medium text-hp-black flex-shrink-0">RAM/SSD:</span>
                <span className="truncate">{memoryStorage}</span>
              </li>
            )}
            {!os && !processor && !memoryStorage && fallbackSpec && (
              <li className="text-[11px] text-hp-gray font-light truncate">
                <span className="font-medium text-hp-black">{fallbackSpec.label}:</span> {fallbackSpec.value}
              </li>
            )}
          </ul>
        </div>

        {/* Action Row */}
        <div className="mt-4 pt-3 border-t border-hp-light flex items-center justify-end">
          <Link
            href={`/product/${product.slug}`}
            className="text-[10px] tracking-[0.1em] uppercase font-semibold text-hp-blue hover:text-hp-blueDark transition-colors"
          >
            Explore &rarr;
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
