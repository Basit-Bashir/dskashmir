"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function EditorialBanner() {
  return (
    <section className="bg-hp-black text-hp-white section-pad py-24 md:py-36 relative overflow-hidden">
      {/* Background decorative text */}
      <span className="absolute -right-4 top-1/2 -translate-y-1/2 font-serif text-[120px]
                       md:text-[200px] font-light text-hp-white/5 select-none pointer-events-none
                       leading-none whitespace-nowrap">
        HP
      </span>

      <div className="max-content relative z-10 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[10px] tracking-[0.3em] uppercase text-hp-gold font-medium block mb-6"
        >
          The HP Promise
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-tight
                     text-hp-white max-w-4xl mx-auto"
        >
          Power Meets{" "}
          <em className="italic text-hp-gold">Precision</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-sm font-light leading-relaxed text-hp-white/45
                     max-w-lg mx-auto"
        >
          Every HP Atelier product is hand-selected for its craftsmanship,
          performance, and design integrity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-10"
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-2 btn-ghost-white"
          >
            Our Story <ArrowRight size={12} strokeWidth={2} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
