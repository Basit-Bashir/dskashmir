"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Laptop } from "lucide-react";

interface HeroSectionProps {
  heroImage?: string;
  heroName?: string;
}

export default function HeroSection({ heroImage, heroName }: HeroSectionProps) {
  return (
    <section className="bg-hp-cream pt-6 pb-2 md:pt-8">
      <div className="max-content section-pad">
        <div className="relative rounded-[1.75rem] overflow-hidden bg-sand min-h-[440px] md:min-h-[560px] flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-md px-7 md:px-14 py-12"
          >
            <p className="text-[11px] tracking-[0.15em] uppercase font-medium text-hp-black/55 mb-4">
              HP Premier Partner &middot; Authorized Reseller
            </p>
            <h1 className="text-3xl md:text-[2.75rem] font-normal text-hp-black leading-[1.2] mb-6">
              Wildly capable.
              <br />
              Effortlessly simple.
            </h1>
            <p className="text-sm text-hp-black/60 leading-relaxed max-w-xs mb-7">
              Thoughtfully chosen HP laptops, desktops and printers, shipped fast across India.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link href="/collections" className="btn-pill">
                Shop Laptops
              </Link>
              <Link href="/collections" className="btn-pill-outline">
                Shop Printers
              </Link>
            </div>
          </motion.div>

          {/* Product visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="hidden md:flex absolute right-6 lg:right-16 top-[50px] h-[78%] max-h-[440px] items-center justify-center"
          >
            {heroImage ? (
              <img
                src={heroImage}
                alt={heroName ?? ""}
                className="h-full w-auto object-contain drop-shadow-2xl"
              />
            ) : (
              <Laptop size={220} strokeWidth={0.6} className="text-hp-black/15" />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
