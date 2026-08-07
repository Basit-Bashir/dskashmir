"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

const HP_BANNERS = [
  {
    id: "zbook-power",
    sku: "9A838AV",
    title: "HP ZBook Mobile Workstations",
    tagline: "Pro-grade power for heavy compute, AI, and 3D rendering.",
    category: "Laptops & Workstations",
    ctaText: "Explore Z by HP",
    ctaHref: "/collections?category=Workstations",
    bg: "bg-sage",
    badge: "HP Z Enterprise",
    image: "https://hp.widen.net/content/xsjiixyx7j/png/xsjiixyx7j.png?w=1659&h=1246&dpi=72&color=ffffff00",
  },
  {
    id: "laserjet-managed",
    sku: "3SJ03A",
    title: "HP LaserJet Managed MFP",
    tagline: "Air-tight HP Wolf Security & ultra-fast duplex printing.",
    category: "Enterprise Printing",
    ctaText: "Shop Printers",
    ctaHref: "/collections?category=Printers",
    bg: "bg-sand",
    badge: "HP Wolf Security",
    image: "https://hp.widen.net/content/zspr9jpmoa/png/zspr9jpmoa.png?w=1659&h=1246&dpi=72&color=ffffff00",
  },
  {
    id: "hyperx-omen",
    sku: "D8PZ9PA",
    title: "HP OMEN & HyperX Series",
    tagline: "High refresh-rate displays & desktop-class thermal cooling.",
    category: "Gaming Performance",
    ctaText: "Discover OMEN",
    ctaHref: "/collections?category=Laptops&search=OMEN",
    bg: "bg-sky",
    badge: "OMEN Series",
    image: "https://hp.widen.net/content/9iqnhnbc9a/png/9iqnhnbc9a.png?w=1659&h=1246&dpi=72&color=ffffff00",
  },
];

export default function HPBannersSection() {
  return (
    <section className="section-pad py-8 md:py-12 bg-hp-cream">
      <div className="max-content">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="eyebrow flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-hp-blue" />
              <span>Official HP Campaigns</span>
            </span>
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-hp-black">
              Featured HP Products
            </h2>
          </div>
          <p className="text-xs md:text-sm text-hp-black/60 max-w-md mt-2 md:mt-0 leading-relaxed">
            Explore authorized HP solution campaigns featuring certified enterprise hardware and next-gen commercial technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {HP_BANNERS.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative rounded-3xl overflow-hidden ${banner.bg} p-7 md:p-8 flex flex-col justify-between min-h-[360px] shadow-2xs hover:shadow-md transition-all duration-300`}
            >
              {/* Header Badge */}
              <div className="relative z-10 flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1 bg-white/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-hp-black/80 border border-hp-black/10">
                  <ShieldCheck className="w-3 h-3 text-hp-blue" />
                  <span>{banner.badge}</span>
                </span>
                <span className="text-[10px] tracking-widest text-hp-black/40 uppercase font-mono">
                  SKU {banner.sku}
                </span>
              </div>

              {/* Banner Product Transparent Image Visual */}
              <div className="relative z-10 my-3 h-36 flex items-center justify-center pointer-events-none">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="max-h-full max-w-full w-auto object-contain drop-shadow-xl group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-500 ease-out select-none"
                />
              </div>

              {/* Bottom Content & Pill Button */}
              <div className="relative z-10 mt-auto">
                <p className="text-[11px] font-medium tracking-wider uppercase text-hp-black/55 mb-1">
                  {banner.category}
                </p>
                <h3 className="text-lg font-medium text-hp-black mb-1.5 leading-snug">
                  {banner.title}
                </h3>
                <p className="text-xs text-hp-black/65 leading-relaxed mb-5 line-clamp-2">
                  {banner.tagline}
                </p>

                <Link href={banner.ctaHref} className="btn-pill inline-flex">
                  <span>{banner.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
