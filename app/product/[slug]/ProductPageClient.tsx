"use client";

import { useState } from "react";
import { Heart, ShoppingBag, Star, Shield, Truck, RotateCcw } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/lib/products";
import { formatPrice, BADGE_STYLES, cn } from "@/lib/utils";
import { useCart } from "@/lib/context/CartContext";

interface ProductPageClientProps {
  product: Product;
  related: Product[];
}

export default function ProductPageClient({ product, related }: ProductPageClientProps) {
  const { addItem } = useCart();

  const [activeImg,    setActiveImg]    = useState(0);
  const [activeColor,  setActiveColor]  = useState(0);
  const [activeConfig, setActiveConfig] = useState(0);
  const [activeTab,    setActiveTab]    = useState<"specs" | "inbox" | "reviews">("specs");
  const [qty,          setQty]          = useState(1);
  const [added,        setAdded]        = useState(false);

  const currentPrice = product.configs[activeConfig]?.price ?? product.price;

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      series: product.series,
      config: `${product.configs[activeConfig].ram} / ${product.configs[activeConfig].storage} / ${product.colors[activeColor].name}`,
      price: currentPrice,
      qty: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="pt-20">
      {/* Breadcrumb */}
      <nav className="section-pad py-4 border-b border-hp-light" aria-label="Breadcrumb">
        <div className="max-content">
          <div className="flex items-center gap-2 text-[11px] text-hp-gray font-light">
            <Link href="/" className="hover:text-hp-blue transition-colors">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-hp-blue transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-hp-black" aria-current="page">{product.name}</span>
          </div>
        </div>
      </nav>

      {/* PDP Grid */}
      <div className="section-pad py-10 md:py-16">
        <div className="max-content">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10 xl:gap-16">

            {/* LEFT — Images */}
            <div>
              <div className="flex gap-4">
                {/* Thumbnails */}
                <div className="hidden md:flex flex-col gap-3 w-16 flex-shrink-0">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={cn(
                        "w-16 h-16 bg-hp-cream border transition-all duration-200",
                        activeImg === i
                          ? "border-hp-blue"
                          : "border-hp-light hover:border-hp-gray"
                      )}
                      aria-label={`View image ${i + 1}`}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[9px] text-hp-gray/50">{i + 1}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Main image */}
                <motion.div
                  key={activeImg}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 aspect-[4/3] bg-hp-cream relative overflow-hidden
                             cursor-zoom-in group"
                >
                  {product.badge && (
                    <span className={cn(
                      "absolute top-4 left-4 text-[9px] tracking-[0.15em] uppercase font-medium px-2.5 py-1 z-10",
                      BADGE_STYLES[product.badge]
                    )}>
                      {product.badge}
                    </span>
                  )}
                  <div className="w-full h-full flex items-center justify-center
                                  bg-gradient-to-br from-hp-cream to-hp-light
                                  group-hover:scale-[1.02] transition-transform duration-700">
                    <div className="text-center">
                      <p className="font-serif text-4xl font-light text-hp-gray/30">
                        {product.name}
                      </p>
                      <p className="text-[10px] tracking-widest uppercase text-hp-gray/20 mt-2">
                        {product.series}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* RIGHT — Info */}
            <div>
              <p className="eyebrow">{product.series}</p>
              <h1 className="font-serif text-4xl md:text-5xl font-light text-hp-black mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-0.5" aria-label={`${product.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      strokeWidth={0}
                      fill={i < Math.floor(product.rating) ? "#C8A96E" : "#E8E5DF"}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-hp-black">{product.rating}</span>
                <span className="text-sm text-hp-gray font-light">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-serif text-4xl font-medium text-hp-black">
                  {formatPrice(currentPrice)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-hp-gray/50 line-through font-light">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-sm font-light leading-relaxed text-hp-gray mb-8 max-w-[380px]">
                {product.description}
              </p>

              <div className="divider mb-8" />

              {/* Color selector */}
              {product.colors.length > 1 && (
                <div className="mb-6">
                  <p className="text-[11px] tracking-[0.1em] uppercase font-medium text-hp-black mb-3">
                    Color — <span className="font-light text-hp-gray">{product.colors[activeColor].name}</span>
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
              <div className="mb-8">
                <p className="text-[11px] tracking-[0.1em] uppercase font-medium text-hp-black mb-3">
                  Configuration
                </p>
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

              {/* Qty + Add to Cart */}
              <div className="flex gap-3 mb-4">
                <div className="flex items-center border border-hp-light">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-12 text-hp-gray hover:text-hp-black transition-colors
                               border-r border-hp-light"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-medium">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-12 text-hp-gray hover:text-hp-black transition-colors
                               border-l border-hp-light"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAdd}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 text-[11px] tracking-[0.15em]",
                    "uppercase font-medium py-3.5 transition-all duration-300",
                    added
                      ? "bg-green-600 text-white"
                      : "bg-hp-blue text-white hover:bg-hp-blueDark"
                  )}
                >
                  <ShoppingBag size={14} strokeWidth={1.5} />
                  {added ? "Added to Cart!" : "Add to Cart"}
                </button>
              </div>

              <button className="w-full flex items-center justify-center gap-2 btn-ghost">
                <Heart size={14} strokeWidth={1.5} /> Add to Wishlist
              </button>

              {/* Trust row */}
              <div className="flex items-center gap-6 mt-8 pt-8 border-t border-hp-light">
                {[
                  { icon: Shield, text: "2-yr warranty" },
                  { icon: Truck,  text: "Free shipping" },
                  { icon: RotateCcw, text: "30-day returns" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <Icon size={14} strokeWidth={1.5} className="text-hp-blue" />
                    <span className="text-[11px] text-hp-gray font-light">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16 border-t border-hp-light">
            <div className="flex gap-0 border-b border-hp-light">
              {(["specs", "inbox", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-8 py-4 text-[11px] tracking-[0.12em] uppercase font-medium",
                    "transition-all duration-200 border-b-2",
                    activeTab === tab
                      ? "border-hp-blue text-hp-blue"
                      : "border-transparent text-hp-gray hover:text-hp-black"
                  )}
                >
                  {tab === "inbox" ? "In the Box" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="py-8 md:py-12 max-w-2xl">
              {activeTab === "specs" && (
                <table className="w-full">
                  <caption className="sr-only">Product Specifications</caption>
                  <tbody>
                    {product.specs.map(({ label, value }) => (
                      <tr key={label} className="border-b border-hp-light last:border-0">
                        <th scope="row" className="py-3.5 text-sm font-medium text-hp-black w-40 pr-8 text-left">{label}</th>
                        <td className="py-3.5 text-sm font-light text-hp-gray">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {activeTab === "inbox" && (
                <ul className="space-y-3">
                  {product.inBox.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-light text-hp-gray">
                      <span className="w-1.5 h-1.5 bg-hp-blue rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === "reviews" && (
                <div className="text-center py-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={20} fill={i < Math.floor(product.rating) ? "#C8A96E" : "#E8E5DF"} strokeWidth={0} />
                    ))}
                  </div>
                  <p className="font-serif text-5xl font-light text-hp-black mb-1">
                    {product.rating}
                  </p>
                  <p className="text-sm text-hp-gray font-light">
                    Based on {product.reviewCount} reviews
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-6 pt-12 border-t border-hp-light">
            <h3 className="font-serif text-3xl font-light mb-8">You May Also Like</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
