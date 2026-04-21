"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = 2; // replace with cart context

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-hp-white/95 backdrop-blur-md border-b border-hp-light shadow-sm"
          : "bg-transparent"
          }`}
      >
        <div className="max-content section-pad">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="font-serif text-xl md:text-2xl font-light tracking-[0.15em] text-hp-black">
                <span className="text-hp-blue font-medium">DSK</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] tracking-[0.12em] uppercase text-hp-black/80
                             hover:text-hp-blue transition-colors duration-200 font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4 md:gap-5">
              <button
                className="hidden md:flex text-hp-black/70 hover:text-hp-blue
                           transition-colors duration-200"
                aria-label="Search"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>

              <Link
                href="/cart"
                className="relative text-hp-black/70 hover:text-hp-blue
                           transition-colors duration-200"
                aria-label={`Cart (${cartCount} items)`}
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-hp-blue
                                   text-white text-[8px] font-medium rounded-full
                                   flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                className="hidden md:flex text-hp-black/70 hover:text-hp-blue
                           transition-colors duration-200"
                aria-label="Account"
              >
                <User size={18} strokeWidth={1.5} />
              </button>

              {/* Hamburger */}
              <button
                className="md:hidden text-hp-black/70 hover:text-hp-blue
                           transition-colors duration-200 ml-1"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-hp-black md:hidden pt-20"
          >
            <nav className="flex flex-col px-8 pt-8 gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block font-serif text-4xl font-light text-hp-white/90
                               hover:text-hp-gold transition-colors duration-200 py-3
                               border-b border-hp-white/10"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-6 mt-10"
              >
                <button className="text-hp-white/60 hover:text-hp-white transition-colors">
                  <Search size={20} strokeWidth={1.5} />
                </button>
                <button className="text-hp-white/60 hover:text-hp-white transition-colors">
                  <User size={20} strokeWidth={1.5} />
                </button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
