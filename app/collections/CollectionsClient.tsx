"use client";

import { useState, useTransition } from "react";
import { SlidersHorizontal, ChevronDown, Loader2 } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/products";
import { getProductsByCategory } from "@/lib/products";

const CATEGORIES = [
  { key: "all",       label: "All" },
  { key: "ultrabook", label: "Laptops" },
  { key: "business",  label: "Business" },
  { key: "printer",   label: "Printers" },
  { key: "copier",    label: "Copiers" },
  { key: "accessory", label: "Accessories" },
];

const SORT_OPTIONS = [
  { value: "featured",   label: "Featured" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating",     label: "Top Rated" },
];

interface Props {
  initialProducts: Product[];
  totalCount: number;
  usingApiData: boolean;
}

export default function CollectionsClient({
  initialProducts,
  totalCount,
  usingApiData,
}: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy]                 = useState("featured");
  const [products, setProducts]             = useState<Product[]>(initialProducts);
  const [total, setTotal]                   = useState(totalCount);
  const [page, setPage]                     = useState(1);
  const [isPending, startTransition]        = useTransition();

  const PAGE_SIZE = 20;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  async function loadPage(newPage: number, category: string) {
    if (!usingApiData) return;

    startTransition(async () => {
      const facetValues =
        category !== "all" ? [`category:${category}`] : undefined;

      const res = await fetch("/api/hp/catalogitems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          catalogName: "Laptops",
          countryCode: "IN",
          languageCode: "EN",
          outputHierarchyLevel: "Product",
          pageNumber: newPage,
          pageSize: PAGE_SIZE,
          requestor: "DSKASHMIR-PRO",
        }),
      });

      if (!res.ok) return;

      const data = await res.json();
      if (data.items?.length) {
        // Enrich with content + images
        const productNumbers: string[] = data.items.map(
          (i: { productNumber: string }) => i.productNumber
        );

        const [contentRes, imagesRes] = await Promise.allSettled([
          fetch("/api/hp/productcontent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productNumbers,
              countryCode: "IN",
              languageCode: "EN",
              requestor: "DSKASHMIR-PRO",
            }),
          }).then((r) => r.json()),
          fetch("/api/hp/images", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productNumbers,
              countryCode: "IN",
              languageCode: "EN",
              requestor: "DSKASHMIR-PRO",
            }),
          }).then((r) => r.json()),
        ]);

        const contentMap = new Map(
          contentRes.status === "fulfilled"
            ? (contentRes.value.products ?? []).map(
                (p: { productNumber: string }) => [p.productNumber, p]
              )
            : []
        );

        const imagesMap = new Map(
          imagesRes.status === "fulfilled"
            ? (imagesRes.value.products ?? []).map(
                (p: { productNumber: string; images: unknown[] }) => [p.productNumber, p.images]
              )
            : []
        );

        const USD_TO_INR = 84;
        const mapped: Product[] = data.items.map(
          (item: {
            productNumber: string;
            shortName?: string;
            longName?: string;
            productLine?: string;
            category?: string;
            price?: { unitPrice?: number; listPrice?: number };
          }) => {
            const content: {
              name?: string;
              shortDescription?: string;
              longDescription?: string;
              specifications?: { name: string; value: string }[];
              productLine?: string;
            } | undefined = contentMap.get(item.productNumber) as typeof content;
            const imgs: { url: string; type: string }[] =
              (imagesMap.get(item.productNumber) as { url: string; type: string }[] | undefined) ?? [];

            const name =
              content?.name || item.longName || item.shortName || item.productNumber;
            const price = Math.round((item.price?.unitPrice ?? 0) * USD_TO_INR);

            return {
              id: item.productNumber,
              slug: name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, ""),
              productNumber: item.productNumber,
              name,
              series: content?.productLine || item.productLine || "HP",
              tagline: content?.shortDescription ?? "",
              description: content?.longDescription ?? content?.shortDescription ?? "",
              price,
              category: "ultrabook" as Product["category"],
              colors: [{ name: "Default", hex: "#1a1a2e" }],
              configs: [{ ram: "—", storage: "—", price }],
              specs:
                content?.specifications?.map((s) => ({
                  label: s.name,
                  value: s.value,
                })) ?? [],
              images: imgs.map((img) => img.url),
              rating: 4.5,
              reviewCount: 0,
              inBox: [],
            } satisfies Product;
          }
        );

        setProducts(mapped);
        setTotal(data.totalResults ?? mapped.length);
        setPage(newPage);
      }
    });
  }

  function handleCategoryChange(key: string) {
    setActiveCategory(key);
    if (usingApiData) {
      loadPage(1, key);
    }
  }

  // For static data: filter + sort client-side
  const displayProducts = usingApiData
    ? products
    : getProductsByCategory(activeCategory).sort((a, b) => {
        if (sortBy === "price-asc")  return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating")     return b.rating - a.rating;
        return 0;
      });

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

        {/* Pagination — only shown when using live API data */}
        {usingApiData && totalPages > 1 && (
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