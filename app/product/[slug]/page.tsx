import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchCatalogSummary, fetchProductByNumber } from "@/lib/hp-api";
import ProductPageClient from "./ProductPageClient";
import type { Product } from "@/lib/products";

interface Props {
  params: Promise<{ slug: string }>;
}

// Lightweight catalog lookup memoized per request
const getCatalogSummary = cache(() => fetchCatalogSummary({ pageSize: 1000 }));

/** Memoized product resolver so generateMetadata and ProductPage share work */
const resolveProduct = cache(async (slug: string): Promise<{ product: Product | null; related: Product[] }> => {
  const { products: catalog } = await getCatalogSummary();

  const bySlug = catalog.find(
    (p) => p.slug === slug || p.id.toLowerCase() === slug.toLowerCase() || p.productNumber?.toLowerCase() === slug.toLowerCase()
  ) ?? null;

  // Extract dynamic SKU from matched product or from slug
  const rawSku =
    bySlug?.productNumber ||
    bySlug?.id ||
    (slug.length >= 5 ? slug.toUpperCase().replace(/-([a-z0-9]{3})$/i, "#$1") : null);

  let product: Product | null = null;
  if (rawSku) {
    product = await fetchProductByNumber(rawSku);
  }

  if (!product && bySlug) {
    product = bySlug;
  }

  const related = catalog.filter((p) => p.id !== (product?.id || bySlug?.id)).slice(0, 4);

  return { product, related };
});

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
  const { product, related } = await resolveProduct(slug);
  if (!product) notFound();

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