"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/lib/products";
import { formatPrice, BADGE_STYLES, cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="product-card group"
    >
      <Link href={`/product/${product.slug}`}>
        {/* Image area */}
        <div className="product-card-img aspect-[4/3] bg-hp-cream relative">
          {/* Placeholder visual */}
          <div className="w-full h-full flex items-center justify-center
                          bg-gradient-to-br from-hp-cream to-hp-light
                          group-hover:scale-[1.04] transition-transform duration-700">
            <div className="text-center">
              <p className="font-serif text-2xl font-light text-hp-gray/40">{product.name}</p>
              <p className="text-[10px] tracking-widest uppercase text-hp-gray/30 mt-1">
                {product.series}
              </p>
            </div>
          </div>

          {/* Badge */}
          {product.badge && (
            <span className={cn(
              "absolute top-3 left-3 text-[9px] tracking-[0.15em] uppercase font-medium px-2.5 py-1",
              BADGE_STYLES[product.badge]
            )}>
              {product.badge}
            </span>
          )}

          {/* Hover overlay */}
          <div className="product-card-overlay">
            <span className="bg-white text-hp-black text-[10px] tracking-[0.15em]
                             uppercase font-medium px-6 py-2.5 hover:bg-hp-blue
                             hover:text-white transition-colors duration-200">
              View Details
            </span>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="bg-white px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link href={`/product/${product.slug}`}>
              <h3 className="text-sm font-medium tracking-[0.02em] hover:text-hp-blue
                             transition-colors duration-200 leading-snug">
                {product.name}
              </h3>
            </Link>
            <p className="text-[11px] text-hp-gray mt-0.5 font-light truncate">
              {product.specs[0]?.value} · {product.specs[1]?.value}
            </p>
          </div>
          <button
            aria-label="Add to wishlist"
            className="text-hp-gray/50 hover:text-hp-blue transition-colors duration-200
                       flex-shrink-0 mt-0.5"
          >
            <Heart size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <span className="font-serif text-xl font-medium text-hp-black">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-hp-gray/60 line-through font-light">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
