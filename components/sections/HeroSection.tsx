"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Laptop, Gamepad2, Headphones, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-hp-white pt-16 md:pt-24 pb-16 relative overflow-hidden">

      <div className="max-content section-pad">

        {/* Trendy Brand Header */}
        <div className="mb-12 md:mb-36 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-end gap-4 md:gap-6"
          >
            <h2 className="font-serif text-7xl md:text-9xl font-bold text-hp-black leading-none tracking-tighter">
              DSK
            </h2>
            <div className="flex flex-col items-start pb-2 md:pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Star size={14} fill="#0096D6" className="text-hp-blue animate-pulse" />
                <span className="text-hp-blue font-bold text-[10px] md:text-[12px] tracking-[0.2em] uppercase">
                  HP Premier Partner
                </span>
              </div>
              <div className="h-[1px] w-full bg-hp-black/10" />
            </div>
          </motion.div>

          {/* Decorative Background Element */}
          <div className="absolute top-[90px] -right-10 opacity-[0.05] pointer-events-none select-none hidden lg:block">
            <span className="font-serif text-[14vw] leading-none uppercase">Authorized</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Feature Card (Left) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 relative bg-hp-cream overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center shadow-sm hover:shadow-md transition-shadow duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-hp-cream via-transparent to-transparent z-10" />

            <div className="relative z-20 px-8 md:px-16 w-full lg:w-3/5">
              <span className="text-hp-blue font-bold tracking-wider text-[10px] uppercase mb-4 block">
                Summer Sale 20% Off
              </span>
              <h1 className="font-serif text-4xl md:text-6xl font-light text-hp-black leading-tight mb-8">
                Revolutionize <br />
                <span className="italic">Your Workflow</span>
              </h1>
              <Link href="/collections" className="btn-primary inline-block">
                Shop Now
              </Link>
            </div>

            {/* Main Product Visual */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-30 lg:opacity-100 flex items-center justify-center p-8">
              <div className="w-full aspect-square bg-hp-blue/10 rounded-full flex items-center justify-center relative">
                <Laptop size={240} strokeWidth={0.5} className="text-hp-blue/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-2xl italic text-hp-black/10">HP Spectre</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">

            {/* Top Right Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#F0F2FF] p-8 relative overflow-hidden group min-h-[240px] flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow duration-500"
            >
              <div className="relative z-10">
                <span className="text-hp-blue font-medium text-[10px] tracking-widest uppercase mb-2 block">Trend Devices</span>
                <h3 className="font-serif text-2xl font-light text-hp-black mb-6">Latest Laptops</h3>
                <Link href="/collections" className="btn-primary inline-block !py-2.5 !px-6 !text-[9px]">
                  View More
                </Link>
              </div>
              <div className="absolute right-[-10%] bottom-[-10%] group-hover:scale-110 transition-transform duration-500 opacity-20 group-hover:opacity-40">
                <Laptop size={140} strokeWidth={1} className="text-hp-blue" />
              </div>
            </motion.div>

            {/* Bottom Grid (Gaming & Accessories) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:col-span-2 lg:col-span-1">
              {/* Gaming Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#FFF8F0] p-6 relative overflow-hidden group min-h-[240px] flex flex-col justify-end shadow-sm hover:shadow-md transition-shadow duration-500"
              >
                <div className="relative z-10">
                  <span className="text-hp-gold font-medium text-[9px] tracking-widest uppercase mb-1 block">Best</span>
                  <h3 className="font-serif text-xl font-light text-hp-black mb-4 leading-tight">Gaming <br /> Console</h3>
                  <Link href="/collections" className="btn-primary inline-block !py-2 !px-4 !text-[8px]">
                    View More
                  </Link>
                </div>
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-30 group-hover:rotate-12 transition-all duration-500">
                  <Gamepad2 size={100} strokeWidth={1} className="text-hp-gold" />
                </div>
              </motion.div>

              {/* Accessories Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#FFF0F0] p-6 relative overflow-hidden group min-h-[240px] flex flex-col justify-end shadow-sm hover:shadow-md transition-shadow duration-500"
              >
                <div className="relative z-10">
                  <span className="text-pink-500 font-medium text-[9px] tracking-widest uppercase mb-1 block">Most</span>
                  <h3 className="font-serif text-xl font-light text-hp-black mb-4 leading-tight">Popular <br /> Accessories</h3>
                  <Link href="/collections" className="btn-primary inline-block !py-2 !px-4 !text-[8px]">
                    View More
                  </Link>
                </div>
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">
                  <Headphones size={100} strokeWidth={1} className="text-pink-500" />
                </div>
              </motion.div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
