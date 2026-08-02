/**
 * HP Hermes PDB API client.
 *
 * Server-side functions call the backend directly via HP_BACKEND_URL.
 * Client-side code should use /api/hp/* routes instead.
 */

import type { Product } from "./products";
import { catalogsForCategory } from "./hp-catalogs";
import {
  parseProductContentEntry,
  parseImagesEntry,
  mapItemToProduct,
  type ParsedContent,
} from "./hp-mapping";

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
  /** Required on the request when pageNumber > 1 — see getCatalogItems. */
  catalogReference?: string;
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
  highlights?: string[];
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
    next: { revalidate: 3600 },
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
 *
 * HP rejects `pageNumber > 1` unless the `catalogReference` from that
 * catalog's page-1 response is echoed back in the request.
 */
export async function getCatalogItems(opts: {
  catalogName?: string;
  countryCode?: string;
  languageCode?: string;
  outputHierarchyLevel?: string;
  pageNumber?: number;
  pageSize?: number;
  catalogReference?: string;
} = {}): Promise<HPCatalogResponse> {
  const catalogName = (opts.catalogName || "LAPTOPS").toUpperCase();
  const pageNumber = opts.pageNumber ?? 1;
  const payload: Record<string, unknown> = {
    catalogName,
    countryCode: opts.countryCode || COUNTRY_CODE,
    languageCode: opts.languageCode || LANGUAGE_CODE,
    outputHierarchyLevel: opts.outputHierarchyLevel || "Product",
    pageNumber,
    pageSize: opts.pageSize ?? 1000,
    requestor: REQUESTOR,
  };
  if (pageNumber > 1 && opts.catalogReference) {
    payload.catalogReference = opts.catalogReference;
  }
  return callHP<HPCatalogResponse>("catalogitems", payload);
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
    products?: Record<string, any>;
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
    ([skuKey, prod]) => {
      const parsed: ParsedContent = parseProductContentEntry(skuKey, prod);
      return {
        productNumber: parsed.productNumber,
        name: parsed.name,
        shortDescription: parsed.shortDescription,
        longDescription: parsed.longDescription,
        specifications: parsed.specifications,
        highlights: parsed.highlights,
        category: parsed.category,
        productLine: parsed.series,
        plcStatus: parsed.plcStatus,
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

  const productsArray = Object.entries(data.products || {}).map(([skuKey, prod]) => ({
    productNumber: skuKey,
    images: parseImagesEntry(prod),
  }));

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

/**
 * Maps a raw HP catalog item (plus optional enriched content & images) into
 * the app's Product shape. USD prices are converted to INR at ~84.
 * `catalogName` (e.g. "Printers", "Desktops") is the primary category signal —
 * the Hermes catalog response never includes a category field on the item itself.
 */
export function mapHPItemToProduct(
  item: HPCatalogItem,
  content?: HPProductContent,
  images?: HPImage[],
  catalogName?: string
): Product {
  return mapItemToProduct(item, {
    catalogName,
    content: content
      ? {
          productNumber: content.productNumber,
          name: content.name || item.longName || item.shortName || item.productNumber,
          shortDescription: content.shortDescription || "",
          longDescription: content.longDescription || content.marketingDescription || "",
          specifications: content.specifications ?? [],
          highlights: content.highlights,
          category: content.category,
          series: content.productLine,
          plcStatus: content.plcStatus,
        }
      : undefined,
    images: images?.map((img) => ({ url: img.url, type: img.type, width: img.width, height: img.height, altText: img.altText })),
  });
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

    // Batch chunk to max 50 SKUs per request to avoid backend payload timeouts
    const BATCH_SIZE = 50;
    const contentPromises: Promise<HPProductContentResponse>[] = [];
    const imagesPromises: Promise<HPImagesResponse>[] = [];

    for (let i = 0; i < productNumbers.length; i += BATCH_SIZE) {
      const chunk = productNumbers.slice(i, i + BATCH_SIZE);
      contentPromises.push(getProductContent(chunk));
      imagesPromises.push(getProductImages(chunk));
    }

    const [contentResults, imagesResults] = await Promise.all([
      Promise.allSettled(contentPromises),
      Promise.allSettled(imagesPromises),
    ]);

    const contentMap = new Map<string, HPProductContent>();
    for (const res of contentResults) {
      if (res.status === "fulfilled" && res.value.products) {
        for (const p of res.value.products) {
          contentMap.set(p.productNumber, p);
        }
      }
    }

    const imagesMap = new Map<string, HPImage[]>();
    for (const res of imagesResults) {
      if (res.status === "fulfilled" && res.value.products) {
        for (const p of res.value.products) {
          imagesMap.set(p.productNumber, p.images);
        }
      }
    }

    const products = items.map((item) =>
      mapHPItemToProduct(
        item,
        contentMap.get(item.productNumber),
        imagesMap.get(item.productNumber),
        catalogName
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
 * Fast, lightweight fetch of catalog items without retrieving full specs for
 * every product. Pass `includeImages: true` to also batch-fetch thumbnails
 * (cheap for the page-sized calls this is used for in the UI — skip it for
 * bulk calls like the sitemap, where hundreds/thousands of images would be
 * fetched and thrown away unused).
 */
export async function fetchCatalogSummary(opts: {
  category?: string;
  catalogName?: string;
  pageNumber?: number;
  pageSize?: number;
  includeImages?: boolean;
} = {}): Promise<{ products: Product[]; total: number; catalogReferences: Record<string, string> }> {
  const catalogNames = opts.catalogName ? [opts.catalogName] : catalogsForCategory(opts.category);
  const pageNumber = opts.pageNumber ?? 1;
  const pageSize = opts.pageSize ?? 1000;
  // Split evenly across catalogs so e.g. "all products" isn't 100% Laptops
  // just because Laptops happens to be first in catalogsForCategory().
  const perCatalogSize = Math.ceil(pageSize / catalogNames.length);

  const summaryPromises = catalogNames.map(async (name) => {
    try {
      const res = await getCatalogItems({ catalogName: name, pageNumber, pageSize: perCatalogSize });
      let items = res.items ?? [];
      if (!items.length && res.hierarchyNodes) {
        items = Object.values(res.hierarchyNodes).map((node) => ({
          productNumber: node.productNumber,
          shortName: node.hierarchyName,
          longName: node.hierarchyName,
        }));
      }

      const imagesMap = new Map<string, HPImage[]>();
      if (opts.includeImages && items.length > 0) {
        const productNumbers = items.map((i) => i.productNumber);
        const BATCH_SIZE = 50;
        const imagesPromises: Promise<HPImagesResponse>[] = [];
        for (let i = 0; i < productNumbers.length; i += BATCH_SIZE) {
          imagesPromises.push(getProductImages(productNumbers.slice(i, i + BATCH_SIZE)));
        }
        const imagesResults = await Promise.allSettled(imagesPromises);
        for (const r of imagesResults) {
          if (r.status === "fulfilled" && r.value.products) {
            for (const p of r.value.products) imagesMap.set(p.productNumber, p.images);
          }
        }
      }

      const products = items.map((item) =>
        mapHPItemToProduct(item, undefined, imagesMap.get(item.productNumber), name)
      );
      return {
        products,
        total: res.totalItemCount ?? res.totalResults ?? products.length,
        catalogReference: res.catalogReference,
      };
    } catch {
      return { products: [], total: 0, catalogReference: undefined as string | undefined };
    }
  });

  const results = await Promise.all(summaryPromises);
  const catalogReferences: Record<string, string> = {};
  results.forEach((r, i) => {
    if (r.catalogReference) catalogReferences[catalogNames[i]] = r.catalogReference;
  });

  return {
    products: results.flatMap((r) => r.products).slice(0, pageSize),
    total: results.reduce((sum, r) => sum + r.total, 0),
    catalogReferences,
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