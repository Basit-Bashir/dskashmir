import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PRODUCTS, getProductBySlug } from "@/lib/products";
import { fetchProductByNumber } from "@/lib/hp-api";
import ProductPageClient from "./ProductPageClient";
import type { Product } from "@/lib/products";

interface Props {
  params: Promise<{ slug: string }>;
}

/** Resolve a product from a URL slug.
 *  1. Check static catalogue by slug.
 *  2. If not found but slug looks like an HP product number, hit the HP API.
 *  3. Returns null if nothing matches.
 */
async function resolveProduct(slug: string): Promise<Product | null> {
  const staticProduct = getProductBySlug(slug);
  if (staticProduct) return staticProduct;

  // HP product numbers are alphanumeric, often with dashes from URL encoding.
  // Reconstruct the product number (e.g. "8ul47av-aba" → "8UL47AV#ABA")
  const isHPNumber = /^[a-z0-9]+-[a-z0-9]+$/i.test(slug);
  if (isHPNumber) {
    const productNumber = slug.toUpperCase().replace(/-([a-z0-9]{3})$/i, "#$1");
    const apiProduct = await fetchProductByNumber(productNumber);
    if (apiProduct) return apiProduct;
  }

  return null;
}

/** For known-HP-number products: enrich static product with live images/content */
async function enrichStaticProduct(product: Product): Promise<Product> {
  if (!product.productNumber) return product;

  const enriched = await fetchProductByNumber(product.productNumber);
  if (!enriched) return product;

  return {
    ...product,
    // Prefer live description & specs if richer than static
    description: enriched.description || product.description,
    specs: enriched.specs.length > 0 ? enriched.specs : product.specs,
    images:
      enriched.images.length > 0 ? enriched.images : product.images,
    tagline: enriched.tagline || product.tagline,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await resolveProduct(slug);

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
  const baseProduct = await resolveProduct(slug);
  if (!baseProduct) notFound();

  const product = await enrichStaticProduct(baseProduct);

  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

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