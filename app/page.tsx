import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrustBar from "@/components/sections/TrustBar";
import ProductCard from "@/components/product/ProductCard";
import HeroSection from "@/components/sections/HeroSection";
import NewArrivalsRail from "@/components/sections/NewArrivalsRail";
import CategoryTiles from "@/components/sections/CategoryTiles";
import EditorialBanner from "@/components/sections/EditorialBanner";
import StoreLocation from "@/components/sections/StoreLocation";
import { fetchCatalogProducts } from "@/lib/hp-api";

export const metadata: Metadata = {
  title: "DSK — Premium Technology",
  description: "Discover HP's finest laptops and technology. Engineered for the extraordinary.",
};

export default async function HomePage() {
  const { products } = await fetchCatalogProducts({ pageSize: 6 });
  const BEST_SELLERS = products.slice(0, 3);
  const NEW_ARRIVALS = products.slice(3, 6);
  // Prefer a laptop for the hero visual (matches the "Shop Laptops" CTA);
  // fall back to whichever product has an image.
  const heroProduct =
    products.find((p) => p.category === "ultrabook" && p.images.length > 0) ??
    products.find((p) => p.images.length > 0);

  return (
    <>
      <Navbar />

      <main>
        {/* Hero */}
        <HeroSection heroImage={heroProduct?.images[0]} heroName={heroProduct?.name} />

        {/* Trust bar */}
        <TrustBar />

        {/* New Arrivals — horizontal rail */}
        <NewArrivalsRail products={NEW_ARRIVALS} />

        {/* Category tiles */}
        <CategoryTiles />

        {/* Best Sellers */}
        <section className="section-pad py-14 md:py-16">
          <div className="max-content">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-medium tracking-tight text-hp-black">
                Best Sellers
              </h2>
              <Link
                href="/collections"
                className="hidden sm:inline-flex btn-pill-outline"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {BEST_SELLERS.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/collections" className="btn-pill-outline inline-block">
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* Editorial Banner */}
        <EditorialBanner />

        {/* Store Location */}
        <StoreLocation />
      </main>

      <Footer />
    </>
  );
}
