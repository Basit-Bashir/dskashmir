"use client";

import { motion } from "framer-motion";
import { Award, ShieldCheck, Cpu, Laptop, BookOpen, Star } from "lucide-react";

const PARTNERS = [
  { name: "HP Amplify Partner", icon: Award },
  { name: "HP Premier Partner", icon: Star },
  { name: "Authorized Service", icon: ShieldCheck },
  { name: "Education Specialist", icon: BookOpen },
  { name: "Computing Partner", icon: Cpu },
  { name: "HP Retail Partner", icon: Laptop },
];

export default function PartnerMarquee() {
  // Duplicate the array to create a seamless loop
  const duplicatedPartners = [...PARTNERS, ...PARTNERS];

  return (
    <div className="w-full bg-hp-white border-b border-hp-light overflow-hidden py-8 select-none">
      <div className="max-content px-4 mb-4">
        <span className="text-[10px] tracking-[0.2em] uppercase text-hp-gray font-medium opacity-60">
          Our Credentials
        </span>
      </div>

      <div className="relative flex overflow-hidden">
        {/* Gradient Masks for premium fade effect */}
        <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-hp-white to-blue-50 z-10 rounded-full pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-hp-white to-blue-50 z-10 rounded-full pointer-events-none" />

        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 35,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex items-center gap-3 px-8 md:px-16 group cursor-default"
            >
              <div className="w-10 h-10 rounded-full bg-hp-cream flex items-center justify-center 
                              group-hover:bg-hp-blue/10 transition-colors duration-300">
                <partner.icon
                  size={18}
                  strokeWidth={1.5}
                  className="text-hp-gray group-hover:text-hp-blue transition-colors duration-300"
                />
              </div>
              <span className="font-serif text-lg md:text-xl font-light text-hp-gray/70 
                               group-hover:text-hp-black transition-colors duration-300">
                {partner.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
