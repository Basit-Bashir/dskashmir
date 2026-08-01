"use client";

import { motion } from "framer-motion";
import { Award, ShieldCheck, Leaf, Star, BadgeCheck, Sparkles } from "lucide-react";

const CREDENTIALS = [
  { name: "HP Amplify Partner", icon: Award },
  { name: "HP Wolf Security", icon: ShieldCheck },
  { name: "HP Sustainable Impact", icon: Leaf },
  { name: "HP Premier Partner", icon: Star },
  { name: "Authorized Reseller", icon: BadgeCheck },
  { name: "ENERGY STAR® Certified", icon: Sparkles },
];

export default function TrustBar() {
  // Duplicate the array to create a seamless loop
  const duplicated = [...CREDENTIALS, ...CREDENTIALS];

  return (
    <div className="w-full bg-white border-t border-b border-hp-light overflow-hidden py-6 select-none">
      <div className="relative flex overflow-hidden">
        {/* Gradient masks for a clean fade at the edges */}
        <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        >
          {duplicated.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex items-center gap-3 px-8 md:px-12 group cursor-default flex-shrink-0"
            >
              <div className="w-9 h-9 rounded-full bg-hp-cream flex items-center justify-center flex-shrink-0
                              group-hover:bg-hp-blue/10 transition-colors duration-300">
                <item.icon size={16} strokeWidth={1.5} className="text-hp-blue" />
              </div>
              <span className="text-[13px] font-medium tracking-[0.01em] text-hp-black/80 whitespace-nowrap">
                {item.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
