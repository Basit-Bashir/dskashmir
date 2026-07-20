/**
 * HP Hermes PDB API client.
 *
 * Server-side functions call the backend directly via HP_BACKEND_URL.
 * Client-side code should use /api/hp/* routes instead.
 */

import type { Product } from "./products";
import { catalogsForCategory } from "./hp-catalogs";

const BACKEND = process.env.HP_BACKEND_URL || "http://localhost:3000";
const COUNTRY_CODE = "IN";
const LANGUAGE_CODE = "EN";
const REQUESTOR = "DSKASHMIR-PRO";

// ── Response types ────────────────────────────────────────────────────────────

export interface HPPrice {
  currencyCode: string;
  unitPrice: number;
  listPrice?: number;
}

export interface HPCatalogItem {
  productNumber: string;
  shortName?: string;
  longName?: string;
  productLine?: string;
  category?: string;
  subCategory?: string;
  price?: HPPrice;
  [key: string]: unknown;
}

export interface HPCatalogResponse {
  totalResults: number;
  pageNumber: number;
  pageSize: number;
  items: HPCatalogItem[];
}

export interface HPSpec {
  name: string;
  value: string;
  groupName?: string;
}

export interface HPProductContent {
  productNumber: string;
  name?: string;
  shortDescription?: string;
  longDescription?: string;
  marketingDescription?: string;
  specifications?: HPSpec[];
  productLine?: string;
  category?: string;
  [key: string]: unknown;
}

export interface HPProductContentResponse {
  products: HPProductContent[];
}

export interface HPImage {
  url: string;
  type: string;
  width?: number;
  height?: number;
  altText?: string;
}

export interface HPImagesResponse {
  products: Array<{
    productNumber: string;
    images: HPImage[];
  }>;
}

export interface HPFacetValue {
  value: string;
  count: number;
  displayValue?: string;
}

export interface HPFacet {
  name: string;
  displayName: string;
  values: HPFacetValue[];
}

export interface HPFacetFiltersResponse {
  facets: HPFacet[];
}

// ── Low-level caller ──────────────────────────────────────────────────────────

