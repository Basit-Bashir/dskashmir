/**
 * HP Hermes PDB API client.
 *
 * Server-side functions call the backend directly via HP_BACKEND_URL.
 * Client-side code should use /api/hp/* routes instead.
 */

import type { Product } from "./products";
import { catalogsForCategory } from "./hp-catalogs";

const BACKEND = process.env.HP_BACKEND_URL || "https://api.dskashmir.com/hp";
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
  totalResults?: number;
  pageNumber?: number;
  pageSize?: number;
  items?: HPCatalogItem[];
  hierarchyNodes?: Record<
    string,
    {
      hierarchyId: string;
      hierarchyName: string;
      productNumber: string;
      inputHierarchyId: string;
      hierarchyPath: string;
    }
  >;
  totalItemCount?: number;
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
  plcStatus?: string;
  hierarchyPath?: string[];
  [key: string]: unknown;
}

export interface HPProductContentResponse {
  products: HPProductContent[];
  raw?: Record<string, unknown>;
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
  raw?: Record<string, unknown>;
}

export interface HPCompanionItem {
  sku: string;
  name?: string;
  category?: string;
}

export interface HPRichMediaItem {
  title?: string;
  type?: string;
  url?: string;
  description?: string;
}

export interface HPDocumentItem {
  title?: string;
  url: string;
  format?: string;
  type?: string;
}

// ── Low-level caller ──────────────────────────────────────────────────────────

