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
  plcStatus?: string;
}

interface RawImage {
  url: string;
  type: string;
}

/** 1. POST /api/hp/catalogitems */
export async function fetchCatalogItemsClient(opts: {
  catalogName: "LAPTOPS" | "PRINTERS" | string;
  pageNumber?: number;
  pageSize?: number;
}) {
  const res = await fetch("/api/hp/catalogitems", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      catalogName: opts.catalogName.toUpperCase(),
      countryCode: COUNTRY_CODE,
      languageCode: LANGUAGE_CODE,
      outputHierarchyLevel: "Product",
      pageNumber: opts.pageNumber ?? 1,
      pageSize: opts.pageSize ?? 1000,
      requestor: REQUESTOR,
    }),
  });
  if (!res.ok) return { totalItemCount: 0, hierarchyNodes: {} };
  return res.json();
}

/** 2. POST /api/hp/productcontent */
export async function fetchProductContentClient(
  skus: string[],
  reqContent?: string[]
) {
  const body: Record<string, unknown> = {
    sku: skus,
    countryCode: COUNTRY_CODE,
    languageCode: LANGUAGE_CODE,
    layoutName: "ALL-Specs",
    requestor: REQUESTOR,
  };
  if (reqContent) body.reqContent = reqContent;

  const res = await fetch("/api/hp/productcontent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return { products: {} };
  return res.json();
}

/** 3. POST /api/hp/companions */
export async function fetchCompanionsClient(skus: string[]) {
  const res = await fetch("/api/hp/companions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sku: skus,
      countryCode: COUNTRY_CODE,
      languageCode: LANGUAGE_CODE,
      requestor: REQUESTOR,
    }),
  });
  if (!res.ok) return { products: {} };
  return res.json();
}

/** 4. POST /api/hp/images */
export async function fetchProductImagesClient(skus: string[]) {
  const res = await fetch("/api/hp/images", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sku: skus,
      countryCode: COUNTRY_CODE,
      languageCode: LANGUAGE_CODE,
      layoutName: "ALL-IMAGES",
      requestor: REQUESTOR,
    }),
  });
  if (!res.ok) return { products: {} };
  return res.json();
}

/** 5. POST /api/hp/richmedia */
export async function fetchRichMediaClient(skus: string[]) {
  const res = await fetch("/api/hp/richmedia", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      skus,
      countryCode: COUNTRY_CODE,
      languageCode: LANGUAGE_CODE,
      layoutName: "RICHMEDIA",
      requestor: REQUESTOR,
    }),
  });
  if (!res.ok) return { products: {} };
  return res.json();
}

/** 6. POST /api/hp/itempartnerdocs */
export async function fetchItemPartnerDocsClient(skus: string[]) {
  const res = await fetch("/api/hp/itempartnerdocs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      skus,
      countryCode: COUNTRY_CODE,
      languageCode: LANGUAGE_CODE,
      requestor: REQUESTOR,
    }),
  });
  if (!res.ok) return { products: {} };
  return res.json();
}

/** 7. POST /api/hp/hierarchy */
export async function fetchHierarchyClient(skus: string[]) {
  const res = await fetch("/api/hp/hierarchy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sku: skus,
      countryCode: COUNTRY_CODE,
      languageCode: LANGUAGE_CODE,
      layoutName: "LIST",
      requestor: REQUESTOR,
    }),
  });
  if (!res.ok) return { products: {} };
  return res.json();
}

/** 8. POST /api/hp/plc */
export async function fetchPlcClient(skus: string[]) {
  const res = await fetch("/api/hp/plc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sku: skus,
      countryCode: COUNTRY_CODE,
      languageCode: LANGUAGE_CODE,
      layoutName: "LIST",
      requestor: REQUESTOR,
    }),
  });
  if (!res.ok) return { products: {} };
  return res.json();
}

/** 9. POST /api/hp/catalogfacetfilters */
export async function fetchCatalogFacetFiltersClient(opts: {
  catalogName: string;
  facetIds?: string[];
}) {
  const res = await fetch("/api/hp/catalogfacetfilters", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      catalogName: opts.catalogName,
      countryCode: COUNTRY_CODE,
      languageCode: LANGUAGE_CODE,
      outputHierarchyLevel: "Product",
      facetIds: opts.facetIds || ["a_processor_brand"],
      requestor: REQUESTOR,
    }),
  });
  if (!res.ok) return { facets: [] };
  return res.json();
}

/** 10. POST /api/hp/itemsbyfacetvalues */
export async function fetchItemsByFacetValuesClient(opts: {
  catalogName: string;
  facetValues: Record<string, string[]>;
  pageNumber?: number;
  pageSize?: number;
}) {
  const res = await fetch("/api/hp/itemsbyfacetvalues", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      catalogName: opts.catalogName,
      countryCode: COUNTRY_CODE,
      languageCode: LANGUAGE_CODE,
      outputHierarchyLevel: "Product",
      pageNumber: opts.pageNumber ?? 1,
      pageSize: opts.pageSize ?? 1000,
      facetValues: opts.facetValues,
      requestor: REQUESTOR,
    }),
  });
  if (!res.ok) return { hierarchyNodes: {} };
  return res.json();
}

/**
 * Fetches one page from a single HP catalog (e.g. "Laptops" or "Printers"),
 * enriched with content + images.
 */
