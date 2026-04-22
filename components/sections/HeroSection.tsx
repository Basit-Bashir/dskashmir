"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 pt-16 md:pt-20">

      {/* Left — dark side */}
      <div className="bg-hp-black flex items-center px-8 md:px-16 xl:px-24 py-20 lg:py-0 relative overflow-hidden">
        {/* Decorative vertical text */}
        <span className="hidden xl:block absolute right-10 top-1/2 -translate-y-1/2
                         font-serif text-[10px] tracking-[0.3em] uppercase
                         text-hp-white/15 writing-mode-vertical rotate-180"
          style={{ writingMode: "vertical-rl" }}>
          DSK — {new Date().getFullYear()} Collection
        </span>

        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[10px] tracking-[0.3em] uppercase text-hp-gold font-medium
                       block mb-8"
          >
            New Collection — {new Date().getFullYear()}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
            className="font-serif text-5xl md:text-6xl xl:text-7xl font-light
                       leading-[1.05] text-hp-white mb-6"
          >
            Engineered for{" "}
            <em className="text-hp-gold not-italic font-light">
              Extraordinary
            </em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="text-sm font-light leading-[1.9] text-hp-white/45
                       max-w-[380px] mb-12"
          >
            Discover HP's most refined lineup — where precision engineering meets
            understated luxury. Technology as it should always have been.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/collections" className="btn-primary inline-flex items-center gap-2">
              Shop Now <ArrowRight size={12} strokeWidth={2} />
            </Link>
            <Link href="/collections" className="btn-ghost-white inline-block">
              Explore Collections
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Right — cream product side */}
      <div className="bg-hp-cream relative flex items-center justify-center
                      min-h-[60vh] lg:min-h-0 overflow-hidden">

        {/* Badge */}
        <span className="absolute top-8 left-8 bg-hp-blue text-white text-[9px]
                         tracking-[0.2em] uppercase font-medium px-3.5 py-1.5 z-10">
          New Arrival
        </span>

        {/* Product visual placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          className="w-3/4 max-w-[480px] aspect-[4/3] bg-gradient-to-br
                     from-hp-light to-[#d0ccc4] flex items-center justify-center
                     relative shadow-2xl"
        >
          <div className="text-center">
            <p className="font-serif text-3xl font-light text-hp-gray/50">
              HP Spectre x360
            </p>
            <p className="text-[10px] tracking-widest uppercase text-hp-gray/30 mt-2">
              Product Image
            </p>
          </div>
          {/* Shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30
                          via-transparent to-transparent pointer-events-none" />
        </motion.div>

        {/* Price tag */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="absolute bottom-10 right-10 bg-white px-5 py-4
                     border-l-2 border-hp-blue shadow-sm"
        >
          <span className="block text-[9px] tracking-[0.2em] uppercase text-hp-gray mb-1">
            Starting from
          </span>
          <span className="font-serif text-3xl font-medium text-hp-black">
            ₹1,29,999
          </span>
        </motion.div>
      </div>
    </section>
  );
}
