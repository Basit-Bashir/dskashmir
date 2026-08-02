"use client";

import { useState, useMemo } from "react";
import {
  Heart,
  MessageSquare,
  Cpu,
  Monitor,
  HardDrive,
  Feather,
  FileText,
  Search,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Info,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/lib/products";
import { BADGE_STYLES, cn } from "@/lib/utils";
import EnquiryModal from "@/components/contact/EnquiryModal";

interface ProductPageClientProps {
  product: Product;
  related: Product[];
}

const WARRANTY_GROUP = "Warranty & Support";

export default function ProductPageClient({ product, related }: ProductPageClientProps) {
  const [activeImg, setActiveImg] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [activeConfig, setActiveConfig] = useState(0);
  const [activeTab, setActiveTab] = useState<"specs" | "details" | "warranty" | "highlights" | "inbox" | "docs">("specs");
  const [specQuery, setSpecQuery] = useState("");
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  // Quick stats extracted from specs. Word-boundary matching avoids false
  // positives like "Postcards" containing the substring "os".
  const quickStats = useMemo(() => {
    const findSpec = (keywords: string[], exclude?: RegExp) =>
      product.specs.find(
        (s) => !(exclude && exclude.test(s.label)) && keywords.some((k) => new RegExp(`\\b${k}\\b`, "i").test(s.label))
      )?.value;

    return {
      processor: findSpec(["processor", "cpu"]),
      display: findSpec(["display", "screen", "diagonal"]),
      memory: findSpec(["memory", "ram"], /temperature/i),
      storage: findSpec(["storage", "drive", "ssd"], /temperature/i),
      weight: findSpec(["weight"]),
    };
  }, [product.specs]);

  // Group specs by groupName. Warranty & Support gets its own tab (below)
  // instead of sitting inside the general Specifications list.
  const groupedSpecs = useMemo(() => {
    const map = new Map<string, typeof product.specs>();
    for (const spec of product.specs) {
      const group = spec.groupName || "General Specifications";
      if (group === WARRANTY_GROUP) continue;
      if (
        specQuery &&
        !spec.label.toLowerCase().includes(specQuery.toLowerCase()) &&
        !spec.value.toLowerCase().includes(specQuery.toLowerCase())
      ) {
        continue;
      }
      if (!map.has(group)) map.set(group, []);
      map.get(group)!.push(spec);
    }
    return map;
  }, [product.specs, specQuery]);

  const warrantySpecs = useMemo(
    () => product.specs.filter((s) => (s.groupName || "") === WARRANTY_GROUP),
    [product.specs]
  );

  return (
    <main className="pt-20 bg-white">
      {/* Breadcrumb */}
      <nav className="section-pad py-4 border-b border-hp-light bg-hp-cream/40" aria-label="Breadcrumb">
        <div className="max-content">
          <div className="flex items-center gap-2 text-[11px] text-hp-gray font-light">
            <Link href="/" className="hover:text-hp-blue transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-hp-blue transition-colors">
              Collections
            </Link>
            <span>/</span>
            <span className="text-hp-black font-medium" aria-current="page">
              {product.name}
            </span>
          </div>
        </div>
      </nav>

      {/* PDP Main Grid */}
      <div className="section-pad py-10 md:py-16">
        <div className="max-content">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10 xl:gap-16">
            {/* LEFT — Gallery & Quick Features */}
            <div>
              <div className="flex gap-4 items-start">
                {/* Thumbnails — Showcase max 5 images */}
                {product.images.length > 1 && (
                  <div className="hidden md:flex flex-col gap-2.5 w-16 flex-shrink-0">
                    {product.images.slice(0, 5).map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={cn(
                          "w-16 h-16 bg-hp-cream border overflow-hidden transition-all duration-200 p-1 flex items-center justify-center rounded-xs",
                          activeImg === i ? "border-hp-blue ring-1 ring-hp-blue" : "border-hp-light hover:border-hp-gray"
                        )}
                        aria-label={`View image ${i + 1}`}
                      >
                        <img src={img} alt={`${product.name} thumbnail ${i + 1}`} className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main image container with fixed aspect ratio */}
                <motion.div
                  key={activeImg}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 aspect-[4/3] max-h-[460px] bg-hp-cream relative border border-hp-light/60 overflow-hidden cursor-zoom-in group flex items-center justify-center rounded-xs"
                >
                  {product.badge && (
                    <span
                      className={cn(
                        "absolute top-4 left-4 text-[9px] tracking-[0.15em] uppercase font-medium px-2.5 py-1 z-10",
                        BADGE_STYLES[product.badge] || "bg-hp-black text-white"
                      )}
                    >
                      {product.badge}
                    </span>
                  )}
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[activeImg]}
                      alt={product.name}
                      className="w-full h-full object-contain p-6 group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-hp-cream to-hp-light">
                      <div className="text-center p-6">
                        <p className="font-serif text-3xl md:text-4xl font-light text-hp-gray/40">{product.name}</p>
                        <p className="text-[10px] tracking-widest uppercase text-hp-gray/30 mt-2">{product.series}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Quick Tech Spec Badges */}
              {(quickStats.processor || quickStats.display || quickStats.memory || quickStats.weight) && (
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {quickStats.processor && (
                    <div className="p-3.5 bg-hp-cream/60 border border-hp-light rounded-sm">
                      <Cpu size={16} className="text-hp-blue mb-1.5" />
                      <p className="text-[10px] uppercase tracking-wider text-hp-gray font-medium">Processor</p>
                      <p className="text-xs text-hp-black font-normal line-clamp-1 mt-0.5">{quickStats.processor}</p>
                    </div>
                  )}
                  {quickStats.display && (
                    <div className="p-3.5 bg-hp-cream/60 border border-hp-light rounded-sm">
                      <Monitor size={16} className="text-hp-blue mb-1.5" />
                      <p className="text-[10px] uppercase tracking-wider text-hp-gray font-medium">Display</p>
                      <p className="text-xs text-hp-black font-normal line-clamp-1 mt-0.5">{quickStats.display}</p>
                    </div>
                  )}
                  {quickStats.memory && (
                    <div className="p-3.5 bg-hp-cream/60 border border-hp-light rounded-sm">
                      <HardDrive size={16} className="text-hp-blue mb-1.5" />
                      <p className="text-[10px] uppercase tracking-wider text-hp-gray font-medium">Memory</p>
                      <p className="text-xs text-hp-black font-normal line-clamp-1 mt-0.5">{quickStats.memory}</p>
                    </div>
                  )}
                  {quickStats.weight && (
                    <div className="p-3.5 bg-hp-cream/60 border border-hp-light rounded-sm">
                      <Feather size={16} className="text-hp-blue mb-1.5" />
                      <p className="text-[10px] uppercase tracking-wider text-hp-gray font-medium">Weight</p>
                      <p className="text-xs text-hp-black font-normal line-clamp-1 mt-0.5">{quickStats.weight}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT — Product Purchasing & Key Overview */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="eyebrow mb-0">{product.series}</span>
                {product.productNumber && (
                  <span className="text-[10px] bg-hp-cream px-2 py-0.5 text-hp-gray border border-hp-light rounded-sm font-mono">
                    SKU: {product.productNumber}
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl md:text-4xl font-light text-hp-black mb-6 leading-tight">{product.name}</h1>

              {/* Clean HP Description */}
              {product.description && (
                <p className="text-sm font-light leading-relaxed text-hp-gray mb-6">{product.description}</p>
              )}

              {/* HP API Key Highlights */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="mb-6 p-4 bg-hp-cream/40 border border-hp-light/80 rounded-sm">
                  <p className="text-[11px] tracking-[0.1em] uppercase font-semibold text-hp-black mb-3 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-hp-blue" /> Key Highlights
                  </p>
                  <ul className="space-y-2">
                    {product.highlights.map((hl, idx) => (
                      <li key={idx} className="flex items-start gap-2 text.xs text-hp-gray font-light leading-snug">
                        <CheckCircle2 size={13} className="text-hp-blue flex-shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="divider mb-6" />

              {/* Color selector */}
              {product.colors.length > 1 && (
                <div className="mb-6">
                  <p className="text-[11px] tracking-[0.1em] uppercase font-medium text-hp-black mb-3">
                    Color — <span className="font-light text-hp-gray">{product.colors[activeColor]?.name}</span>
                  </p>
                  <div className="flex gap-3">
                    {product.colors.map((color, i) => (
                      <button
                        key={color.name}
                        onClick={() => setActiveColor(i)}
                        title={color.name}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all duration-200",
                          activeColor === i ? "border-hp-black scale-110" : "border-transparent hover:border-hp-gray"
                        )}
                        style={{ background: color.hex }}
                        aria-label={`Select ${color.name} color`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Config selector */}
              {product.configs.length > 1 && (
                <div className="mb-8">
                  <p className="text-[11px] tracking-[0.1em] uppercase font-medium text-hp-black mb-3">Configuration</p>
                  <div className="flex flex-wrap gap-2">
                    {product.configs.map((cfg, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveConfig(i)}
                        className={cn(
                          "px-4 py-2 text-[11px] tracking-[0.05em] border transition-all duration-200",
                          activeConfig === i
                            ? "bg-hp-black text-white border-hp-black"
                            : "bg-white text-hp-gray border-hp-light hover:border-hp-gray"
                        )}
                      >
                        {cfg.ram} / {cfg.storage}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Enquire */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setEnquiryOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 text-[11px] tracking-[0.15em]
                             uppercase font-medium py-3.5 transition-all duration-300 bg-hp-blue text-white hover:bg-hp-blueDark"
                >
                  <MessageSquare size={14} strokeWidth={1.5} />
                  Enquire Now
                </button>
              </div>

              <button className="w-full flex items-center justify-center gap-2 btn-ghost">
                <Heart size={14} strokeWidth={1.5} /> Add to Wishlist
              </button>
            </div>
          </div>

          {/* Redesigned Specifications & Information Section */}
          <div className="mt-20 border-t border-hp-light pt-12">
            <div className="flex items-end justify-between border-b border-hp-light mb-8 flex-wrap gap-4">
              <div className="flex gap-6">
                {(["specs", "details", "warranty", "highlights", "inbox", "docs"] as const).map((tab) => {
                  if (tab === "docs" && (!product.documents || product.documents.length === 0)) return null;
                  if (tab === "highlights" && (!product.highlights || product.highlights.length === 0)) return null;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "pb-3 -mb-px text-[11px] tracking-[0.1em] uppercase font-semibold transition-colors duration-200 border-b-2",
                        activeTab === tab
                          ? "text-hp-black border-hp-black"
                          : "text-hp-gray border-transparent hover:text-hp-black"
                      )}
                    >
                      {tab === "specs"
                        ? "Specifications"
                        : tab === "details"
                          ? "Details"
                          : tab === "warranty"
                            ? "Warranty"
                            : tab === "highlights"
                              ? "Features & Overview"
                              : tab === "inbox"
                                ? "In the Box"
                                : "Documents"}
                    </button>
                  );
                })}
              </div>

              {/* Spec search input when on specs tab */}
              {activeTab === "specs" && product.specs.length > 5 && (
                <div className="relative min-w-[240px] mb-3">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-hp-gray" />
                  <input
                    type="text"
                    value={specQuery}
                    onChange={(e) => setSpecQuery(e.target.value)}
                    placeholder="Search specifications..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-hp-cream/30 border border-hp-light focus:outline-none focus:border-hp-blue rounded-sm"
                  />
                </div>
              )}
            </div>

            {/* TAB CONTENT: Specifications */}
            {activeTab === "specs" && (
              <div className="max-w-3xl space-y-6">
                {groupedSpecs.size === 0 ? (
                  <p className="text-sm text-hp-gray font-light py-8 text-center">No specifications match "{specQuery}".</p>
                ) : (
                  Array.from(groupedSpecs.entries()).map(([groupTitle, specs]) => (
                    <div key={groupTitle}>
                      {groupedSpecs.size > 1 && (
                        <h4 className="text-[10px] tracking-[0.15em] uppercase text-hp-gray/60 font-semibold mb-2">
                          {groupTitle}
                        </h4>
                      )}
                      <div className="space-y-1.5">
                        {specs.map(({ label, value }, idx) => (
                          <p key={`${label}-${idx}`} className="text-sm leading-relaxed">
                            <span className="font-semibold text-hp-black">{label}</span>
                            <span className="text-hp-black">: </span>
                            <span className="font-light text-hp-gray">{value}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB CONTENT: Details */}
            {activeTab === "details" && (
              <div className="max-w-3xl space-y-6">
                <div className="space-y-1.5">
                  {[
                    { label: "Brand", value: "HP" },
                    { label: "Series", value: product.series },
                    { label: "Category", value: product.category },
                    { label: "Product Number", value: product.productNumber },
                    { label: "Status", value: product.plcStatus },
                  ]
                    .filter((row) => row.value)
                    .map((row) => (
                      <p key={row.label} className="text-sm leading-relaxed">
                        <span className="font-semibold text-hp-black">{row.label}</span>
                        <span className="text-hp-black">: </span>
                        <span className="font-light text-hp-gray capitalize">{row.value}</span>
                      </p>
                    ))}
                </div>

                {product.description && (
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold text-hp-black">Description</span>
                    <span className="text-hp-black">: </span>
                    <span className="font-light text-hp-gray">{product.description}</span>
                  </p>
                )}
              </div>
            )}

            {/* TAB CONTENT: Warranty */}
            {activeTab === "warranty" && (
              <div className="max-w-3xl">
                {warrantySpecs.length > 0 ? (
                  <div className="space-y-1.5">
                    {warrantySpecs.map(({ label, value }, idx) => (
                      <p key={`${label}-${idx}`} className="text-sm leading-relaxed">
                        <span className="font-semibold text-hp-black">{label}</span>
                        <span className="text-hp-black">: </span>
                        <span className="font-light text-hp-gray">{value}</span>
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-light text-hp-gray leading-relaxed">
                    Standard HP manufacturer warranty applies to this product.{" "}
                    <button onClick={() => setEnquiryOpen(true)} className="text-hp-blue underline font-medium">
                      Contact us
                    </button>{" "}
                    for extended warranty and AMC options.
                  </p>
                )}
              </div>
            )}

            {/* TAB CONTENT: Highlights & Features */}
            {activeTab === "highlights" && (
              <div className="max-w-3xl space-y-6">
                <h3 className="font-serif text-2xl font-light text-hp-black">Key Selling Points</h3>
                {product.highlights && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.highlights.map((item, i) => (
                      <div key={i} className="p-5 border border-hp-light bg-hp-cream/30 rounded-sm flex items-start gap-3">
                        <Sparkles size={16} className="text-hp-blue flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-light text-hp-black leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                )}

                {product.description && (
                  <div className="mt-8 pt-8 border-t border-hp-light">
                    <h4 className="text-xs uppercase tracking-widest text-hp-gray font-semibold mb-3">Product Overview</h4>
                    <p className="text-sm font-light text-hp-gray leading-relaxed">{product.description}</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: In the Box */}
            {activeTab === "inbox" && (
              <div className="max-w-xl p-6 border border-hp-light bg-hp-cream/30 rounded-sm">
                <h3 className="text-xs tracking-[0.1em] uppercase font-semibold text-hp-black mb-4 flex items-center gap-2">
                  <Info size={14} className="text-hp-blue" /> Included in Package
                </h3>
                {product.inBox.length > 0 ? (
                  <ul className="space-y-3">
                    {product.inBox.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-light text-hp-gray">
                        <span className="w-1.5 h-1.5 bg-hp-blue rounded-full flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-hp-gray font-light">Standard retail packaging includes main device, power adapter, and quick setup guide.</p>
                )}
              </div>
            )}

            {/* TAB CONTENT: Documents */}
            {activeTab === "docs" && product.documents && (
              <div className="max-w-xl space-y-3">
                {product.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-hp-light bg-white rounded-sm">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-hp-blue" />
                      <div>
                        <p className="text-sm font-medium text-hp-black">{doc.title || "Product Datasheet"}</p>
                        <p className="text-[10px] text-hp-gray uppercase tracking-wider">{doc.type || doc.format || "PDF"}</p>
                      </div>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-hp-blue hover:text-hp-blueDark font-medium underline flex items-center gap-1"
                    >
                      Download <ChevronRight size={12} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-20 pt-12 border-t border-hp-light">
              <h3 className="font-serif text-3xl font-light mb-8">You May Also Like</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {related.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        productLabel={`${product.name}${product.productNumber ? ` (${product.productNumber})` : ""}`}
        defaultMessage={`I'm interested in the ${product.name}${
          product.productNumber ? ` (SKU: ${product.productNumber})` : ""
        }${
          product.configs.length > 1
            ? `, ${product.configs[activeConfig]?.ram} / ${product.configs[activeConfig]?.storage} configuration`
            : ""
        }. Please share more details and pricing.`}
      />
    </main>
  );
}
