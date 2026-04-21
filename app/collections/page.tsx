"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { PRODUCTS, getProductsByCategory } from "@/lib/products";

const CATEGORIES = [
  { key: "all",        label: "All" },
  { key: "ultrabook",  label: "Laptops" },
  { key: "business",   label: "Business" },
  { key: "printer",    label: "Printers" },
  { key: "copier",     label: "Copiers" },
  { key: "accessory",  label: "Accessories" },
];

const SORT_OPTIONS = [
  { value: "featured",    label: "Featured" },
  { value: "price-asc",   label: "Price: Low to High" },
  { value: "price-desc",  label: "Price: High to Low" },
  { value: "newest",      label: "Newest First" },
  { value: "rating",      label: "Top Rated" },
];

export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 300000]); // Updated range for INR

  const filtered = getProductsByCategory(activeCategory).sort((a, b) => {
    if (sortBy === "price-asc")  return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating")     return b.rating - a.rating;
    return 0;
  });

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Page header */}
        <div className="bg-hp-cream section-pad py-14 md:py-20 border-b border-hp-light">
          <div className="max-content">
            <p className="text-[11px] tracking-[0.15em] uppercase text-hp-gray font-light mb-3">
              Home &rsaquo; Collections
            </p>
            <h1 className="font-serif text-5xl md:text-6xl font-light text-hp-black">
              The Collection
            </h1>
            <p className="mt-4 text-sm font-light text-hp-gray max-w-xl leading-relaxed">
              Curated selection of HP's finest technology — from ultra-portable laptops 
              to enterprise-grade printing and imaging solutions.
            </p>
          </div>
        </div>

        <div className="max-content section-pad py-8">
          {/* Filter + Sort bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center
                          justify-between gap-4 pb-8 border-b border-hp-light">

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-5 py-2 text-[11px] tracking-[0.1em] uppercase font-medium
                             transition-all duration-200 border
                             ${activeCategory === key
                               ? "bg-hp-black text-white border-hp-black"
                               : "bg-white text-hp-gray border-hp-light hover:border-hp-gray"
                             }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">
              <SlidersHorizontal size={14} strokeWidth={1.5} className="text-hp-gray" />
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-hp-light text-sm
                             font-light text-hp-black pl-4 pr-8 py-2 focus:outline-none
                             focus:border-hp-blue cursor-pointer"
                >
                  {SORT_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <ChevronDown size={12} strokeWidth={2}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-hp-gray pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-8">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="font-serif text-3xl font-light text-hp-gray/50">
                No products found
              </p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-16 pb-8">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`w-10 h-10 text-sm font-medium transition-all duration-200
                           ${n === 1
                             ? "bg-hp-black text-white"
                             : "bg-white border border-hp-light text-hp-gray hover:border-hp-gray"
                           }`}
              >
                {n}
              </button>
            ))}
            <span className="text-hp-gray px-2">…</span>
            <button className="w-10 h-10 text-sm bg-white border border-hp-light
                               text-hp-gray hover:border-hp-gray transition-all duration-200">
              8
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