async function callHP<T>(
  endpoint: string,
  payload: Record<string, unknown>
): Promise<T> {
  const url = BACKEND.replace(/\/hp\/?$/, "") + `/hp/${endpoint}`;
  const res = await fetch(url, {
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

/**
 * 1. POST /hp/catalogitems
 * Body: { catalogName: "LAPTOPS" | "PRINTERS", countryCode: "IN", languageCode: "EN", outputHierarchyLevel: "Product", pageNumber: 1, pageSize: 1000, requestor: "DSKASHMIR-PRO" }
 */
export async function getCatalogItems(opts: {
  catalogName?: string;
  countryCode?: string;
  languageCode?: string;
  outputHierarchyLevel?: string;
  pageNumber?: number;
  pageSize?: number;
} = {}): Promise<HPCatalogResponse> {
  const catalogName = (opts.catalogName || "LAPTOPS").toUpperCase();
  return callHP<HPCatalogResponse>("catalogitems", {
    catalogName,
    countryCode: opts.countryCode || COUNTRY_CODE,
    languageCode: opts.languageCode || LANGUAGE_CODE,
    outputHierarchyLevel: opts.outputHierarchyLevel || "Product",
    pageNumber: opts.pageNumber ?? 1,
    pageSize: opts.pageSize ?? 1000,
    requestor: REQUESTOR,
  });
}

/**
 * 2. POST /hp/productcontent
 * Body: { sku: [dynamicSku], countryCode: "IN", languageCode: "EN", layoutName: "ALL-Specs", requestor: "DSKASHMIR-PRO" }
 */
export async function getProductContent(
  sku: string[],
  opts: {
    countryCode?: string;
    languageCode?: string;
    layoutName?: string;
    reqContent?: string[];
  } = {}
): Promise<HPProductContentResponse> {
  interface APIProductContentResponse {
    products?: Record<
      string,
      {
        sku: string;
        plcStatus?: string;
        status?: boolean;
        chunks?: Record<
          string,
          {
            group: string;
            details?: Array<{
              name: string;
              tag: string;
              value: string;
            }>;
          }
        >;
        hierarchy?: any[];
      }
    >;
  }

  const payload: Record<string, unknown> = {
    sku,
    countryCode: opts.countryCode || COUNTRY_CODE,
    languageCode: opts.languageCode || LANGUAGE_CODE,
    layoutName: opts.layoutName || "ALL-Specs",
    requestor: REQUESTOR,
  };
  if (opts.reqContent) {
    payload.reqContent = opts.reqContent;
  }

  const data = await callHP<APIProductContentResponse>("productcontent", payload);

  const productsArray: HPProductContent[] = Object.entries(data.products || {}).map(
    ([skuKey, prod]: [string, any]) => {
      const specifications: HPSpec[] = [];
      let name = skuKey;
      let shortDescription = "";
      let longDescription = "";

      const seenSpecKeys = new Set<string>();
      if (prod.chunks) {
        for (const chunk of Object.values(prod.chunks) as any[]) {
          if (chunk.details) {
            for (const detail of chunk.details) {
              const specKey = `${detail.name}:${detail.value}`;
              if (!seenSpecKeys.has(specKey)) {
                seenSpecKeys.add(specKey);
                specifications.push({
                  name: detail.name,
                  value: detail.value,
                  groupName: chunk.group,
                });
              }

              if (detail.tag === "custfacingdes" || detail.tag === "prodname" || detail.tag === "prodlongname") {
                name = detail.value;
              }
              if (detail.tag === "proddes_overview_short") {
                shortDescription = detail.value;
              }
              if (detail.tag === "proddes_overview_medium") {
                longDescription = detail.value;
              }
            }
          }
        }
      }

      return {
        productNumber: skuKey,
        name,
        shortDescription,
        longDescription,
        specifications,
        plcStatus: prod.plcStatus,
      };
    }
  );

  return { products: productsArray, raw: data as any };
}

/**
 * 3. POST /hp/companions
 * Body: { sku: ["Q2660A"], countryCode: "IN", languageCode: "EN", requestor: "DSKASHMIR-PRO" }
 */
export async function getCompanions(
  sku: string[],
  opts: { countryCode?: string; languageCode?: string } = {}
) {
  return callHP("companions", {
    sku,
    countryCode: opts.countryCode || COUNTRY_CODE,
    languageCode: opts.languageCode || LANGUAGE_CODE,
    requestor: REQUESTOR,
  });
}

/**
 * 4. POST /hp/images
 * Body: { sku: ["Q2660A"], countryCode: "IN", languageCode: "EN", layoutName: "ALL-IMAGES", requestor: "DSKASHMIR-PRO" }
 */
export async function getProductImages(
  sku: string[],
  opts: { countryCode?: string; languageCode?: string; layoutName?: string } = {}
): Promise<HPImagesResponse> {
  interface APIImagesResponse {
    products?: Record<
      string,
      {
        sku: string;
        images?: Array<{
          group: string;
          details?: Array<{
            imageUrlHttps: string;
            imageUrlHttp?: string;
            type?: string;
            pixelWidth?: string;
            pixelHeight?: string;
            fullTitle?: string;
          }>;
        }>;
      }
    >;
  }

  const data = await callHP<APIImagesResponse>("images", {
    sku,
    countryCode: opts.countryCode || COUNTRY_CODE,
    languageCode: opts.languageCode || LANGUAGE_CODE,
    layoutName: opts.layoutName || "ALL-IMAGES",
    requestor: REQUESTOR,
  });

  const productsArray = Object.entries(data.products || {}).map(
    ([skuKey, prod]: [string, any]) => {
      const productImages: HPImage[] = [];
      const seenUrls = new Set<string>();

      if (prod.images) {
        const targetGroups = [
          "IMAGES_LARGE",
          "JPG_IMAGES_LARGE",
          "IMAGES_MEDIUM",
          "JPG_IMAGES_MEDIUM",
          "PRODUCT_IN_USE_MEDIUM",
        ];
        for (const grp of prod.images) {
          if (targetGroups.includes(grp.group) && grp.details) {
            for (const d of grp.details) {
              const url = d.imageUrlHttps || d.imageUrlHttp;
              if (url && !seenUrls.has(url)) {
                seenUrls.add(url);
                productImages.push({
                  url,
                  type: d.type || "jpg",
                  width: d.pixelWidth ? parseInt(d.pixelWidth, 10) : undefined,
                  height: d.pixelHeight ? parseInt(d.pixelHeight, 10) : undefined,
                  altText: d.fullTitle,
                });
              }
            }
          }
        }
      }

      return {
        productNumber: skuKey,
        images: productImages,
      };
    }
  );

  return { products: productsArray };
}

/**
 * 5. POST /hp/richmedia
 * Body: { skus: ["Q2660A"], countryCode: "IN", languageCode: "EN", layoutName: "RICHMEDIA", requestor: "DSKASHMIR-PRO" }
 */
export async function getRichMedia(
  skus: string[],
  opts: { countryCode?: string; languageCode?: string; layoutName?: string } = {}
) {
  return callHP("richmedia", {
    skus,
    countryCode: opts.countryCode || COUNTRY_CODE,
    languageCode: opts.languageCode || LANGUAGE_CODE,
    layoutName: opts.layoutName || "RICHMEDIA",
    requestor: REQUESTOR,
  });
}

/**
 * 6. POST /hp/itempartnerdocs
 * Body: { skus: ["Q2660A"], countryCode: "IN", languageCode: "EN", requestor: "DSKASHMIR-PRO" }
 */
export async function getItemPartnerDocs(
  skus: string[],
  opts: { countryCode?: string; languageCode?: string } = {}
) {
  return callHP("itempartnerdocs", {
    skus,
    countryCode: opts.countryCode || COUNTRY_CODE,
    languageCode: opts.languageCode || LANGUAGE_CODE,
    requestor: REQUESTOR,
  });
}

/**
 * 7. POST /hp/hierarchy
 * Body: { sku: ["Q2660A"], countryCode: "IN", languageCode: "EN", layoutName: "LIST", requestor: "DSKASHMIR-PRO" }
 */
export async function getHierarchy(
  sku: string[],
  opts: { countryCode?: string; languageCode?: string; layoutName?: string } = {}
) {
  return callHP("hierarchy", {
    sku,
    countryCode: opts.countryCode || COUNTRY_CODE,
    languageCode: opts.languageCode || LANGUAGE_CODE,
    layoutName: opts.layoutName || "LIST",
    requestor: REQUESTOR,
  });
}

/**
 * 8. POST /hp/plc
 * Body: { sku: ["Q2660A"], countryCode: "IN", languageCode: "EN", layoutName: "LIST", requestor: "DSKASHMIR-PRO" }
 */
export async function getPLC(
  sku: string[],
  opts: { countryCode?: string; languageCode?: string; layoutName?: string } = {}
) {
  return callHP("plc", {
    sku,
    countryCode: opts.countryCode || COUNTRY_CODE,
    languageCode: opts.languageCode || LANGUAGE_CODE,
    layoutName: opts.layoutName || "LIST",
    requestor: REQUESTOR,
  });
}

/**
 * 9. POST /hp/catalogfacetfilters
 * Body: { catalogName: "Laptops", countryCode: "IN", languageCode: "EN", outputHierarchyLevel: "Product", facetIds: ["a_processor_brand"], requestor: "DSKASHMIR-PRO" }
 */
export async function getCatalogFacetFilters(opts: {
  catalogName?: string;
  countryCode?: string;
  languageCode?: string;
  outputHierarchyLevel?: string;
  facetIds?: string[];
} = {}): Promise<HPFacetFiltersResponse> {
  const catalogName = opts.catalogName || "Laptops";
  return callHP<HPFacetFiltersResponse>("catalogfacetfilters", {
    catalogName,
    countryCode: opts.countryCode || COUNTRY_CODE,
    languageCode: opts.languageCode || LANGUAGE_CODE,
    outputHierarchyLevel: opts.outputHierarchyLevel || "Product",
    facetIds: opts.facetIds || ["a_processor_brand"],
    requestor: REQUESTOR,
  });
}

/**
 * 10. POST /hp/itemsbyfacetvalues
 * Body: { catalogName: "Laptops", countryCode: "IN", languageCode: "EN", outputHierarchyLevel: "Product", facetValues: { a_processor_brand: ["AMD"] }, requestor: "DSKASHMIR-PRO" }
 */
export async function getItemsByFacetValues(opts: {
  facetValues: Record<string, string[]>;
  catalogName?: string;
  countryCode?: string;
  languageCode?: string;
  outputHierarchyLevel?: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<HPCatalogResponse> {
  const catalogName = opts.catalogName || "Laptops";
  return callHP<HPCatalogResponse>("itemsbyfacetvalues", {
    catalogName,
    countryCode: opts.countryCode || COUNTRY_CODE,
    languageCode: opts.languageCode || LANGUAGE_CODE,
    outputHierarchyLevel: opts.outputHierarchyLevel || "Product",
    pageNumber: opts.pageNumber ?? 1,
    pageSize: opts.pageSize ?? 1000,
    facetValues: opts.facetValues,
    requestor: REQUESTOR,
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
  let price = Math.round(unitPrice * USD_TO_INR);
  let originalPrice = listPrice ? Math.round(listPrice * USD_TO_INR) : undefined;

  const category = mapCategory(item.category || content?.category);

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

  const specs: Product["specs"] =
    content?.specifications?.map((s) => ({ label: s.name, value: s.value, groupName: s.groupName })) ?? [];

  const productImages = images?.map((img) => img.url) ?? [];

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
    plcStatus: content?.plcStatus,
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

    let items = catalogRes.items ?? [];
    if (!items.length && catalogRes.hierarchyNodes) {
      items = Object.values(catalogRes.hierarchyNodes).map((node) => ({
        productNumber: node.productNumber,
        shortName: node.hierarchyName,
        longName: node.hierarchyName,
      }));
    }

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

    return {
      products,
      total: catalogRes.totalItemCount ?? catalogRes.totalResults ?? products.length,
    };
  } catch {
    return { products: [], total: 0 };
  }
}

/**
 * Fetches a full page of catalog products, then enriches each with
 * product content and images in two parallel batches.
 * Returns an empty array (not a throw) if the backend is unreachable.
 *
 * Pass `catalogName` to hit one HP catalog directly ("LAPTOPS" or "PRINTERS").
 * Otherwise `category` maps to "Laptops" and "Printers" catalogs.
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
 * Fetches and enriches a single product by HP product number, joining:
 * - productcontent
 * - images
 * - companions
 * - richmedia
 * - itempartnerdocs
 * - hierarchy
 * - plc
 */
export async function fetchProductByNumber(
  productNumber: string
): Promise<Product | null> {
  try {
    const [contentRes, imagesRes, companionsRes, richMediaRes, docsRes, plcRes] =
      await Promise.allSettled([
        getProductContent([productNumber], { reqContent: ["chunks", "images", "hierarchy", "plc"] }),
        getProductImages([productNumber]),
        getCompanions([productNumber]),
        getRichMedia([productNumber]),
        getItemPartnerDocs([productNumber]),
        getPLC([productNumber]),
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

    const baseProduct = mapHPItemToProduct(item, content, images);

    // Enrich extra details if available
    const plcVal = plcRes.status === "fulfilled" ? (plcRes.value as any) : null;
    if (plcVal?.products?.[productNumber]?.plcStatus) {
      baseProduct.plcStatus = plcVal.products[productNumber].plcStatus;
    }

    const compVal = companionsRes.status === "fulfilled" ? (companionsRes.value as any) : null;
    if (compVal?.products?.[productNumber]) {
      const cData = compVal.products[productNumber];
      if (Array.isArray(cData.companionItems)) {
        baseProduct.companions = cData.companionItems.map((c: any) => ({
          sku: c.sku || c.productNumber,
          name: c.name || c.title,
          category: c.category,
        }));
      }
    }

    const rmVal = richMediaRes.status === "fulfilled" ? (richMediaRes.value as any) : null;
    if (rmVal?.products?.[productNumber]) {
      const rmData = rmVal.products[productNumber];
      if (Array.isArray(rmData.richMedia)) {
        baseProduct.richMedia = rmData.richMedia.map((rm: any) => ({
          title: rm.title || rm.name,
          type: rm.type || rm.mediaType,
          url: rm.url || rm.assetUrl,
          description: rm.description,
        }));
      }
    }

    const docVal = docsRes.status === "fulfilled" ? (docsRes.value as any) : null;
    if (docVal?.products?.[productNumber]) {
      const docData = docVal.products[productNumber];
      if (Array.isArray(docData.documents)) {
        baseProduct.documents = docData.documents.map((d: any) => ({
          title: d.title || d.documentTitle,
          url: d.url || d.documentUrl,
          format: d.format || d.contentType,
          type: d.type || d.documentType,
        }));
      }
    }

    return baseProduct;
  } catch {
    return null;
  }
}