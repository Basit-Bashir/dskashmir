/**
 * Client-side HP catalog fetcher. Calls the /api/hp/* proxy routes and maps
 * the response into the app's Product shape — the browser equivalent of
 * fetchCatalogProducts() in lib/hp-api.ts (which is server-only).
 */

import type { Product } from "./products";
import { catalogsForCategory } from "./hp-catalogs";
import { parseProductContentEntry, parseImagesEntry, mapItemToProduct, type RawCatalogItem } from "./hp-mapping";
import {
  ALLOWED_PRINTER_SKUS,
  isPrinterCatalog,
  sanitizeProducts,
} from "./allowed-printer-skus";
import {
  ALLOWED_SUPPLIES_SKUS,
  isSuppliesCatalog,
  sanitizeSuppliesProducts,
} from "./allowed-supplies-skus";

const COUNTRY_CODE = "IN";
const LANGUAGE_CODE = "EN";
const REQUESTOR = "DSKASHMIR-PRO";

/**
 * 1. POST /api/hp/catalogitems
 * HP's backend requires the `catalogReference` returned by the page-1
 * response to be echoed back on page 2+ requests — otherwise it 400s with
 * "PageNumber in request > 1 but CatalogReference not provided".
 */
export async function fetchCatalogItemsClient(opts: {
  catalogName: "LAPTOPS" | "PRINTERS" | string;
  pageNumber?: number;
  pageSize?: number;
  catalogReference?: string;
}) {
  const body: Record<string, unknown> = {
    catalogName: opts.catalogName.toUpperCase(),
    countryCode: COUNTRY_CODE,
    languageCode: LANGUAGE_CODE,
    outputHierarchyLevel: "Product",
    pageNumber: opts.pageNumber ?? 1,
    pageSize: opts.pageSize ?? 1000,
    requestor: REQUESTOR,
  };
  if (opts.catalogReference) body.catalogReference = opts.catalogReference;

  const res = await fetch("/api/hp/catalogitems", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
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
  opts: { category?: string; pageNumber: number; pageSize: number; catalogReference?: string; searchPhrase?: string }
): Promise<{ products: Product[]; total: number; catalogReference?: string }> {
  if (isPrinterCatalog(catalogName)) {
    const isSearching = Boolean(opts.searchPhrase?.trim());

    // When searching, fetch all 189 SKUs in 4 parallel chunks to filter accurately by product name/description
    const skusToFetch = isSearching
      ? ALLOWED_PRINTER_SKUS
      : ALLOWED_PRINTER_SKUS.slice((opts.pageNumber - 1) * opts.pageSize, opts.pageNumber * opts.pageSize);

    if (!skusToFetch.length) return { products: [], total: ALLOWED_PRINTER_SKUS.length };

    const BATCH_SIZE = 50;
    const contentPromises = [];
    const imagesPromises = [];

    for (let i = 0; i < skusToFetch.length; i += BATCH_SIZE) {
      const chunk = skusToFetch.slice(i, i + BATCH_SIZE);
      contentPromises.push(fetchProductContentClient(chunk));
      imagesPromises.push(fetchProductImagesClient(chunk));
    }

    const [contentResults, imagesResults] = await Promise.all([
      Promise.allSettled(contentPromises),
      Promise.allSettled(imagesPromises),
    ]);

    const contentMap = new Map<string, ReturnType<typeof parseProductContentEntry>>();
    for (const res of contentResults) {
      if (res.status === "fulfilled" && res.value?.products) {
        for (const [sku, prod] of Object.entries(res.value.products)) {
          contentMap.set(sku, parseProductContentEntry(sku, prod));
        }
      }
    }

    const imagesMap = new Map<string, ReturnType<typeof parseImagesEntry>>();
    for (const res of imagesResults) {
      if (res.status === "fulfilled" && res.value?.products) {
        for (const [sku, prod] of Object.entries(res.value.products)) {
          imagesMap.set(sku, parseImagesEntry(prod));
        }
      }
    }

    let allMapped: Product[] = skusToFetch.map((sku) => {
      const item: RawCatalogItem = {
        productNumber: sku,
        shortName: contentMap.get(sku)?.name || sku,
        longName: contentMap.get(sku)?.name || sku,
      };
      return mapItemToProduct(item, {
        catalogName,
        content: contentMap.get(sku),
        images: imagesMap.get(sku),
      });
    });

    allMapped = sanitizeProducts(allMapped, catalogName);

    if (isSearching && opts.searchPhrase) {
      const q = opts.searchPhrase.trim().toLowerCase();
      allMapped = allMapped.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.productNumber && p.productNumber.toLowerCase().includes(q))
      );
      const start = (opts.pageNumber - 1) * opts.pageSize;
      return {
        products: allMapped.slice(start, start + opts.pageSize),
        total: allMapped.length,
      };
    }

    return {
      products: allMapped,
      total: ALLOWED_PRINTER_SKUS.length,
    };
  }

  if (isSuppliesCatalog(catalogName)) {
    const isSearching = Boolean(opts.searchPhrase?.trim());

    const skusToFetch = isSearching
      ? ALLOWED_SUPPLIES_SKUS
      : ALLOWED_SUPPLIES_SKUS.slice((opts.pageNumber - 1) * opts.pageSize, opts.pageNumber * opts.pageSize);

    if (!skusToFetch.length) return { products: [], total: ALLOWED_SUPPLIES_SKUS.length };

    const BATCH_SIZE = 50;
    const contentPromises = [];
    const imagesPromises = [];

    for (let i = 0; i < skusToFetch.length; i += BATCH_SIZE) {
      const chunk = skusToFetch.slice(i, i + BATCH_SIZE);
      contentPromises.push(fetchProductContentClient(chunk));
      imagesPromises.push(fetchProductImagesClient(chunk));
    }

    const [contentResults, imagesResults] = await Promise.all([
      Promise.allSettled(contentPromises),
      Promise.allSettled(imagesPromises),
    ]);

    const contentMap = new Map<string, ReturnType<typeof parseProductContentEntry>>();
    for (const res of contentResults) {
      if (res.status === "fulfilled" && res.value?.products) {
        for (const [sku, prod] of Object.entries(res.value.products)) {
          contentMap.set(sku, parseProductContentEntry(sku, prod));
        }
      }
    }

    const imagesMap = new Map<string, ReturnType<typeof parseImagesEntry>>();
    for (const res of imagesResults) {
      if (res.status === "fulfilled" && res.value?.products) {
        for (const [sku, prod] of Object.entries(res.value.products)) {
          imagesMap.set(sku, parseImagesEntry(prod));
        }
      }
    }

    let allMapped: Product[] = skusToFetch.map((sku) => {
      const item: RawCatalogItem = {
        productNumber: sku,
        shortName: contentMap.get(sku)?.name || sku,
        longName: contentMap.get(sku)?.name || sku,
      };
      return mapItemToProduct(item, {
        catalogName,
        content: contentMap.get(sku),
        images: imagesMap.get(sku),
      });
    });

    allMapped = sanitizeSuppliesProducts(allMapped, catalogName);

    if (isSearching && opts.searchPhrase) {
      const q = opts.searchPhrase.trim().toLowerCase();
      allMapped = allMapped.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.productNumber && p.productNumber.toLowerCase().includes(q))
      );
      const start = (opts.pageNumber - 1) * opts.pageSize;
      return {
        products: allMapped.slice(start, start + opts.pageSize),
        total: allMapped.length,
      };
    }

    return {
      products: allMapped,
      total: ALLOWED_SUPPLIES_SKUS.length,
    };
  }

  const body: Record<string, unknown> = {
    catalogName: catalogName.toUpperCase(),
    countryCode: COUNTRY_CODE,
    languageCode: LANGUAGE_CODE,
    outputHierarchyLevel: "Product",
    pageNumber: opts.pageNumber,
    pageSize: opts.pageSize,
    requestor: REQUESTOR,
  };
  // Delegate matching to HP's backend instead of sampling a page of the
  // catalog and filtering client-side — catalogs run into the thousands of
  // items, so a client-side filter over one page rarely finds a match.
  if (opts.searchPhrase) body.generalSearchPhrase = opts.searchPhrase;
  // HP requires the catalogReference from the page-1 response to be echoed
  // back for pageNumber > 1, or it 400s.
  if (opts.pageNumber > 1 && opts.catalogReference) body.catalogReference = opts.catalogReference;

  const res = await fetch(`/api/hp/catalogitems`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) return { products: [], total: 0 };

  const data = await res.json();
  const catalogReference: string | undefined = data.catalogReference;
  let items: RawCatalogItem[] = data.items ?? [];
  if (!items.length && data.hierarchyNodes) {
    items = Object.values(data.hierarchyNodes).map((node: any) => ({
      productNumber: node.productNumber,
      shortName: node.hierarchyName,
      longName: node.hierarchyName,
    }));
  }

  if (!items.length) return { products: [], total: 0, catalogReference };

  const productNumbers = items.map((i) => i.productNumber);

  const [contentRes, imagesRes] = await Promise.allSettled([
    fetchProductContentClient(productNumbers),
    fetchProductImagesClient(productNumbers),
  ]);

  const apiProductsContent = contentRes.status === "fulfilled" ? (contentRes.value.products || {}) : {};
  const contentMap = new Map<string, ReturnType<typeof parseProductContentEntry>>();
  for (const [sku, prod] of Object.entries(apiProductsContent)) {
    contentMap.set(sku, parseProductContentEntry(sku, prod));
  }

  const apiProductImages = imagesRes.status === "fulfilled" ? (imagesRes.value.products || {}) : {};
  const imagesMap = new Map<string, ReturnType<typeof parseImagesEntry>>();
  for (const [sku, prod] of Object.entries(apiProductImages)) {
    imagesMap.set(sku, parseImagesEntry(prod));
  }

  const mappedProducts: Product[] = items.map((item) =>
    mapItemToProduct(item, {
      catalogName,
      content: contentMap.get(item.productNumber),
      images: imagesMap.get(item.productNumber),
    })
  );

  let sanitized = sanitizeProducts(mappedProducts, catalogName);
  sanitized = sanitizeSuppliesProducts(sanitized, catalogName);

  return {
    products: sanitized,
    total: data.totalItemCount ?? data.totalResults ?? sanitized.length,
    catalogReference,
  };
}

