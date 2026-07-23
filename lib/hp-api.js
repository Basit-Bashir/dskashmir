"use strict";
/**
 * HP Hermes PDB API client.
 *
 * Server-side functions call the backend directly via HP_BACKEND_URL.
 * Client-side code should use /api/hp/* routes instead.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCatalogItems = getCatalogItems;
exports.getCatalogFacetFilters = getCatalogFacetFilters;
exports.getItemsByFacetValues = getItemsByFacetValues;
exports.getProductContent = getProductContent;
exports.getProductImages = getProductImages;
exports.getCompanions = getCompanions;
exports.getRichMedia = getRichMedia;
exports.getPLC = getPLC;
exports.getHierarchy = getHierarchy;
exports.getItemPartnerDocs = getItemPartnerDocs;
exports.mapHPItemToProduct = mapHPItemToProduct;
exports.fetchCatalogProducts = fetchCatalogProducts;
exports.fetchProductByNumber = fetchProductByNumber;
const hp_catalogs_1 = require("./hp-catalogs");
const BACKEND = process.env.HP_BACKEND_URL || "https://api.dskashmir.com";
const COUNTRY_CODE = "IN";
const LANGUAGE_CODE = "EN";
const REQUESTOR = "DSKASHMIR-PRO";
// ── Low-level caller ──────────────────────────────────────────────────────────
async function callHP(endpoint, payload) {
    const res = await fetch(`${BACKEND}/hp/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(`HP API [${endpoint}] ${res.status}: ${err.message || res.statusText}`);
    }
    return res.json();
}
// ── Public API functions ──────────────────────────────────────────────────────
async function getCatalogItems(opts = {}) {
    return callHP("catalogitems", {
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
async function getCatalogFacetFilters(opts = {}) {
    return callHP("catalogfacetfilters", {
        catalogName: "Laptops",
        countryCode: COUNTRY_CODE,
        languageCode: LANGUAGE_CODE,
        requestor: REQUESTOR,
        ...opts,
    });
}
async function getItemsByFacetValues(opts) {
    return callHP("itemsbyfacetvalues", {
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
async function getProductContent(sku, opts = {}) {
    const data = await callHP("productcontent", {
        sku,
        countryCode: COUNTRY_CODE,
        languageCode: LANGUAGE_CODE,
        layoutName: opts.layoutName || "ALL-Specs",
        requestor: REQUESTOR,
        ...opts,
    });
    const productsArray = Object.entries(data.products || {}).map(([skuKey, prod]) => {
        const specifications = [];
        let name = skuKey;
        let shortDescription = "";
        let longDescription = "";
        if (prod.chunks) {
            for (const chunk of Object.values(prod.chunks)) {
                if (chunk.details) {
                    for (const detail of chunk.details) {
                        specifications.push({
                            name: detail.name,
                            value: detail.value,
                            groupName: chunk.group,
                        });
                        if (detail.tag === "custfacingdes") {
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
        };
    });
    return { products: productsArray };
}
async function getProductImages(sku, opts = {}) {
    const data = await callHP("images", {
        sku,
        countryCode: COUNTRY_CODE,
        languageCode: LANGUAGE_CODE,
        layoutName: opts.layoutName || "ALL-Specs",
        requestor: REQUESTOR,
        ...opts,
    });
    const productsArray = Object.entries(data.products || {}).map(([skuKey, prod]) => {
        const productImages = [];
        const seenUrls = new Set();
        if (prod.images) {
            const targetGroups = [
                "IMAGES_LARGE",
                "IMAGES_MEDIUM",
                "JPG_IMAGES_LARGE",
                "PRODUCT_IN_USE_MEDIUM",
            ];
            for (const grp of prod.images) {
                if (targetGroups.includes(grp.group) && grp.details) {
                    for (const d of grp.details) {
                        if (d.imageUrlHttps && !seenUrls.has(d.imageUrlHttps)) {
                            seenUrls.add(d.imageUrlHttps);
                            productImages.push({
                                url: d.imageUrlHttps,
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
    });
    return { products: productsArray };
}
async function getCompanions(productNumbers, opts = {}) {
    return callHP("companions", {
        productNumbers,
        countryCode: COUNTRY_CODE,
        languageCode: LANGUAGE_CODE,
        requestor: REQUESTOR,
        ...opts,
    });
}
async function getRichMedia(productNumbers, opts = {}) {
    return callHP("richmedia", {
        productNumbers,
        countryCode: COUNTRY_CODE,
        languageCode: LANGUAGE_CODE,
        requestor: REQUESTOR,
        ...opts,
    });
}
async function getPLC(productNumbers, opts = {}) {
    return callHP("plc", {
        productNumbers,
        countryCode: COUNTRY_CODE,
        languageCode: LANGUAGE_CODE,
        requestor: REQUESTOR,
        ...opts,
    });
}
async function getHierarchy(opts = {}) {
    return callHP("hierarchy", {
        countryCode: COUNTRY_CODE,
        languageCode: LANGUAGE_CODE,
        requestor: REQUESTOR,
        ...opts,
    });
}
async function getItemPartnerDocs(productNumbers, opts = {}) {
    return callHP("itempartnerdocs", {
        productNumbers,
        countryCode: COUNTRY_CODE,
        languageCode: LANGUAGE_CODE,
        requestor: REQUESTOR,
        ...opts,
    });
}
// ── Mapping helpers ───────────────────────────────────────────────────────────
function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
function mapCategory(cat) {
    const c = (cat || "").toLowerCase();
    if (c.includes("gaming") || c.includes("omen"))
        return "gaming";
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
function mapHPItemToProduct(item, content, images) {
    const USD_TO_INR = 84;
    const name = content?.name || item.longName || item.shortName || item.productNumber;
    const unitPrice = item.price?.unitPrice ?? 0;
    const listPrice = item.price?.listPrice;
    const price = Math.round(unitPrice * USD_TO_INR);
    const originalPrice = listPrice ? Math.round(listPrice * USD_TO_INR) : undefined;
    const specs = content?.specifications?.map((s) => ({ label: s.name, value: s.value })) ?? [];
    const productImages = images?.map((img) => img.url) ?? [];
    const category = mapCategory(item.category || content?.category);
    return {
        id: item.productNumber,
        slug: slugify(name) || item.productNumber.replace(/[^a-z0-9]/gi, "-").toLowerCase(),
        productNumber: item.productNumber,
        name,
        series: content?.productLine || item.productLine || "HP",
        tagline: content?.shortDescription ?? "",
        description: content?.longDescription || content?.marketingDescription || content?.shortDescription || "",
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
async function fetchFromCatalog(catalogName, pageNumber, pageSize) {
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
        if (!items.length)
            return { products: [], total: 0 };
        const productNumbers = items.map((i) => i.productNumber);
        const [contentRes, imagesRes] = await Promise.allSettled([
            getProductContent(productNumbers),
            getProductImages(productNumbers),
        ]);
        const contentMap = new Map(contentRes.status === "fulfilled"
            ? (contentRes.value.products ?? []).map((p) => [p.productNumber, p])
            : []);
        const imagesMap = new Map(imagesRes.status === "fulfilled"
            ? (imagesRes.value.products ?? []).map((p) => [p.productNumber, p.images])
            : []);
        const products = items.map((item) => mapHPItemToProduct(item, contentMap.get(item.productNumber), imagesMap.get(item.productNumber)));
        return {
            products,
            total: catalogRes.totalItemCount ?? catalogRes.totalResults ?? products.length,
        };
    }
    catch {
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
async function fetchCatalogProducts(opts = {}) {
    const catalogNames = opts.catalogName ? [opts.catalogName] : (0, hp_catalogs_1.catalogsForCategory)(opts.category);
    const pageNumber = opts.pageNumber ?? 1;
    const pageSize = opts.pageSize ?? 1000;
    if (catalogNames.length === 1) {
        return fetchFromCatalog(catalogNames[0], pageNumber, pageSize);
    }
    const perCatalogSize = Math.ceil(pageSize / catalogNames.length);
    const results = await Promise.all(catalogNames.map((name) => fetchFromCatalog(name, pageNumber, perCatalogSize)));
    return {
        products: results.flatMap((r) => r.products).slice(0, pageSize),
        total: results.reduce((sum, r) => sum + r.total, 0),
    };
}
/**
 * Fetches and enriches a single product by HP product number.
 * Returns null if not found or the backend is unreachable.
 */
async function fetchProductByNumber(productNumber) {
    try {
        const [contentRes, imagesRes] = await Promise.allSettled([
            getProductContent([productNumber]),
            getProductImages([productNumber]),
        ]);
        const content = contentRes.status === "fulfilled"
            ? contentRes.value.products?.[0]
            : undefined;
        const images = imagesRes.status === "fulfilled"
            ? imagesRes.value.products?.[0]?.images
            : undefined;
        if (!content && !images)
            return null;
        const item = {
            productNumber,
            shortName: content?.name,
            productLine: content?.productLine,
            category: content?.category,
        };
        return mapHPItemToProduct(item, content, images);
    }
    catch {
        return null;
    }
}
