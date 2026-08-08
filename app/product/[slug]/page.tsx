import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchCatalogSummary, fetchProductByNumber } from "@/lib/hp-api";
import { extractSkuFromSlug } from "@/lib/hp-mapping";
import ProductPageClient from "./ProductPageClient";
import type { Product } from "@/lib/products";

interface Props {
  params: Promise<{ slug: string }>;
}

// Small, cross-category sample used only for "related products" and as a
// last-resort slug lookup — the fast path below resolves the SKU straight
// from the slug and never needs to scan the catalog.
const getCatalogSummary = cache(() =>
  fetchCatalogSummary({ pageSize: 12, includeImages: false })
);

/** Memoized product resolver so generateMetadata and ProductPage share work */
const resolveProduct = cache(async (slug: string): Promise<{ product: Product | null; related: Product[] }> => {
  const cleanSlug = decodeURIComponent(slug).trim();

  const candidateSkus: string[] = [];
  const embeddedSku = extractSkuFromSlug(cleanSlug);
  if (embeddedSku) {
    candidateSkus.push(embeddedSku);
  } else if (cleanSlug.length >= 3 && !cleanSlug.includes("-")) {
    candidateSkus.push(cleanSlug.toUpperCase());
  }


  // Kick off the catalog sample immediately, in parallel with SKU resolution
  // below — it's needed for "related products" either way, and as a
  // last-resort slug lookup, so there's no reason to wait on it sequentially.
  const samplePromise = getCatalogSummary();

  // was:
  // let product: Product | null = null;
  // for (const skuToTry of candidateSkus) {
  //   if (skuToTry.length < 3) continue;
  //   product = await fetchProductByNumber(skuToTry);
  //   if (product) break;
  // }

  const validCandidates = candidateSkus.filter((s) => s.length >= 3);
  const results = await Promise.all(
    validCandidates.map((sku) => fetchProductByNumber(sku).catch(() => null))
  );
  let product: Product | null = results.find((p): p is Product => Boolean(p)) ?? null;

  const { products: sample } = await samplePromise;

  // Last resort: scan the (small) catalog sample for a matching slug/id.
  if (!product) {
    const bySlug = sample.find(
      (p) =>
        p.slug.toLowerCase() === cleanSlug.toLowerCase() ||
        p.id.toLowerCase() === cleanSlug.toLowerCase() ||
        p.productNumber?.toLowerCase() === cleanSlug.toLowerCase()
    );
    if (bySlug?.productNumber) {
      product = await fetchProductByNumber(bySlug.productNumber);
    }
    if (!product && bySlug) {
      product = bySlug;
    }
  }

  if (!product) {
    return { product: null, related: sample.slice(0, 4) };
  }

  const sameCategory = sample.filter((p) => p.id !== product!.id && p.category === product!.category);
  const related = (sameCategory.length >= 4 ? sameCategory : sample.filter((p) => p.id !== product!.id)).slice(0, 4);

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
export const revalidate = 86400;      // 24h ISR
export const dynamicParams = true;    // allow SKUs not pre-built