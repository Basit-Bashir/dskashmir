"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  User,
  Menu,
  X,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Command,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/products";
import { fetchCatalogProductsClient } from "@/lib/hp-client";
import { useCart } from "@/lib/context/CartContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/collections?category=Laptops", label: "Laptops" },
  { href: "/collections?category=Printers", label: "Printers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const CHEEKY_QUOTES = [
  "⚡ Warning: Extremely fast HP laptops & commercial printers ahead!",
  "🚚 Free Express Delivery across India • Authorized DSK Kashmir Store",
  "✨ Certified HP Wolf Security • Official Enterprise Technology",
  "💳 0% EMI available on HP ZBook & LaserJet Managed series",
];

export default function Navbar() {
  const pathname = usePathname();
  const cartContext = useCart();
  const cartCount = cartContext?.cartCount || 0;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Rotating cheeky top ticker quote
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % CHEEKY_QUOTES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 25);
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

  // Handle Cmd+K / Ctrl+K and Escape shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Search HP catalog as user types
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const handle = setTimeout(() => {
      fetchCatalogProductsClient({ category: "all", searchPhrase: query, pageSize: 40 })
        .then(({ products }) => {
          const nameMatches = products.filter((p) =>
            p.name.toLowerCase().includes(query.toLowerCase())
          );
          setSearchResults(nameMatches.slice(0, 5));
        })
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(handle);
  }, [searchQuery]);

  const filteredProducts = searchResults;

  return (
    <>
      {/* ── Cheeky Top Announcement Ticker Bar ── */}
      <div className="bg-sand/70 border-b border-hp-black/10 text-hp-black text-[11px] py-1.5 px-4 font-medium relative z-50">
        <div className="max-content flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-hp-black/75">
            <Sparkles className="w-3.5 h-3.5 text-hp-blue" />
            <span className="hidden sm:inline">HP Premier Partner &middot; DSK Kashmir</span>
          </div>

          {/* Rotating Cheeky Quote */}
          <div className="overflow-hidden h-4 flex items-center justify-center flex-1 mx-2 sm:mx-4">
            <AnimatePresence mode="wait">
              <motion.span
                key={quoteIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-[11px] text-hp-black/85 font-medium tracking-wide truncate"
              >
                {CHEEKY_QUOTES[quoteIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="hidden md:flex items-center gap-3 text-hp-black/60 text-[10px] tracking-wider uppercase font-semibold">
            <Link href="/contact" className="hover:text-hp-black transition-colors">
              Support
            </Link>
            <span>&middot;</span>
            <Link href="/about" className="hover:text-hp-black transition-colors">
              Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* ── Cheeky Floating Glassmorphism Header ── */}
      <header
        className={`fixed top-7 left-0 right-0 z-40 transition-all duration-300 px-4 md:px-8`}
      >
        <div
          className={`max-w-[1320px] mx-auto rounded-full transition-all duration-300 ${scrolled
              ? "bg-white/85 backdrop-blur-xl border border-white/70 shadow-lg shadow-black/[0.04] py-2.5 px-6 md:px-8"
              : "bg-white/70 backdrop-blur-md border border-white/50 shadow-xs py-3 px-6 md:px-8"
            }`}
        >
          <div className="flex items-center justify-between">
            {/* Cheeky Logo */}
            <motion.div whileHover={{ scale: 1.05, rotate: -1.5 }}>
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => {
                  setMobileOpen(false);
                  setSearchOpen(false);
                }}
              >
                <span className="font-serif text-2xl md:text-3xl font-normal tracking-[0.12em] text-hp-black flex items-center gap-1">
                  <span className="text-hp-blue font-semibold">DSK</span>
                </span>

              </Link>
            </motion.div>

            {/* Desktop Nav Links with Cheeky Indicator */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-hp-cream/60 p-1.5 rounded-full border border-hp-black/5">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div key={link.href} whileHover={{ y: -1 }}>
                    <Link
                      href={link.href}
                      className={`relative px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${isActive
                          ? "text-hp-black font-semibold"
                          : "text-hp-black/70 hover:text-hp-black"
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="navbarActiveIndicator"
                          className="absolute inset-0 bg-white rounded-full shadow-xs border border-hp-black/10"
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Icons & Cheeky Search Pill */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Cheeky Search Button Pill */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-hp-cream/80 hover:bg-white text-hp-black/70 hover:text-hp-black border border-hp-black/10 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all shadow-2xs cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-hp-blue" />
                <span className="text-[11px] text-hp-black/55">Search SKUs...</span>
                <span className="inline-flex items-center gap-0.5 bg-white px-1.5 py-0.5 rounded text-[9px] font-mono text-hp-black/50 border border-hp-black/10">
                  <Command className="w-2.5 h-2.5" />K
                </span>
              </motion.button>

              {/* Mobile Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="sm:hidden p-2 text-hp-black/75 hover:text-hp-blue transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search size={20} strokeWidth={1.75} />
              </button>

              {/* Cart Icon with Bouncy Badge */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/cart"
                  className="relative p-2 text-hp-black/80 hover:text-hp-blue transition-colors flex items-center justify-center cursor-pointer"
                  aria-label="Shopping Cart"
                >
                  <ShoppingBag size={20} strokeWidth={1.75} />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-hp-blue text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>
              </motion.div>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 text-hp-black/80 hover:text-hp-blue transition-colors ml-1 cursor-pointer"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Search Modal Overlay ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-hp-cream/95 backdrop-blur-xl flex flex-col"
          >
            <div className="section-pad py-6 md:py-10 border-b border-hp-black/10 bg-white/60">
              <div className="max-content flex items-center justify-between">
                <div className="flex-1 flex items-center gap-4">
                  <Search size={26} strokeWidth={1.75} className="text-hp-blue" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Type an HP SKU (e.g. 3SJ03A, 9A838AV) or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-0 text-xl md:text-3xl font-serif font-light text-hp-black placeholder:text-hp-black/30 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 text-hp-black/50 hover:text-hp-black transition-colors cursor-pointer"
                >
                  <X size={28} strokeWidth={1.75} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto section-pad py-10">
              <div className="max-content">
                {searchQuery.trim() === "" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <h3 className="eyebrow">Cheeky Quick Picks</h3>
                      <div className="flex flex-col gap-3 mt-4">
                        {[
                          { name: "LaserJet Managed MFP E730dn", sku: "3SJ03A" },
                          { name: "ZBook Power 16 G11 A", sku: "9A838AV" },
                          { name: "OMEN 15 Gaming Laptop", sku: "D8PZ9PA" },
                          { name: "Smart Tank 520 All-in-One", sku: "1F3W2A" },
                        ].map((item) => (
                          <button
                            key={item.sku}
                            onClick={() => setSearchQuery(item.sku)}
                            className="text-left group flex items-center justify-between py-2 border-b border-hp-black/10 hover:border-hp-blue transition-colors cursor-pointer"
                          >
                            <span className="font-serif text-xl text-hp-black/80 group-hover:text-hp-blue transition-colors">
                              {item.name}
                            </span>
                            <span className="text-xs font-mono text-hp-black/40 group-hover:text-hp-blue">
                              SKU {item.sku}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="eyebrow">Popular Categories</h3>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {[
                          "Laptops",
                          "Printers",
                          "Workstations",
                          "Gaming",
                          "Smart Tank",
                          "LaserJet",
                        ].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSearchQuery(tag)}
                            className="px-4 py-2 bg-white border border-hp-black/10 rounded-full text-xs font-medium text-hp-black/80 hover:border-hp-blue hover:text-hp-blue transition-all cursor-pointer shadow-2xs"
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
                    {searching ? (
                      <div className="py-16 text-center">
                        <p className="text-sm text-hp-black/50">Searching HP Catalog...</p>
                      </div>
                    ) : filteredProducts.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2 mt-6">
                        {filteredProducts.map((p) => (
                          <Link
                            key={p.id}
                            href={`/product/${p.slug}`}
                            onClick={() => setSearchOpen(false)}
                            className="group flex items-center justify-between p-5 bg-white rounded-2xl border border-hp-black/10 hover:border-hp-blue shadow-2xs hover:shadow-md transition-all"
                          >
                            <div className="flex items-center gap-6">
                              <div className="w-14 h-14 bg-hp-cream rounded-xl flex items-center justify-center p-2 border border-hp-black/5">
                                {p.images?.[0] ? (
                                  <img
                                    src={p.images[0]}
                                    alt={p.name}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <span className="text-[10px] text-hp-black/40 font-mono">
                                    {p.productNumber || "HP"}
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="text-[10px] tracking-widest uppercase text-hp-black/45 mb-0.5">
                                  {p.series || p.productNumber}
                                </p>
                                <h4 className="text-base font-serif font-medium text-hp-black group-hover:text-hp-blue transition-colors">
                                  {p.name}
                                </h4>
                              </div>
                            </div>
                            <ArrowRight
                              size={18}
                              className="text-hp-blue opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all flex-shrink-0"
                            />
                          </Link>
                        ))}
                        <Link
                          href={`/collections?search=${encodeURIComponent(searchQuery)}`}
                          onClick={() => setSearchOpen(false)}
                          className="inline-flex items-center gap-2 mt-8 text-xs font-semibold uppercase tracking-wider text-hp-blue hover:gap-3 transition-all"
                        >
                          <span>View all catalog matches</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    ) : (
                      <div className="py-16 text-center">
                        <p className="font-serif text-2xl font-normal text-hp-black mb-3">
                          No HP products match "{searchQuery}"
                        </p>
                        <p className="text-sm text-hp-black/60 max-w-sm mx-auto">
                          Try searching for a SKU like "3SJ03A" or general terms like "Laptop" or "Printer".
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cheeky Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed inset-x-4 top-24 z-40 bg-white/95 backdrop-blur-2xl rounded-3xl border border-hp-black/10 p-6 shadow-xl md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block font-serif text-2xl font-normal text-hp-black hover:text-hp-blue transition-colors py-2 border-b border-hp-black/5"
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex items-center justify-between pt-4 mt-2">
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="btn-pill w-full flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} />
                  <span>Shopping Cart ({cartCount})</span>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
