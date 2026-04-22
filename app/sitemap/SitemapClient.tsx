"use client";

import LegalLayout from "@/components/layout/LegalLayout";
import Link from "next/link";
import { PRODUCTS, Product } from "@/lib/products";

const STATIC_PAGES = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "About DSK", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Your Cart", href: "/cart" },
];

const LEGAL_PAGES = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Cookie Settings", href: "/cookie-settings" },
  { label: "Shipping & Returns", href: "/shipping" },
  { label: "Warranty Information", href: "/warranty" },
];

const CATEGORIES = [
  { label: "Ultrabooks", slug: "ultrabook" },
  { label: "Business", slug: "business" },
  { label: "Creator", slug: "creator" },
  { label: "Gaming", slug: "gaming" },
  { label: "Printers", slug: "printer" },
  { label: "Copiers", slug: "copier" },
  { label: "Accessories", slug: "accessory" },
];

export default function SitemapClient() {
  return (
    <LegalLayout title="Sitemap">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
        
        {/* Main Navigation */}
        <section>
          <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-hp-black mb-8 border-b border-hp-light pb-4">
            Main Navigation
          </h2>
          <ul className="space-y-4">
            {STATIC_PAGES.map((page) => (
              <li key={page.href}>
                <Link 
                  href={page.href}
                  className="text-sm font-light text-hp-gray hover:text-hp-blue transition-colors"
                >
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Collections */}
        <section>
          <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-hp-black mb-8 border-b border-hp-light pb-4">
            Collections
          </h2>
          <ul className="space-y-4">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link 
                  href={`/collections?cat=${cat.slug}`}
                  className="text-sm font-light text-hp-gray hover:text-hp-blue transition-colors"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Legal & Support */}
        <section>
          <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-hp-black mb-8 border-b border-hp-light pb-4">
            Legal & Support
          </h2>
          <ul className="space-y-4">
            {LEGAL_PAGES.map((page) => (
              <li key={page.href}>
                <Link 
                  href={page.href}
                  className="text-sm font-light text-hp-gray hover:text-hp-blue transition-colors"
                >
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Products (Dynamic) */}
        <section className="md:col-span-2 lg:col-span-3">
          <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-hp-black mb-8 border-b border-hp-light pb-4">
            Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
            {PRODUCTS.map((product) => (
              <div key={product.id}>
                <Link 
                  href={`/product/${product.slug}`}
                  className="text-sm font-light text-hp-gray hover:text-hp-blue transition-colors"
                >
                  {product.name}
                </Link>
                <span className="text-[9px] text-hp-gray/40 uppercase tracking-widest ml-2">
                  {product.category}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </LegalLayout>
  );
}
