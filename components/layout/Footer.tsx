"use client";
import Link from "next/link";
import { Instagram, Twitter, Youtube, Linkedin } from "lucide-react";

const FOOTER_COLS = [
  {
    heading: "Our Story",
    links: [
      { label: "About HP Atelier", href: "/about" },
      { label: "Design Philosophy", href: "/about#philosophy" },
      { label: "Sustainability", href: "/about#sustainability" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    heading: "Collections",
    links: [
      { label: "Spectre Series", href: "/collections?cat=ultrabook" },
      { label: "Envy Series", href: "/collections?cat=creator" },
      { label: "EliteBook Series", href: "/collections?cat=business" },
      { label: "Omen Series", href: "/collections?cat=gaming" },
    ],
  },
  {
    heading: "Customer Service",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping & Returns", href: "/shipping" },
      { label: "Warranty", href: "/warranty" },
      { label: "Size Guide", href: "/size-guide" },
    ],
  },
];

const SOCIALS = [
  { icon: Instagram, href: "https://instagram.com/hp", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com/hp", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com/hp", label: "YouTube" },
  { icon: Linkedin, href: "https://linkedin.com/company/hp", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-hp-black text-hp-white/70">
      <div className="max-content section-pad py-16 md:py-20">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12
                        border-b border-hp-white/10">

          {/* Brand column */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <span className="font-serif text-2xl font-light tracking-[0.15em] text-hp-white">
                <span className="text-hp-blue font-medium">DSK</span>
              </span>
            </Link>
            <p className="text-sm font-light leading-relaxed text-hp-white/50 max-w-[220px]">
              Premium HP technology, curated for those who demand the very best.
            </p>
            <div className="flex items-center gap-4 mt-8">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-hp-white/40 hover:text-hp-blue transition-colors duration-200"
                >
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-[10px] tracking-[0.25em] uppercase text-hp-white/40
                             font-medium mb-5">
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-light text-hp-white/60
                                 hover:text-hp-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="pt-10 pb-10 border-b border-hp-white/10">
          <div className="flex flex-col md:flex-row items-start md:items-center
                          justify-between gap-6">
            <div>
              <p className="eyebrow text-hp-blue">Stay in the loop</p>
              <h4 className="font-serif text-2xl font-light text-hp-white">
                New arrivals, exclusive offers.
              </h4>
            </div>
            <form
              className="flex w-full md:w-auto gap-0"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 md:w-72 bg-hp-white/5 border border-hp-white/15
                           text-hp-white placeholder:text-hp-white/30 text-sm
                           font-light px-4 py-3 focus:outline-none
                           focus:border-hp-blue transition-colors duration-200"
              />
              <button
                type="submit"
                className="bg-hp-blue text-white text-[10px] tracking-[0.15em]
                           uppercase font-medium px-6 py-3 hover:bg-hp-blueDark
                           transition-colors duration-200 flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col md:flex-row items-center
                        justify-between gap-4">
          <p className="text-[11px] text-hp-white/30 font-light">
            © {new Date().getFullYear()} HP Atelier. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Use", "Cookie Settings"].map((t) => (
              <Link
                key={t}
                href="#"
                className="text-[11px] text-hp-white/30 hover:text-hp-white/60
                           transition-colors duration-200"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
