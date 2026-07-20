/**
 * Client-side HP catalog fetcher. Calls the /api/hp/* proxy routes and maps
 * the response into the app's Product shape — the browser equivalent of
 * fetchCatalogProducts() in lib/hp-api.ts (which is server-only).
 */

import type { Product } from "./products";
import { catalogsForCategory } from "./hp-catalogs";

const COUNTRY_CODE = "IN";
const LANGUAGE_CODE = "EN";
const REQUESTOR = "DSKASHMIR-PRO";
const USD_TO_INR = 84;

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapCategory(cat?: string): Product["category"] {
  const c = (cat || "").toLowerCase();
  if (c.includes("gaming") || c.includes("omen")) return "gaming";
  if (c.includes("elite") || c.includes("probook") || c.includes("business"))
    return "business";
  if (c.includes("creator") || c.includes("envy") || c.includes("zbook"))
    return "creator";
  if (c.includes("laser") || c.includes("smart tank") || c.includes("officejet"))
    return "printer";
  if (c.includes("copier") || c.includes("mfp") || c.includes("pagewide"))
    return "copier";
  if (c.includes("dock") || c.includes("mouse") || c.includes("keyboard") || c.includes("accessory"))
    return "accessory";
  if (c.includes("desktop") || c.includes("all-in-one") || c.includes("tower"))
    return "desktop";
  return "ultrabook";
}

interface RawCatalogItem {
  productNumber: string;
  shortName?: string;
  longName?: string;
  productLine?: string;
  category?: string;
  price?: { unitPrice?: number; listPrice?: number };
}

interface RawContent {
  productNumber: string;
  name?: string;
  shortDescription?: string;
  longDescription?: string;
  specifications?: { name: string; value: string }[];
  productLine?: string;
}

interface RawImage {
  url: string;
  type: string;
}

/**
 * Fetches one page from a single HP catalog (e.g. "Laptops" or "Printers"),
 * enriched with content + images. See fetchCatalogProductsClient below for
 * the category-aware, multi-catalog entry point.
 */
async function fetchFromCatalog(
  catalogName: string,
  opts: { category?: string; pageNumber: number; pageSize: number }
): Promise<{ products: Product[]; total: number }> {
  const hasCategory = !!opts.category && opts.category !== "all";
  const endpoint = hasCategory ? "itemsbyfacetvalues" : "catalogitems";

  const res = await fetch(`/api/hp/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      catalogName,
      countryCode: COUNTRY_CODE,
      languageCode: LANGUAGE_CODE,
      outputHierarchyLevel: "Product",
      pageNumber: opts.pageNumber,
      pageSize: opts.pageSize,
      requestor: REQUESTOR,
      ...(hasCategory ? { facetValues: [`category:${opts.category}`] } : {}),
    }),
  });

  if (!res.ok) return { products: [], total: 0 };

  const data = await res.json();
  const items: RawCatalogItem[] = data.items ?? [];
  if (!items.length) return { products: [], total: 0 };

  const productNumbers = items.map((i) => i.productNumber);

  const [contentRes, imagesRes] = await Promise.allSettled([
    fetch("/api/hp/productcontent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productNumbers,
        countryCode: COUNTRY_CODE,
        languageCode: LANGUAGE_CODE,
        requestor: REQUESTOR,
      }),
    }).then((r) => r.json()),
    fetch("/api/hp/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productNumbers,
        countryCode: COUNTRY_CODE,
        languageCode: LANGUAGE_CODE,
        requestor: REQUESTOR,
      }),
    }).then((r) => r.json()),
  ]);

  const contentMap = new Map<string, RawContent>(
    contentRes.status === "fulfilled"
      ? (contentRes.value.products ?? []).map((p: RawContent) => [p.productNumber, p])
      : []
  );

  const imagesMap = new Map<string, RawImage[]>(
    imagesRes.status === "fulfilled"
      ? (imagesRes.value.products ?? []).map((p: { productNumber: string; images: RawImage[] }) => [
          p.productNumber,
          p.images,
        ])
      : []
  );

  const products: Product[] = items.map((item) => {
    const content = contentMap.get(item.productNumber);
    const imgs = imagesMap.get(item.productNumber) ?? [];

    const name = content?.name || item.longName || item.shortName || item.productNumber;
    const price = Math.round((item.price?.unitPrice ?? 0) * USD_TO_INR);

    return {
      id: item.productNumber,
      slug: slugify(name) || item.productNumber.replace(/[^a-z0-9]/gi, "-").toLowerCase(),
      productNumber: item.productNumber,
      name,
      series: content?.productLine || item.productLine || "HP",
      tagline: content?.shortDescription ?? "",
      description: content?.longDescription ?? content?.shortDescription ?? "",
      price,
      category: mapCategory(item.category || content?.productLine),
      colors: [{ name: "Default", hex: "#1a1a2e" }],
      configs: [{ ram: "—", storage: "—", price }],
      specs: content?.specifications?.map((s) => ({ label: s.name, value: s.value })) ?? [],
      images: imgs.map((img) => img.url),
      rating: 4.5,
      reviewCount: 0,
      inBox: [],
    } satisfies Product;
  });

  return { products, total: data.totalResults ?? products.length };
}

/**
 * Category-aware entry point. Maps the site's internal category key to the
 * HP catalog(s) that back it (catalogsForCategory) and merges results when
 * more than one catalog applies (e.g. the "all" pill). Pass `catalogName`
 * to bypass the mapping and hit one catalog directly.
 */
export async function fetchCatalogProductsClient(opts: {
  category?: string;
  catalogName?: string;
  pageNumber?: number;
  pageSize?: number;
} = {}): Promise<{ products: Product[]; total: number }> {
  const catalogNames = opts.catalogName ? [opts.catalogName] : catalogsForCategory(opts.category);
  const pageNumber = opts.pageNumber ?? 1;
  const pageSize = opts.pageSize ?? 20;

  if (catalogNames.length === 1) {
    return fetchFromCatalog(catalogNames[0], { category: opts.category, pageNumber, pageSize });
  }

  const perCatalogSize = Math.ceil(pageSize / catalogNames.length);
  const results = await Promise.all(
    catalogNames.map((name) =>
      fetchFromCatalog(name, { category: opts.category, pageNumber, pageSize: perCatalogSize })
    )
  );

  return {
    products: results.flatMap((r) => r.products).slice(0, pageSize),
    total: results.reduce((sum, r) => sum + r.total, 0),
  };
}
