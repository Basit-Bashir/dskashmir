"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/context/CartContext";
import { PRODUCTS } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount } = useCart();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setSearchQuery("");
    }
  }, [searchOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const filteredProducts = searchQuery.trim() === ""
    ? []
    : PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);

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
            <Link href="/" className="flex-shrink-0" onClick={() => { setMobileOpen(false); setSearchOpen(false); }}>
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
                onClick={() => setSearchOpen(true)}
                className="text-hp-black/70 hover:text-hp-blue
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

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-hp-white flex flex-col"
          >
            <div className="section-pad py-6 md:py-10 border-b border-hp-light bg-hp-cream/30">
              <div className="max-content flex items-center justify-between">
                <div className="flex-1 flex items-center gap-4">
                  <Search size={24} strokeWidth={1.5} className="text-hp-blue" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search HP products, series, or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-0 text-xl md:text-3xl font-serif 
                               font-light text-hp-black placeholder:text-hp-gray/30 
                               focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 text-hp-gray hover:text-hp-black transition-colors"
                >
                  <X size={28} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto section-pad py-12">
              <div className="max-content">
                {searchQuery.trim() === "" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                      <h3 className="eyebrow">Quick Links</h3>
                      <div className="flex flex-col gap-4 mt-6">
                        {["Spectre", "Envy", "EliteBook", "Omen"].map(cat => (
                          <button
                            key={cat}
                            onClick={() => setSearchQuery(cat)}
                            className="text-left font-serif text-2xl font-light text-hp-black/60 hover:text-hp-blue transition-colors"
                          >
                            HP {cat} Series
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="eyebrow">Popular Searches</h3>
                      <div className="flex flex-wrap gap-2 mt-6">
                        {["Convertible", "OLED", "Gaming", "A3 Copiers", "LaserJet"].map(tag => (
                          <button
                            key={tag}
                            onClick={() => setSearchQuery(tag)}
                            className="px-4 py-2 border border-hp-light text-[11px] tracking-wider uppercase font-medium hover:border-hp-blue hover:text-hp-blue transition-all"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="eyebrow">Results ({filteredProducts.length})</h3>
                    {filteredProducts.length > 0 ? (
                      <div className="grid grid-cols-1 gap-1 mt-8">
                        {filteredProducts.map(p => (
                          <Link
                            key={p.id}
                            href={`/product/${p.slug}`}
                            onClick={() => setSearchOpen(false)}
                            className="group flex items-center justify-between p-6 hover:bg-hp-cream transition-all border-b border-hp-light last:border-0"
                          >
                            <div className="flex items-center gap-8">
                              <div className="w-16 h-12 bg-hp-cream flex items-center justify-center border border-hp-light/50 group-hover:bg-white transition-colors">
                                <span className="text-[10px] text-hp-gray font-serif">{p.name.split(" ")[1] || p.name}</span>
                              </div>
                              <div>
                                <p className="text-[10px] tracking-widest uppercase text-hp-gray mb-1">{p.series}</p>
                                <h4 className="text-lg font-serif font-light text-hp-black group-hover:text-hp-blue transition-colors">{p.name}</h4>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <span className="font-serif text-lg font-medium">{formatPrice(p.price)}</span>
                              <ArrowRight size={18} strokeWidth={1.5} className="text-hp-blue opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                            </div>
                          </Link>
                        ))}
                        <Link
                          href={`/collections?search=${searchQuery}`}
                          onClick={() => setSearchOpen(false)}
                          className="inline-flex items-center gap-2 mt-10 text-[11px] tracking-widest uppercase text-hp-blue font-medium hover:gap-3 transition-all"
                        >
                          View all results <ArrowRight size={14} />
                        </Link>
                      </div>
                    ) : (
                      <div className="py-20 text-center">
                        <p className="font-serif text-2xl font-light text-hp-gray mb-4">No products found for "{searchQuery}"</p>
                        <p className="text-sm text-hp-gray/60 max-w-sm mx-auto">Try checking your spelling or use a more general term like "Laptop" or "Printer".</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
