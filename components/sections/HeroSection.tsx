"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { Product } from "@/lib/products";

interface HeroSectionProps {
  heroPrinter?: Product | null;
  heroImage?: string;
  heroName?: string;
}

// Strictly curated high-resolution transparent PNG multi-angle images for SKU 3SJ03A (No white backgrounds)
const PRINTER_3SJ03A_TRANSPARENT_IMAGES = [
  "https://hp.widen.net/content/zspr9jpmoa/png/zspr9jpmoa.png?w=1659&h=1246&dpi=72&color=ffffff00",
  "https://hp.widen.net/content/g3rc95fl3k/png/g3rc95fl3k.png?w=1659&h=1246&dpi=72&color=ffffff00",
  "https://hp.widen.net/content/feanvvnhg3/png/feanvvnhg3.png?w=1659&h=1246&dpi=72&color=ffffff00",
  "https://hp.widen.net/content/vtqxgkelui/png/vtqxgkelui.png?w=1659&h=1246&dpi=72&color=ffffff00",
];

const slideVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 60 : -60,
    scale: 0.9,
    rotate: dir > 0 ? 4 : -4,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    rotate: 0,
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -60 : 60,
    scale: 0.9,
    rotate: dir > 0 ? -4 : 4,
  }),
};

export default function HeroSection({ heroPrinter }: HeroSectionProps) {
  // Only keep transparent PNG images (color=ffffff00 or .png), filtering out any white-background JPEGs
  const transparentImagesFromProduct = (heroPrinter?.images || []).filter(
    (url) =>
      url.includes("color=ffffff00") ||
      (url.includes(".png") && !url.includes(".jpg"))
  );

  const images =
    transparentImagesFromProduct.length > 0
      ? transparentImagesFromProduct
      : PRINTER_3SJ03A_TRANSPARENT_IMAGES;

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // Smooth continuous auto-play rotation every 3.8s
  useEffect(() => {
    const timer = setInterval(nextSlide, 3800);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="bg-hp-cream pt-6 pb-2 md:pt-8">
      <div className="max-content section-pad">
        <div className="relative rounded-[1.75rem] overflow-hidden bg-sand min-h-[440px] md:min-h-[560px] flex items-center">

          {/* Left Side: Original Heading, Subheading, Eyebrow & Design */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-md px-7  py-12"
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
              <Link href="/collections?category=Laptops" className="btn-pill">
                Shop Laptops
              </Link>
              <Link href="/collections?category=Printers" className="btn-pill-outline">
                Shop Printers
              </Link>
            </div>
          </motion.div>

          {/* Right Side: Transparent SKU 3SJ03A Printer Carousel with Cute Animations */}
          <div className="hidden md:flex absolute right-6 lg:right-16 top-[40px] bottom-[40px] w-[50%] max-w-[500px] flex-col items-center justify-center z-10 pointer-events-none">

            {/* Cute Sparkle Accents */}
            <motion.div
              animate={{
                scale: [0.85, 1.15, 0.85],
                opacity: [0.4, 0.9, 0.4],
                rotate: [0, 15, 0],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 right-8 text-amber-400 pointer-events-none z-20"
            >
              <Sparkles className="w-5 h-5 fill-amber-300" />
            </motion.div>

            {/* Carousel Visual Container */}
            <div className="relative w-full h-[340px] lg:h-[400px] flex items-center justify-center overflow-hidden">
              <AnimatePresence initial={false} custom={1} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* Cute Continuous Levitation Bobbing */}
                  <motion.img
                    animate={{ y: [0, -7, 0] }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    src={images[currentIndex]}
                    alt={`HP Printer 3SJ03A - Angle ${currentIndex + 1}`}
                    className="h-full w-auto max-w-full object-contain drop-shadow-2xl select-none"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