async function callHP<T>(
  endpoint: string,
  payload: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`${BACKEND}/hp/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(
      `HP API [${endpoint}] ${res.status}: ${err.message || res.statusText}`
    );
  }

  return res.json() as Promise<T>;
}

// ── Public API functions ──────────────────────────────────────────────────────

export async function getCatalogItems(opts: {
  catalogName?: string;
  countryCode?: string;
  languageCode?: string;
  outputHierarchyLevel?: string;
  pageNumber?: number;
  pageSize?: number;
} = {}): Promise<HPCatalogResponse> {
  return callHP<HPCatalogResponse>("catalogitems", {
    catalogName: "Laptops",
    countryCode: COUNTRY_CODE,
    languageCode: LANGUAGE_CODE,
    outputHierarchyLevel: "Product",
    pageNumber: 1,
    pageSize: 1000,
    requestor: REQUESTOR,
    ...opts,
  });
}

export async function getCatalogFacetFilters(opts: {
  catalogName?: string;
  countryCode?: string;
  languageCode?: string;
} = {}): Promise<HPFacetFiltersResponse> {
  return callHP<HPFacetFiltersResponse>("catalogfacetfilters", {
    catalogName: "Laptops",
    countryCode: COUNTRY_CODE,
    languageCode: LANGUAGE_CODE,
    requestor: REQUESTOR,
    ...opts,
  });
}

export async function getItemsByFacetValues(opts: {
  facetValues: string[];
  catalogName?: string;
  countryCode?: string;
  languageCode?: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<HPCatalogResponse> {
  return callHP<HPCatalogResponse>("itemsbyfacetvalues", {
    catalogName: "Laptops",
    countryCode: COUNTRY_CODE,
    languageCode: LANGUAGE_CODE,
    outputHierarchyLevel: "Product",
    pageNumber: 1,
    pageSize: 1000,
    requestor: REQUESTOR,
    ...opts,
  });
}

export async function getProductContent(
  productNumbers: string[],
  opts: { countryCode?: string; languageCode?: string } = {}
): Promise<HPProductContentResponse> {
  return callHP<HPProductContentResponse>("productcontent", {
    productNumbers,
    countryCode: COUNTRY_CODE,
    languageCode: LANGUAGE_CODE,
    requestor: REQUESTOR,
    ...opts,
  });
}

export async function getProductImages(
  productNumbers: string[],
  opts: { countryCode?: string; languageCode?: string } = {}
): Promise<HPImagesResponse> {
  return callHP<HPImagesResponse>("images", {
    productNumbers,
    countryCode: COUNTRY_CODE,
    languageCode: LANGUAGE_CODE,
    requestor: REQUESTOR,
    ...opts,
  });
}

export async function getCompanions(
  productNumbers: string[],
  opts: { countryCode?: string; languageCode?: string } = {}
) {
  return callHP("companions", {
    productNumbers,
    countryCode: COUNTRY_CODE,
    languageCode: LANGUAGE_CODE,
    requestor: REQUESTOR,
    ...opts,
  });
}

export async function getRichMedia(
  productNumbers: string[],
  opts: { countryCode?: string; languageCode?: string } = {}
) {
  return callHP("richmedia", {
    productNumbers,
    countryCode: COUNTRY_CODE,
    languageCode: LANGUAGE_CODE,
    requestor: REQUESTOR,
    ...opts,
  });
}

export async function getPLC(
  productNumbers: string[],
  opts: { countryCode?: string; languageCode?: string } = {}
) {
  return callHP("plc", {
    productNumbers,
    countryCode: COUNTRY_CODE,
    languageCode: LANGUAGE_CODE,
    requestor: REQUESTOR,
    ...opts,
  });
}

export async function getHierarchy(opts: {
  countryCode?: string;
  languageCode?: string;
} = {}) {
  return callHP("hierarchy", {
    countryCode: COUNTRY_CODE,
    languageCode: LANGUAGE_CODE,
    requestor: REQUESTOR,
    ...opts,
  });
}

export async function getItemPartnerDocs(
  productNumbers: string[],
  opts: { countryCode?: string; languageCode?: string } = {}
) {
  return callHP("itempartnerdocs", {
    productNumbers,
    countryCode: COUNTRY_CODE,
    languageCode: LANGUAGE_CODE,
    requestor: REQUESTOR,
    ...opts,
  });
}

// ── Mapping helpers ───────────────────────────────────────────────────────────

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

/**
 * Maps a raw HP catalog item (plus optional enriched content & images) into
 * the app's Product shape. USD prices are converted to INR at ~84.
 */
export function mapHPItemToProduct(
  item: HPCatalogItem,
  content?: HPProductContent,
  images?: HPImage[]
): Product {
  const USD_TO_INR = 84;
  const name = content?.name || item.longName || item.shortName || item.productNumber;
  const unitPrice = item.price?.unitPrice ?? 0;
  const listPrice = item.price?.listPrice;
  const price = Math.round(unitPrice * USD_TO_INR);
  const originalPrice = listPrice ? Math.round(listPrice * USD_TO_INR) : undefined;

  const specs: Product["specs"] =
    content?.specifications?.map((s) => ({ label: s.name, value: s.value })) ?? [];

  const productImages = images?.map((img) => img.url) ?? [];

  const category = mapCategory(item.category || content?.category);

  return {
    id: item.productNumber,
    slug: slugify(name) || item.productNumber.replace(/[^a-z0-9]/gi, "-").toLowerCase(),
    productNumber: item.productNumber,
    name,
    series: content?.productLine || item.productLine || "HP",
    tagline: content?.shortDescription ?? "",
    description:
      content?.longDescription || content?.marketingDescription || content?.shortDescription || "",
    price,
    originalPrice,
    category,
    colors: [{ name: "Default", hex: "#1a1a2e" }],
    configs: [{ ram: "—", storage: "—", price }],
    specs,
    images: productImages,
    rating: 4.5,
    reviewCount: 0,
    inBox: [],
  };
}

async function fetchFromCatalog(
  catalogName: string,
  pageNumber: number,
  pageSize: number
): Promise<{ products: Product[]; total: number }> {
  try {
    const catalogRes = await getCatalogItems({ catalogName, pageNumber, pageSize });

    const items = catalogRes.items ?? [];
    if (!items.length) return { products: [], total: 0 };

    const productNumbers = items.map((i) => i.productNumber);

    const [contentRes, imagesRes] = await Promise.allSettled([
      getProductContent(productNumbers),
      getProductImages(productNumbers),
    ]);

    const contentMap = new Map<string, HPProductContent>(
      contentRes.status === "fulfilled"
        ? (contentRes.value.products ?? []).map((p) => [p.productNumber, p])
        : []
    );

    const imagesMap = new Map<string, HPImage[]>(
      imagesRes.status === "fulfilled"
        ? (imagesRes.value.products ?? []).map((p) => [p.productNumber, p.images])
        : []
    );

    const products = items.map((item) =>
      mapHPItemToProduct(
        item,
        contentMap.get(item.productNumber),
        imagesMap.get(item.productNumber)
      )
    );

    return { products, total: catalogRes.totalResults ?? products.length };
  } catch {
    return { products: [], total: 0 };
  }
}

/**
 * Fetches a full page of catalog products, then enriches each with
 * product content and images in two parallel batches.
 * Returns an empty array (not a throw) if the backend is unreachable.
 *
 * Pass `catalogName` to hit one HP catalog directly. Otherwise `category`
 * (the site's internal category key) is mapped to the catalog(s) that back
 * it via catalogsForCategory — "printer"/"copier" resolve to the Printers
 * catalog, everything else to Laptops, and "all"/unset merges both.
 */
export async function fetchCatalogProducts(opts: {
  category?: string;
  catalogName?: string;
  pageNumber?: number;
  pageSize?: number;
} = {}): Promise<{ products: Product[]; total: number }> {
  const catalogNames = opts.catalogName ? [opts.catalogName] : catalogsForCategory(opts.category);
  const pageNumber = opts.pageNumber ?? 1;
  const pageSize = opts.pageSize ?? 1000;

  if (catalogNames.length === 1) {
    return fetchFromCatalog(catalogNames[0], pageNumber, pageSize);
  }

  const perCatalogSize = Math.ceil(pageSize / catalogNames.length);
  const results = await Promise.all(
    catalogNames.map((name) => fetchFromCatalog(name, pageNumber, perCatalogSize))
  );

  return {
    products: results.flatMap((r) => r.products).slice(0, pageSize),
    total: results.reduce((sum, r) => sum + r.total, 0),
  };
}

/**
 * Fetches and enriches a single product by HP product number.
 * Returns null if not found or the backend is unreachable.
 */
export async function fetchProductByNumber(
  productNumber: string
): Promise<Product | null> {
  try {
    const [contentRes, imagesRes] = await Promise.allSettled([
      getProductContent([productNumber]),
      getProductImages([productNumber]),
    ]);

    const content =
      contentRes.status === "fulfilled"
        ? contentRes.value.products?.[0]
        : undefined;

    const images =
      imagesRes.status === "fulfilled"
        ? imagesRes.value.products?.[0]?.images
        : undefined;

    if (!content && !images) return null;

    const item: HPCatalogItem = {
      productNumber,
      shortName: content?.name,
      productLine: content?.productLine,
      category: content?.category,
    };

    return mapHPItemToProduct(item, content, images);
  } catch {
    return null;
  }
}