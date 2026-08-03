"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, ChevronDown, Loader2, Search, X, Tag } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/products";
import { fetchCatalogProductsClient } from "@/lib/hp-client";
import { COLLECTIONS_PAGE_SIZE } from "@/lib/hp-catalogs";

const PRIMARY_CATEGORIES = [
  { key: "all", label: "ALL PRODUCTS" },
  { key: "Laptops", label: "LAPTOPS" },
  { key: "Desktops", label: "DESKTOPS" },
  { key: "Printers", label: "PRINTERS" },
  { key: "Monitors", label: "MONITORS" },
  { key: "Accessories", label: "ACCESSORIES" },
  { key: "Storage", label: "STORAGE" },
  { key: "Supplies", label: "SUPPLIES & TONER" },
  { key: "Workstations", label: "WORKSTATIONS" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

interface ShowcaseCard {
  id: string;
  title: string;
  subCategoryKey?: string;
  searchFilter?: string;
  image: string;
}

interface CategoryShowcase {
  tagline: string;
  dealsLabel: string;
  subLinks: Array<{ label: string; filter?: string }>;
  cards: ShowcaseCard[];
}

const CATEGORY_SHOWCASES: Record<string, CategoryShowcase> = {
  Printers: {
    tagline: "HP Printing Solutions, Smart Tanks & Toner",
    dealsLabel: "Printer Deals",
    subLinks: [
      { label: "Featured" },
      { label: "Smart Tank", filter: "Smart Tank" },
      { label: "Laser Printers", filter: "Laser" },
      { label: "Print Learn Center" },
      { label: "Explore All Printers" },
    ],
    cards: [
      {
        id: "printers-home",
        title: "Printers for Home",
        subCategoryKey: "InkJet_Multifunction_Printers",
        searchFilter: "DeskJet",
        image: "https://hp.widen.net/content/ajoyilc3js/jpeg/ajoyilc3js.jpg?w=600&h=600&dpi=72",
      },
      {
        id: "printers-work",
        title: "Printers for Work",
        subCategoryKey: "LaserJet_Multifunction_Printers",
        searchFilter: "LaserJet",
        image: "https://hp.widen.net/content/ttsm5arnrp/jpeg/ttsm5arnrp.jpg?w=600&h=600&dpi=72",
      },
      {
        id: "printers-supplies",
        title: "Ink, Toner & Paper",
        subCategoryKey: "Ink_Toner_Cartridges",
        searchFilter: "Cartridge",
        image: "https://hp.widen.net/content/vrl0vxe8hj/jpeg/vrl0vxe8hj.jpg?w=600&h=600&dpi=72",
      },
      {
        id: "printers-large-format",
        title: "Large Format Printers & Plotters",
        subCategoryKey: "DesignJet_Printers",
        searchFilter: "DesignJet",
        image: "https://hp.widen.net/content/ajoyilc3js/jpeg/ajoyilc3js.jpg?w=600&h=600&dpi=72",
      },
    ],
  },
  Laptops: {
    tagline: "HP Laptops, Pavilion, EliteBook & OMEN Gaming",
    dealsLabel: "Laptop Deals",
    subLinks: [
      { label: "Featured" },
      { label: "Laptops for Home", filter: "Pavilion" },
      { label: "Laptops for Work", filter: "EliteBook" },
      { label: "OMEN & Victus Gaming", filter: "Gaming" },
      { label: "Explore All Laptops" },
    ],
    cards: [
      {
        id: "laptops-home",
        title: "Laptops for Home",
        subCategoryKey: "Laptops_Home",
        searchFilter: "Pavilion",
        image: "https://ssl-product-images.www8-hp.com/digmedlab/library/skin/tmp.391787_1600x1200_white.png",
      },
      {
        id: "laptops-work",
        title: "Laptops for Work",
        subCategoryKey: "Laptops_Business",
        searchFilter: "ProBook",
        image: "https://ssl-product-images.www8-hp.com/digmedlab/library/skin/tmp.391788_1600x1200_white.png",
      },
      {
        id: "laptops-gaming",
        title: "Gaming Laptops",
        searchFilter: "OMEN",
        image: "https://ssl-product-images.www8-hp.com/digmedlab/library/skin/tmp.391789_1600x1200_white.png",
      },
      {
        id: "laptops-chromebooks",
        title: "Chromebooks & 2-in-1s",
        subCategoryKey: "Chromebooks",
        searchFilter: "Chromebook",
        image: "https://ssl-product-images.www8-hp.com/digmedlab/library/skin/tmp.391790_1600x1200_white.png",
      },
    ],
  },
  Desktops: {
    tagline: "HP Desktops, Towers, All-in-Ones & Workstations",
    dealsLabel: "Desktop Deals",
    subLinks: [
      { label: "Featured" },
      { label: "All-in-One PCs", filter: "All-in-One" },
      { label: "Business Towers", filter: "Tower" },
      { label: "Z Workstations", filter: "Workstation" },
      { label: "Explore All Desktops" },
    ],
    cards: [
      {
        id: "desktops-home",
        title: "Desktops for Home",
        subCategoryKey: "Desktops_Home",
        searchFilter: "All-in-One",
        image: "https://hp.widen.net/content/flvbslakmz/png/flvbslakmz.png?w=600&h=600&dpi=72",
      },
      {
        id: "desktops-work",
        title: "Desktops for Work",
        subCategoryKey: "Desktops_Business",
        searchFilter: "ProDesk",
        image: "https://hp.widen.net/content/vt5t2bzbmc/original/vt5t2bzbmc.jpg",
      },
      {
        id: "desktops-workstations",
        title: "Z Workstations",
        subCategoryKey: "Workstations",
        searchFilter: "Z2",
        image: "https://hp.widen.net/content/r735xyreix/original/r735xyreix.jpg",
      },
      {
        id: "desktops-gaming",
        title: "Gaming Desktops",
        searchFilter: "OMEN",
        image: "https://hp.widen.net/content/flvbslakmz/png/flvbslakmz.png?w=600&h=600&dpi=72",
      },
    ],
  },
  Accessories: {
    tagline: "HP Displays, Docking Stations & Peripherals",
    dealsLabel: "Accessory Deals",
    subLinks: [
      { label: "Featured" },
      { label: "Monitors & Displays", filter: "Monitor" },
      { label: "Keyboards & Mice", filter: "Mouse" },
      { label: "Docks & Power", filter: "Dock" },
      { label: "Explore All Accessories" },
    ],
    cards: [
      {
        id: "acc-keyboards",
        title: "Keyboards & Mice",
        subCategoryKey: "Keyboards_Mice",
        searchFilter: "Keyboard",
        image: "https://hp.widen.net/content/chgurx1rr4/png/chgurx1rr4.png?w=600&h=600&dpi=72",
      },
      {
        id: "acc-docks",
        title: "Docking Stations",
        subCategoryKey: "Docking_Stations",
        searchFilter: "Dock",
        image: "https://hp.widen.net/content/vt5t2bzbmc/original/vt5t2bzbmc.jpg",
      },
      {
        id: "acc-chargers",
        title: "Chargers & Power",
        subCategoryKey: "Chargers_Power_Adaptors",
        searchFilter: "Adapter",
        image: "https://hp.widen.net/content/r735xyreix/original/r735xyreix.jpg",
      },
      {
        id: "acc-monitors",
        title: "Monitors & Displays",
        searchFilter: "Monitor",
        image: "https://hp.widen.net/content/flvbslakmz/png/flvbslakmz.png?w=600&h=600&dpi=72",
      },
    ],
  },
  all: {
    tagline: "Explore HP Official Products, Technology & Accessories",
    dealsLabel: "Hot Deals",
    subLinks: [
      { label: "Featured" },
      { label: "Smart Tank Printers", filter: "Smart Tank" },
      { label: "LaserJet Printers", filter: "Laser" },
      { label: "AI Notebooks", filter: "Notebook" },
      { label: "Explore All Products" },
    ],
    cards: [
      {
        id: "all-home-printers",
        title: "Printers for Home",
        subCategoryKey: "Printers",
        searchFilter: "DeskJet",
        image: "https://hp.widen.net/content/ajoyilc3js/jpeg/ajoyilc3js.jpg?w=600&h=600&dpi=72",
      },
      {
        id: "all-work-printers",
        title: "Printers for Work",
        subCategoryKey: "Printers",
        searchFilter: "LaserJet",
        image: "https://hp.widen.net/content/ttsm5arnrp/jpeg/ttsm5arnrp.jpg?w=600&h=600&dpi=72",
      },
      {
        id: "all-supplies",
        title: "Ink, Toner & Paper",
        subCategoryKey: "Supplies",
        searchFilter: "Toner",
        image: "https://hp.widen.net/content/vrl0vxe8hj/jpeg/vrl0vxe8hj.jpg?w=600&h=600&dpi=72",
      },
      {
        id: "all-plotters",
        title: "Large Format Printers & Plotters",
        subCategoryKey: "Printers",
        searchFilter: "DesignJet",
        image: "https://hp.widen.net/content/ajoyilc3js/jpeg/ajoyilc3js.jpg?w=600&h=600&dpi=72",
      },
    ],
  },
};

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
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") ?? "");
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [total, setTotal] = useState(totalCount);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [catalogRefs, setCatalogRefs] = useState<Record<string, string>>(initialCatalogReferences ?? {});
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeSubFilter, setActiveSubFilter] = useState<string | null>(null);

  const PAGE_SIZE = COLLECTIONS_PAGE_SIZE;

  function loadPage(newPage: number, categoryKey: string, customSearch?: string) {
    startTransition(async () => {
      const isAll = categoryKey === "all";
      const { products: mapped, total: newTotal, catalogReferences } = await fetchCatalogProductsClient({
        category: isAll ? "all" : undefined,
        catalogName: isAll ? undefined : categoryKey,
        searchPhrase: customSearch || searchQuery || undefined,
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
    setActiveSubFilter(null);
    if (!searchQuery.trim()) loadPage(1, key);
  }

  function handleSubcardClick(card: ShowcaseCard) {
    setActiveSubFilter(card.title);
    if (card.subCategoryKey && card.subCategoryKey !== activeCategory) {
      setActiveCategory(card.subCategoryKey);
    }
    if (card.searchFilter) {
      setSearchQuery(card.searchFilter);
    } else {
      loadPage(1, card.subCategoryKey || activeCategory);
    }
  }

  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) return;

    setSearchLoading(true);
    const handle = setTimeout(() => {
      const isAll = activeCategory === "all";
      fetchCatalogProductsClient({
        category: isAll ? "all" : undefined,
        catalogName: isAll ? undefined : activeCategory,
        searchPhrase: query,
        pageSize: PAGE_SIZE,
      })
        .then(({ products: mapped, catalogReferences }) => {
          const nameMatches = mapped.filter((p) =>
            p.name.toLowerCase().includes(query.toLowerCase())
          );
          setProducts(nameMatches.length > 0 ? nameMatches : mapped);
          setTotal(nameMatches.length > 0 ? nameMatches.length : mapped.length);
          setPage(1);
          setCatalogRefs((prev) => ({ ...prev, ...catalogReferences }));
        })
        .finally(() => setSearchLoading(false));
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, activeCategory]);

  function clearSearch() {
    setSearchQuery("");
    setActiveSubFilter(null);
    loadPage(1, activeCategory);
  }

  const displayProducts = useMemo(
    () =>
      [...products].sort((a, b) => {
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        if (sortBy === "name-desc") return b.name.localeCompare(a.name);
        return 0;
      }),
    [products, sortBy]
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentShowcase = CATEGORY_SHOWCASES[activeCategory] || CATEGORY_SHOWCASES.all;

  return (
    <main className="pt-16 bg-white min-h-screen">
      {/* ── 1. Top Navigation Bar (Patterned after HP Store Navigation Header in Image 2) ── */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 overflow-x-auto scrollbar-none py-3">
            {[
              { key: "all", label: "All Products" },
              { key: "Laptops", label: "Laptops" },
              { key: "Desktops", label: "Desktops" },
              { key: "Printers", label: "Printers" },
              { key: "Accessories", label: "Accessories" },
              { key: "Storage", label: "Storage" },
              { key: "Supplies", label: "Supplies" },
              { key: "Workstations", label: "Workstations" },
            ].map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryChange(cat.key)}
                  className={`text-xs md:text-sm font-medium whitespace-nowrap pb-2.5 transition-colors relative ${
                    isActive ? "text-hp-black font-bold" : "text-neutral-600 hover:text-hp-black"
                  }`}
                >
                  {cat.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ── 2. Category Subcategory Showcase Header (Exact match to Image 2) ── */}
        <div className="bg-white pb-8 border-b border-neutral-200 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar Menu */}
            <div className="lg:col-span-3 space-y-4 pt-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 tracking-wide uppercase">
                <Tag size={15} />
                <span>{currentShowcase.dealsLabel}</span>
              </div>
              <div className="h-px bg-neutral-200 w-full my-2" />
              <nav className="flex flex-col space-y-2.5 text-xs md:text-sm text-neutral-700">
                {currentShowcase.subLinks.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.filter) setSearchQuery(item.filter);
                      else clearSearch();
                    }}
                    className={`text-left hover:text-black transition-colors ${
                      idx === 0 ? "font-bold text-black" : "font-normal"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Right 4 Subcategory Showcase Cards Grid */}
            <div className="lg:col-span-9">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {currentShowcase.cards.map((card) => {
                  const isSelected = activeSubFilter === card.title;
                  return (
                    <button
                      key={card.id}
                      onClick={() => handleSubcardClick(card)}
                      className={`group flex flex-col items-center justify-between p-4 rounded-xl transition-all duration-200 text-center ${
                        isSelected
                          ? "bg-neutral-200/80 ring-2 ring-black"
                          : "bg-[#f4f4f5] hover:bg-neutral-200/60"
                      }`}
                    >
                      <div className="w-full h-32 flex items-center justify-center p-2">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="max-h-24 max-w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <span className="mt-3 text-xs md:text-sm font-medium text-neutral-900 leading-snug">
                        {card.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Search Bar + Filter Bar (Matching Image 1 & Search pattern) ── */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 mb-6">
          {/* Search Box */}
          <div className="relative flex-1 max-w-xl">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                if (!value.trim() && searchQuery.trim()) loadPage(1, activeCategory);
              }}
              placeholder="Search HP catalog by SKU, series, or specs (e.g. Smart Tank, EliteBook)..."
              className="w-full pl-10 pr-10 py-2.5 text-xs md:text-sm bg-white border border-neutral-300 focus:outline-none focus:border-black rounded-sm shadow-2xs"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Category Dropdown (Exact match to Image 1) */}
            <div className="relative border border-neutral-300 rounded-sm bg-white px-3.5 py-2 shadow-2xs flex items-center">
              <select
                value={activeCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                disabled={isPending}
                className="appearance-none bg-transparent text-xs font-bold tracking-wider text-black pr-7 uppercase focus:outline-none cursor-pointer disabled:opacity-50"
                aria-label="Filter by category"
              >
                {PRIMARY_CATEGORIES.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} strokeWidth={2} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              {(isPending || searchLoading) && <Loader2 size={14} className="text-black animate-spin" />}
              <SlidersHorizontal size={14} className="text-neutral-500" />
              <div className="relative border border-neutral-300 rounded-sm bg-white px-3 py-2 shadow-2xs">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent text-xs font-medium text-neutral-800 pr-6 focus:outline-none cursor-pointer"
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} strokeWidth={2} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. Product Grid Display ── */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-200 ${
            isPending || searchLoading ? "opacity-40" : "opacity-100"
          }`}
        >
          {displayProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {displayProducts.length === 0 && !isPending && !searchLoading && (
          <div className="text-center py-20 bg-neutral-50 border border-neutral-200 rounded-lg mt-8">
            <p className="font-serif text-2xl font-light text-neutral-900 mb-2">No products found</p>
            <p className="text-xs text-neutral-500 font-light">
              Try adjusting your search criteria or selecting a different category.
            </p>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="mt-4 px-4 py-2 bg-black text-white text-[10px] tracking-wider uppercase font-semibold rounded-sm"
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
                className={`w-9 h-9 text-xs font-medium transition-all duration-200 disabled:opacity-50 rounded-sm ${
                  n === page
                    ? "bg-black text-white"
                    : "bg-white border border-neutral-300 text-neutral-700 hover:border-black"
                }`}
              >
                {n}
              </button>
            ))}
            {totalPages > 8 && <span className="text-neutral-400 text-xs px-2">…{totalPages}</span>}
          </div>
        )}
      </div>
    </main>
  );
}