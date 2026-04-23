import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrustBar from "@/components/sections/TrustBar";
import ProductCard from "@/components/product/ProductCard";
import HeroSection from "@/components/sections/HeroSection";
import PartnerMarquee from "@/components/sections/PartnerMarquee";
import EditorialBanner from "@/components/sections/EditorialBanner";
import Counter from "@/components/ui/Counter";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "DSK — Premium Technology",
  description: "Discover HP's finest laptops and technology. Engineered for the extraordinary.",
};

const FEATURED = PRODUCTS.slice(0, 3);

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero */}
        <HeroSection />

        {/* Trust bar */}
        <TrustBar />

        {/* Partner Logos Marquee */}
        <PartnerMarquee />

        {/* Featured Products */}
        <section className="section-pad py-20 md:py-28">
          <div className="max-content">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="eyebrow">— Featured —</span>
                <h2 className="section-title">Curated for Performance</h2>
              </div>
              <Link
                href="/collections"
                className="hidden md:flex items-center gap-2 text-[11px] tracking-[0.15em]
                           uppercase text-hp-black border-b border-hp-black pb-0.5
                           hover:text-hp-blue hover:border-hp-blue transition-colors duration-200"
              >
                View All <ArrowRight size={12} strokeWidth={2} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {FEATURED.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link href="/collections" className="btn-ghost inline-block">
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* Editorial Banner */}
        <EditorialBanner />

        {/* More Products */}
        <section className="section-pad py-20 md:py-28 bg-hp-cream">
          <div className="max-content">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="eyebrow">— New Arrivals —</span>
                <h2 className="section-title">Just In</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {PRODUCTS.slice(3, 6).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="section-pad py-16 md:py-20 bg-hp-black text-hp-white">
          <div className="max-content">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { to: 20, suffix: "+", label: "States" },
                { to: 100, suffix: "K+", label: "Customers" },
                { to: 10, suffix: "+", label: "Years of Innovation" },
                { to: 1, prefix: "#", label: "Business Laptops" },
              ].map(({ label, ...counterProps }) => (
                <div key={label}>
                  <div className="font-serif text-5xl md:text-6xl font-light text-hp-white mb-2">
                    <Counter {...counterProps} />
                  </div>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-hp-white/40 font-light">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
