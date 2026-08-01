"use client";

import { useMemo, useState, useTransition } from "react";
import { SlidersHorizontal, ChevronDown, Loader2, Search, X } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/products";
import { fetchCatalogProductsClient } from "@/lib/hp-client";
import { COLLECTIONS_PAGE_SIZE } from "@/lib/hp-catalogs";

const PRIMARY_CATEGORIES = [
  { key: "all", label: "All Products" },
  { key: "Laptops", label: "Laptops" },
  { key: "Desktops", label: "Desktops" },
  { key: "Printers", label: "Printers" },
  { key: "Monitors", label: "Monitors" },
  { key: "Accessories", label: "Accessories" },
  { key: "Storage", label: "Storage" },
  { key: "Supplies", label: "Supplies & Cartridges" },
  { key: "Workstations", label: "Workstations" },
  { key: "Software", label: "Software & Solutions" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

interface Props {
  initialProducts: Product[];
  totalCount: number;
  initialCatalogReferences?: Record<string, string>;
}

export default function CollectionsClient({
  initialProducts,
  totalCount,
  initialCatalogReferences,
}: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [total, setTotal] = useState(totalCount);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  // HP's catalogitems API requires the catalogReference issued by the page-1
  // response to be echoed back for page 2+, or it 400s. Keyed by catalog name.
  // Seeded from the server-rendered initial page so "page 2" works even
  // before the user ever switches categories client-side.
  const [catalogRefs, setCatalogRefs] = useState<Record<string, string>>(initialCatalogReferences ?? {});

  const PAGE_SIZE = COLLECTIONS_PAGE_SIZE;

  function loadPage(newPage: number, categoryKey: string) {
    startTransition(async () => {
      const isAll = categoryKey === "all";
      const { products: mapped, total: newTotal, catalogReferences } = await fetchCatalogProductsClient({
        category: isAll ? "all" : undefined,
        catalogName: isAll ? undefined : categoryKey,
        pageNumber: newPage,
        pageSize: PAGE_SIZE,
        catalogReferences: newPage > 1 ? catalogRefs : undefined,
      });

      setProducts(mapped);
      setTotal(newTotal);
      setPage(newPage);
      setCatalogRefs((prev) => ({ ...prev, ...catalogReferences }));
    });
  }

  function handleCategoryChange(key: string) {
    setActiveCategory(key);
    loadPage(1, key);
  }

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.productNumber?.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
      const matchSeries = p.series.toLowerCase().includes(q);
      const matchSpec = p.specs.some(
        (s) => s.label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q)
      );
      return matchName || matchSku || matchSeries || matchSpec;
    });
  }, [products, searchQuery]);

  const displayProducts = useMemo(
    () =>
      [...filteredProducts].sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0;
      }),
    [filteredProducts, sortBy]
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="pt-20 bg-white">
      {/* Page Header */}
      <div className="bg-hp-cream/60 section-pad py-14 md:py-20 border-b border-hp-light">
        <div className="max-content">
          <nav
            className="text-[11px] tracking-[0.15em] uppercase text-hp-gray font-light mb-3"
            aria-label="Breadcrumb"
          >
            Home &rsaquo; HP Catalog & Collections
          </nav>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-hp-black">
            HP Products & Technology
          </h1>
          <p className="mt-4 text-sm font-light text-hp-gray max-w-xl leading-relaxed">
            Explore HP's official product range — from AI-ready laptops and high-performance desktops to enterprise printers and accessories.
          </p>
        </div>
      </div>

      <div className="max-content section-pad py-8">
        {/* Search Bar + Filter Controls */}
        <div className="space-y-6 pb-8 border-b border-hp-light">
          {/* Search Input Bar (Patterned after sigmainfotech hp-product) */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full max-w-2xl">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-hp-gray" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by SKU, Product Title, Series, or Specs (e.g. Intel Core Ultra, 16GB)..."
                className="w-full pl-10 pr-10 py-2.5 text-xs md:text-sm bg-white border border-hp-light focus:outline-none focus:border-hp-blue transition-colors rounded-sm shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-hp-gray/60 hover:text-hp-black"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <p className="text-xs text-hp-gray font-light self-end sm:self-center">
              <span className="font-semibold text-hp-black">{displayProducts.length}</span> products displayed
            </p>
          </div>

          {/* Category & Sort controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Category Dropdown */}
            <div className="relative w-full sm:w-64">
              <select
                value={activeCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                disabled={isPending}
                className="w-full appearance-none bg-white border border-hp-light text-[11px]
                           tracking-[0.08em] uppercase font-medium text-hp-black pl-3.5 pr-9 py-2.5
                           focus:outline-none focus:border-hp-blue cursor-pointer rounded-sm
                           disabled:opacity-50"
                aria-label="Filter by category"
              >
                {PRIMARY_CATEGORIES.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                strokeWidth={2}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-hp-gray pointer-events-none"
              />
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-3 flex-shrink-0 self-end lg:self-auto">
              {isPending && <Loader2 size={14} className="text-hp-blue animate-spin" />}
              <SlidersHorizontal size={14} strokeWidth={1.5} className="text-hp-gray" />
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-hp-light text-xs
                             font-light text-hp-black pl-3 pr-8 py-2 focus:outline-none
                             focus:border-hp-blue cursor-pointer rounded-sm"
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
        </div>

        {/* Product Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8 transition-opacity duration-200 ${
            isPending ? "opacity-40" : "opacity-100"
          }`}
        >
          {displayProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {displayProducts.length === 0 && !isPending && (
          <div className="text-center py-20 bg-hp-cream/30 border border-hp-light rounded-sm mt-8">
            <p className="font-serif text-2xl font-light text-hp-black mb-2">No products found</p>
            <p className="text-xs text-hp-gray font-light">
              Try adjusting your search criteria or selecting a different category.
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 bg-hp-black text-white text-[10px] tracking-wider uppercase font-semibold rounded-sm"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16 pb-8">
            {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => loadPage(n, activeCategory)}
                disabled={isPending}
                className={`w-9 h-9 text-xs font-medium transition-all duration-200 disabled:opacity-50 rounded-sm
                           ${
                             n === page
                               ? "bg-hp-black text-white"
                               : "bg-white border border-hp-light text-hp-gray hover:border-hp-gray"
                           }`}
              >
                {n}
              </button>
            ))}
            {totalPages > 8 && <span className="text-hp-gray text-xs px-2">…{totalPages}</span>}
          </div>
        )}
      </div>
    </main>
  );
}