async function fetchFromCatalog(
  catalogName: string,
  opts: { category?: string; pageNumber: number; pageSize: number }
): Promise<{ products: Product[]; total: number }> {
  const res = await fetch(`/api/hp/catalogitems`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      catalogName: catalogName.toUpperCase(),
      countryCode: COUNTRY_CODE,
      languageCode: LANGUAGE_CODE,
      outputHierarchyLevel: "Product",
      pageNumber: opts.pageNumber,
      pageSize: opts.pageSize,
      requestor: REQUESTOR,
    }),
  });

  if (!res.ok) return { products: [], total: 0 };

  const data = await res.json();
  let items: RawCatalogItem[] = data.items ?? [];
  if (!items.length && data.hierarchyNodes) {
    items = Object.values(data.hierarchyNodes).map((node: any) => ({
      productNumber: node.productNumber,
      shortName: node.hierarchyName,
      longName: node.hierarchyName,
    }));
  }

  if (!items.length) return { products: [], total: 0 };

  const productNumbers = items.map((i) => i.productNumber);

  const [contentRes, imagesRes] = await Promise.allSettled([
    fetchProductContentClient(productNumbers),
    fetchProductImagesClient(productNumbers),
  ]);

  const apiProductsContent = contentRes.status === "fulfilled" ? (contentRes.value.products || {}) : {};
  const contentMap = new Map<string, RawContent>();
  for (const [sku, prod] of Object.entries(apiProductsContent) as any[]) {
    let name = sku;
    let shortDescription = "";
    let longDescription = "";
    const specifications: { name: string; value: string }[] = [];

    const seenSpecKeys = new Set<string>();
    if (prod.chunks) {
      for (const chunk of Object.values(prod.chunks) as any[]) {
        if (chunk.details) {
          for (const d of chunk.details) {
            const specKey = `${d.name}:${d.value}`;
            if (!seenSpecKeys.has(specKey)) {
              seenSpecKeys.add(specKey);
              specifications.push({ name: d.name, value: d.value });
            }
            if (d.tag === "custfacingdes" || d.tag === "prodname" || d.tag === "prodlongname") name = d.value;
            if (d.tag === "proddes_overview_short") shortDescription = d.value;
            if (d.tag === "proddes_overview_medium") longDescription = d.value;
          }
        }
      }
    }

    contentMap.set(sku, {
      productNumber: sku,
      name,
      shortDescription,
      longDescription,
      specifications,
      plcStatus: prod.plcStatus,
    });
  }

  const apiProductImages = imagesRes.status === "fulfilled" ? (imagesRes.value.products || {}) : {};
  const imagesMap = new Map<string, RawImage[]>();
  for (const [sku, prod] of Object.entries(apiProductImages) as any[]) {
    const productImages: RawImage[] = [];
    const seenUrls = new Set<string>();

    if (prod.images) {
      const targetGroups = ["IMAGES_LARGE", "JPG_IMAGES_LARGE", "IMAGES_MEDIUM", "JPG_IMAGES_MEDIUM", "PRODUCT_IN_USE_MEDIUM"];
      for (const grp of prod.images) {
        if (targetGroups.includes(grp.group) && grp.details) {
          for (const d of grp.details) {
            const url = d.imageUrlHttps || d.imageUrlHttp;
            if (url && !seenUrls.has(url)) {
              seenUrls.add(url);
              productImages.push({
                url,
                type: d.type || "jpg",
              });
            }
          }
        }
      }
    }
    imagesMap.set(sku, productImages);
  }

  const mappedProducts: Product[] = items.map((item) => {
    const content = contentMap.get(item.productNumber);
    const imgs = imagesMap.get(item.productNumber) ?? [];

    const name = content?.name || item.longName || item.shortName || item.productNumber;
    const category = mapCategory(item.category || content?.productLine);
    const unitPrice = item.price?.unitPrice ?? 0;
    const listPrice = item.price?.listPrice;
    let price = Math.round(unitPrice * USD_TO_INR);
    let originalPrice = listPrice ? Math.round(listPrice * USD_TO_INR) : undefined;

    if (price === 0) {
      let hash = 0;
      const s = item.productNumber || "";
      for (let i = 0; i < s.length; i++) {
        hash = s.charCodeAt(i) + ((hash << 5) - hash);
      }
      const isPrinter = category === "printer" || category === "copier";
      const base = isPrinter ? 12000 : 45000;
      const variance = Math.abs(hash % 15) * 2000;
      price = base + variance + 999;
      if (hash % 2 === 0) {
        originalPrice = Math.round(price * 1.15);
      }
    }

    return {
      id: item.productNumber,
      slug: slugify(name) || item.productNumber.replace(/[^a-z0-9]/gi, "-").toLowerCase(),
      productNumber: item.productNumber,
      name,
      series: content?.productLine || item.productLine || "HP",
      tagline: content?.shortDescription ?? "",
      description: content?.longDescription ?? content?.shortDescription ?? "",
      price,
      originalPrice,
      category,
      plcStatus: content?.plcStatus,
      colors: [{ name: "Default", hex: "#1a1a2e" }],
      configs: [{ ram: "—", storage: "—", price }],
      specs: content?.specifications?.map((s) => ({ label: s.name, value: s.value })) ?? [],
      images: imgs.map((img) => img.url),
      rating: 4.5,
      reviewCount: 0,
      inBox: [],
    } satisfies Product;
  });

  return {
    products: mappedProducts,
    total: data.totalItemCount ?? data.totalResults ?? mappedProducts.length,
  };
}

/**
 * Category-aware entry point. Maps internal category to HP catalogs ("LAPTOPS", "PRINTERS").
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
