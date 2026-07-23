import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchCatalogProducts, fetchProductByNumber } from "@/lib/hp-api";
import ProductPageClient from "./ProductPageClient";
import type { Product } from "@/lib/products";

interface Props {
  params: Promise<{ slug: string }>;
}

// Memoized per-request so generateMetadata and the page component share one fetch.
const getCatalog = cache(() => fetchCatalogProducts({ pageSize: 1000 }));

/** Resolve a product from a URL slug.
 *  1. Match against the live HP catalog by slug.
 *  2. If not found but slug looks like an HP product number, hit the HP API directly.
 *  3. Returns null if nothing matches.
 */
async function resolveProduct(
  slug: string
): Promise<{ product: Product | null; catalog: Product[] }> {
  const { products: catalog } = await getCatalog();

  const bySlug = catalog.find(
    (p) => p.slug === slug || p.id.toLowerCase() === slug.toLowerCase() || p.productNumber?.toLowerCase() === slug.toLowerCase()
  ) ?? null;

  // Extract dynamic SKU from matched product or from slug
  const rawSku =
    bySlug?.productNumber ||
    bySlug?.id ||
    (slug.length >= 5 ? slug.toUpperCase().replace(/-([a-z0-9]{3})$/i, "#$1") : null);

  if (rawSku) {
    const detailedProduct = await fetchProductByNumber(rawSku);
    if (detailedProduct) {
      return { product: detailedProduct, catalog };
    }
  }

  if (bySlug) return { product: bySlug, catalog };

  return { product: null, catalog };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await resolveProduct(slug);

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} — ${product.series}`,
    description: product.description,
    openGraph: {
      title: `${product.name} | DSK`,
      description: product.description,
      type: "website",
      url: `https://dsk-hp-store.vercel.app/product/${slug}`,
      images: [
        {
          url: product.images[0] || "/og-product.jpg",
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [product.images[0] || "/og-product.jpg"],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const { product, catalog } = await resolveProduct(slug);
  if (!product) notFound();

  const related = catalog.filter((p) => p.id !== product.id).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    brand: { "@type": "Brand", name: "HP" },
    offers: {
      "@type": "Offer",
      url: `https://dsk-hp-store.vercel.app/product/${slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <ProductPageClient product={product} related={related} />
      <Footer />
    </>
  );
}