/**
 * Category-aware entry point. Maps internal category to HP catalogs ("LAPTOPS", "PRINTERS").
 *
 * `catalogReferences` (keyed by catalog name) must be the values returned
 * from a prior page-1 call when requesting `pageNumber > 1` — HP's backend
 * rejects page 2+ without the reference issued for that query. Always fetch
 * page 1 first (e.g. on every category change) to obtain fresh references.
 */
export async function fetchCatalogProductsClient(opts: {
  category?: string;
  catalogName?: string;
  pageNumber?: number;
  pageSize?: number;
  catalogReferences?: Record<string, string>;
  searchPhrase?: string;
} = {}): Promise<{ products: Product[]; total: number; catalogReferences: Record<string, string> }> {
  const catalogNames = opts.catalogName ? [opts.catalogName] : catalogsForCategory(opts.category);
  const pageNumber = opts.pageNumber ?? 1;
  const pageSize = opts.pageSize ?? 20;

  const perCatalogSize = catalogNames.length === 1 ? pageSize : Math.ceil(pageSize / catalogNames.length);
  const results = await Promise.all(
    catalogNames.map((name) =>
      fetchFromCatalog(name, {
        category: opts.category,
        pageNumber,
        pageSize: perCatalogSize,
        catalogReference: opts.catalogReferences?.[name],
        searchPhrase: opts.searchPhrase,
      })
    )
  );

  const catalogReferences: Record<string, string> = {};
  results.forEach((r, i) => {
    if (r.catalogReference) catalogReferences[catalogNames[i]] = r.catalogReference;
  });

  let allProducts = results.flatMap((r) => r.products);
  allProducts = sanitizeProducts(allProducts);
  allProducts = sanitizeSuppliesProducts(allProducts).slice(0, pageSize);

  return {
    products: allProducts,
    total: results.reduce((sum, r) => sum + r.total, 0),
    catalogReferences,
  };
}
