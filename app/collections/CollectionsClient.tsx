"use client";

import { useMemo, useState, useTransition } from "react";
import { SlidersHorizontal, ChevronDown, Loader2 } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/products";
import { fetchCatalogProductsClient } from "@/lib/hp-client";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "Printers", label: "Printers" },
  { key: "Desktops", label: "Desktops" },
  { key: "Laptops", label: "Laptops" },
  { key: "Storage", label: "Storage" },
  { key: "Solutions", label: "Solutions" },
  { key: "Software", label: "Software" },
  { key: "Services", label: "Services" },
  { key: "Scanners", label: "Scanners" },
  { key: "POS", label: "POS" },
  { key: "Monitors", label: "Monitors" },
  { key: "Supplies", label: "Supplies" },
  { key: "Industries", label: "Industries" },
  { key: "HyperX", label: "HyperX" },
  { key: "Entertainment", label: "Entertainment" },
  { key: "Accessories", label: "Accessories" },
  { key: "Desktops_Business", label: "Desktops Business" },
  { key: "Workstations", label: "Workstations" },
  { key: "Desktops_Home", label: "Desktops Home" },
  { key: "Laptops_Home", label: "Laptops Home" },
  { key: "DesignJet_Printers", label: "DesignJet Printers" },
  { key: "Industrial_Printers", label: "Industrial Printers" },
  { key: "Carepacks", label: "Carepacks" },
  { key: "Chromebooks", label: "Chromebooks" },
  { key: "Ink_Toner_Cartridges", label: "Ink & Toner Cartridges" },
  { key: "Printer_Supplies", label: "Printer Supplies" },
  { key: "Paper", label: "Paper" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

interface Props {
  initialProducts: Product[];
  totalCount: number;
}

export default function CollectionsClient({
  initialProducts,
  totalCount,
}: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [total, setTotal] = useState(totalCount);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const PAGE_SIZE = 20;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function loadPage(newPage: number, categoryKey: string) {
    startTransition(async () => {
      const isAll = categoryKey === "all";
      const { products: mapped, total: newTotal } = await fetchCatalogProductsClient({
        category: isAll ? "all" : undefined,
        catalogName: isAll ? undefined : categoryKey,
        pageNumber: newPage,
        pageSize: PAGE_SIZE,
      });

      setProducts(mapped);
      setTotal(newTotal);
      setPage(newPage);
    });
  }

  function handleCategoryChange(key: string) {
    setActiveCategory(key);
    loadPage(1, key);
  }

  const displayProducts = useMemo(
    () =>
      [...products].sort((a, b) => {
        if (sortBy === "price-asc")  return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating")     return b.rating - a.rating;
        return 0;
      }),
    [products, sortBy]
  );

  return (
    <main className="pt-20">
      {/* Page header */}
      <div className="bg-hp-cream section-pad py-14 md:py-20 border-b border-hp-light">
        <div className="max-content">
          <nav
            className="text-[11px] tracking-[0.15em] uppercase text-hp-gray font-light mb-3"
            aria-label="Breadcrumb"
          >
            Home &rsaquo; Collections
          </nav>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-hp-black">
            The Collection
          </h1>
          <p className="mt-4 text-sm font-light text-hp-gray max-w-xl leading-relaxed">
            Curated selection of HP's finest technology — from ultra-portable
            laptops to enterprise-grade printing and imaging solutions.
          </p>
        </div>
      </div>

      <div className="max-content section-pad py-8">
        {/* Filter + Sort bar */}
        <div
          className="flex flex-col md:flex-row items-start md:items-center
                      justify-between gap-4 pb-8 border-b border-hp-light"
        >
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                disabled={isPending}
                className={`px-5 py-2 text-[11px] tracking-[0.1em] uppercase font-medium
                             transition-all duration-200 border disabled:opacity-50
                             ${
                               activeCategory === key
                                 ? "bg-hp-black text-white border-hp-black"
                                 : "bg-white text-hp-gray border-hp-light hover:border-hp-gray"
                             }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sort — only effective for static data; API ordering is server-driven */}
          <div className="flex items-center gap-3">
            {isPending && (
              <Loader2 size={14} className="text-hp-blue animate-spin" />
            )}
            <SlidersHorizontal
              size={14}
              strokeWidth={1.5}
              className="text-hp-gray"
            />
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-hp-light text-sm
                           font-light text-hp-black pl-4 pr-8 py-2 focus:outline-none
                           focus:border-hp-blue cursor-pointer"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                strokeWidth={2}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-hp-gray pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-8 transition-opacity duration-200 ${
            isPending ? "opacity-40" : "opacity-100"
          }`}
        >
          {displayProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {displayProducts.length === 0 && !isPending && (
          <div className="text-center py-24">
            <p className="font-serif text-3xl font-light text-hp-gray/50">
              No products found
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16 pb-8">
            {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => i + 1).map(
              (n) => (
                <button
                  key={n}
                  onClick={() => loadPage(n, activeCategory)}
                  disabled={isPending}
                  className={`w-10 h-10 text-sm font-medium transition-all duration-200 disabled:opacity-50
                               ${
                                 n === page
                                   ? "bg-hp-black text-white"
                                   : "bg-white border border-hp-light text-hp-gray hover:border-hp-gray"
                               }`}
                >
                  {n}
                </button>
              )
            )}
            {totalPages > 8 && (
              <span className="text-hp-gray px-2">…{totalPages}</span>
            )}
          </div>
        )}
      </div>
    </main>
  );
}