"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function EditorialBanner() {
  return (
    <section className="section-pad py-2 md:py-3">
      <div className="max-content">
        <div className="relative rounded-[1.75rem] overflow-hidden bg-clay min-h-[320px] md:min-h-[400px]
                       flex flex-col items-center justify-center text-center px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[11px] tracking-[0.15em] uppercase text-hp-black/55 font-medium mb-4"
          >
            The HP Promise
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-2xl md:text-3xl font-normal leading-snug text-hp-black max-w-lg"
          >
            Power meets precision, without the noise.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-sm text-hp-black/55 max-w-sm"
          >
            Every DSK product is hand-selected for its craftsmanship,
            performance, and design integrity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-7"
          >
            <Link href="/about" className="btn-pill">
              Our Story
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
