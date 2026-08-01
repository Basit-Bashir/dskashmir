"use client";

import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/products";

interface Props {
  products: Product[];
}

export default function NewArrivalsRail({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="bg-hp-cream py-12 md:py-16">
      <div className="max-content section-pad">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-medium tracking-tight text-hp-black">
            New Arrivals
          </h2>
          <div className="hidden sm:flex gap-2.5">
            <Link href="/collections" className="btn-pill-outline">
              Shop Laptops
            </Link>
            <Link href="/collections" className="btn-pill-outline">
              Shop Printers
            </Link>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory">
          {products.map((product, i) => (
            <div key={product.id} className="min-w-[248px] w-[248px] flex-shrink-0 snap-start">
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
