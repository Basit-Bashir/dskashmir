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
import HPBannersSection from "@/components/sections/HPBannersSection";
import StoreLocation from "@/components/sections/StoreLocation";
import { fetchCatalogProducts, fetchProductByNumber } from "@/lib/hp-api";
import { seededShuffle } from "@/lib/utils";

export const metadata: Metadata = {
  title: "DSK — Premium Technology",
  description: "Discover HP's finest laptops and technology. Engineered for the extraordinary.",
};

export default async function HomePage() {
  const [{ products }, heroPrinter, laptopProductD8PZ9PA] = await Promise.all([
    fetchCatalogProducts({ pageSize: 48 }),
    fetchProductByNumber("3SJ03A").catch(() => null),
    fetchProductByNumber("D8PZ9PA").catch(() => null),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const shuffled = seededShuffle(products, today);
  const BEST_SELLERS = shuffled.slice(0, 6);
  const NEW_ARRIVALS = shuffled.slice(6, 14);

  const laptopImage =
    laptopProductD8PZ9PA?.images?.[0] ||
    "https://hp.widen.net/content/9iqnhnbc9a/png/9iqnhnbc9a.png?w=1659&h=1246&dpi=72&color=ffffff00";

  const printerProduct =
    heroPrinter ??
    products.find((p) => p.category === "printer" && p.images?.length > 0);

  return (
    <>
      <Navbar />

      <main>
        {/* Hero featuring SKU 3SJ03A Printer Carousel */}
        <HeroSection heroPrinter={heroPrinter} />

        {/* Trust bar */}
        <TrustBar />

        {/* New Arrivals — horizontal rail */}
        <NewArrivalsRail products={NEW_ARRIVALS} />

        {/* Category tiles */}
        <CategoryTiles
          laptopImage={laptopImage}
          printerImage={printerProduct?.images[0]}
        />

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

        {/* Official HP Campaign Banners */}
        <HPBannersSection />

        {/* Editorial Banner */}
        <EditorialBanner />

        {/* Store Location */}
        <StoreLocation />
      </main>

      <Footer />
    </>
  );
}
