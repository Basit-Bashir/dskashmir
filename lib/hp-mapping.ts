/**
 * Isomorphic HP Hermes response parsing & mapping.
 *
 * Shared by lib/hp-api.ts (server, calls the backend directly) and
 * lib/hp-client.ts (browser, calls the /api/hp/* proxy routes) so both
 * paths normalize the same raw HP JSON into the app's Product shape the
 * same way. Pure functions only — no fetch, safe to import from either side.
 */

import type { Product } from "./products";

// ── Text & slug helpers ─────────────────────────────────────────────────────

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Product names collide across many distinct SKUs (e.g. dozens of
 * "HP 200 G2a 14 inch Notebook PC" variants), so the slug must embed the
 * product number to stay unique. Delimited with "--" so extractSkuFromSlug
 * can recover the exact SKU without guessing at hyphen boundaries.
 */
export function buildProductSlug(name: string, productNumber: string): string {
  const base = slugify(name) || "hp-product";
  return `${base}--${productNumber.toLowerCase()}`;
}

export function extractSkuFromSlug(slug: string): string | null {
  const idx = slug.lastIndexOf("--");
  if (idx === -1) return null;
  const sku = slug.slice(idx + 2).toUpperCase();
  return sku || null;
}

function cleanHPText(str?: string): string {
  if (!str) return "";
  return str
    .replace(/\[\d+(?:\s*,\s*\d+)*\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeGroupName(rawGroup?: string): string {
  if (!rawGroup) return "General Specifications";
  const g = rawGroup.toUpperCase();
  if (g.includes("PROCESSOR") || g.includes("GRAPHICS")) return "Processor & Performance";
  if (g.includes("DISPLAY") || g.includes("MONITOR")) return "Display & Visuals";
  if (g.includes("MULTIMEDIA") || g.includes("AUDIO") || g.includes("CAMERA") || g.includes("INPUT")) return "Audio, Camera & Input";
  if (g.includes("SOFTWARE") || g.includes("OPERATING SYSTEM")) return "Operating System & Software";
  if (g.includes("SECURITY")) return "Security & Privacy";
  if (g.includes("LOGISTICS") || g.includes("WEIGHT") || g.includes("DIMENSIONS")) return "Dimensions & Weight";
  if (g.includes("SUSTAINABILITY") || g.includes("ENVIRONMENT")) return "Sustainability & Materials";
  if (
    g.includes("WARRANTY") ||
    g.includes("SERVICE") ||
    g.includes("CARE PACK") ||
    g.includes("REGISTRATION") ||
    g.includes("COPYRIGHT")
  ) {
    return "Warranty & Support";
  }

  return rawGroup.replace(/^PRISM_\s*/i, "").trim() || "General Specifications";
}

const IGNORED_TAGS = new Set([
  "unspsc", "upc", "mattype", "tangibleflag", "company", "prodclassflag",
  "codename", "prodlongnamespecs", "prodshortnamespecs", "custfacingdes",
  "prodbrandname", "seoproddes_hw", "prodnum",
  "a_processor_spdmax", "a_processor_spdmaxuom", "a_processor_nputops",
  "a_processor_brand", "a_processor_familyshort", "a_processor_model",
  "a_kbd_backlight", "a_kbd_color", "a_kbd_size",
]);

// ── /productcontent parsing ─────────────────────────────────────────────────

export interface ParsedSpec {
  name: string;
  value: string;
  groupName?: string;
}

export interface ParsedContent {
  productNumber: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  specifications: ParsedSpec[];
  highlights?: string[];
  /** Raw facet text (e.g. "Laser printers", "Laptops") used to derive Product["category"]. */
  category?: string;
  /** Short marketing sub-brand/series text (e.g. "Essential", "OMEN"). */
  series?: string;
  plcStatus?: string;
}

/**
 * Parses one entry of the `products` map returned by POST /hp/productcontent.
 * `prod.chunks` is an array of { group, details: [{ name, tag, value }] }.
 */
export function parseProductContentEntry(sku: string, prod: any): ParsedContent {
  const specifications: ParsedSpec[] = [];
  const highlights: string[] = [];
  let name = sku;
  let shortDescription = "";
  let longDescription = "";
  let category = "";
  let series = "";
  let seriesFallback = "";

  const seenSpecKeys = new Set<string>();
  const chunks: any[] = Array.isArray(prod?.chunks) ? prod.chunks : Object.values(prod?.chunks || {});

  for (const chunk of chunks) {
    if (!chunk?.details) continue;
    for (const detail of chunk.details) {
      const tag = (detail.tag || "").toLowerCase();
      const rawName = detail.name || "";
      const rawVal = detail.value || "";

      if (tag.startsWith("playbook_mm_etail_header") || tag.startsWith("playbook_mm_etail_suppt")) {
        const cleanedHl = cleanHPText(rawVal);
        if (cleanedHl && cleanedHl.length > 5 && !highlights.includes(cleanedHl)) {
          highlights.push(cleanedHl);
        }
        continue;
      }

      if (tag === "facet_prodtype" || tag === "filter_prodtype") {
        if (!category) category = cleanHPText(rawVal);
      } else if (tag === "facet_subcategory" || tag === "facet_prodcat") {
        if (!category) category = cleanHPText(rawVal);
      }

      if (tag === "facet_subbrand") {
        series = cleanHPText(rawVal);
      } else if (tag === "facet_seriesname" && !seriesFallback) {
        seriesFallback = cleanHPText(rawVal);
      }

      if (
        tag.includes("ftntnbr") ||
        tag.endsWith("note") ||
        tag.includes("footnote") ||
        tag.startsWith("pbtsicon_") ||
        IGNORED_TAGS.has(tag)
      ) {
        continue;
      }

      if (tag === "custfacingdes" || tag === "prodname" || tag === "prodlongname") {
        name = cleanHPText(rawVal);
      }
      if (tag === "proddes_overview_short") {
        shortDescription = cleanHPText(rawVal);
      }
      if (tag === "proddes_overview_medium" || tag === "proddes_overview_extended") {
        const cleanedMed = cleanHPText(rawVal);
        if (!longDescription || cleanedMed.length > longDescription.length) {
          longDescription = cleanedMed;
        }
      }

      if (
        !rawName ||
        !rawVal ||
        rawName === "Product description" ||
        rawName === "Product name" ||
        rawName === "Product number" ||
        rawName === "Company"
      ) {
        continue;
      }

      const cleanedVal = cleanHPText(rawVal);
      if (!cleanedVal) continue;

      const groupName = normalizeGroupName(chunk.group);
      const specKey = `${rawName.toLowerCase()}:${cleanedVal.toLowerCase()}`;

      if (!seenSpecKeys.has(specKey)) {
        seenSpecKeys.add(specKey);
        specifications.push({ name: rawName, value: cleanedVal, groupName });
      }
    }
  }

  return {
    productNumber: sku,
    name,
    shortDescription,
    longDescription,
    specifications,
    highlights: highlights.length > 0 ? highlights : undefined,
    category: category || undefined,
    series: series || seriesFallback || undefined,
    plcStatus: prod?.plcStatus,
  };
}

// ── /images parsing ──────────────────────────────────────────────────────────

export interface ParsedImage {
  url: string;
  type: string;
  width?: number;
  height?: number;
  altText?: string;
}

const IMAGE_GROUP_PRIORITY = [
  "IMAGES_LARGE",
  "JPG_IMAGES_LARGE",
  "IMAGES_MEDIUM",
  "JPG_IMAGES_MEDIUM",
  "PRODUCT_IN_USE_MEDIUM",
];

/**
 * Groups are iterated in IMAGE_GROUP_PRIORITY order (not the API's raw
 * response order) so clean isolated studio shots always come first — some
 * PRODUCT_IN_USE_MEDIUM assets are contextual marketing images with large
 * blocks of solid white padding baked into the JPEG, which look broken when
 * placed as images[0] in a compact layout (e.g. the homepage hero).
 */
export function parseImagesEntry(prod: any): ParsedImage[] {
  const images: ParsedImage[] = [];
  const seenUrls = new Set<string>();
  const groups: any[] = Array.isArray(prod?.images) ? prod.images : [];
  const groupsByName = new Map<string, any>();
  for (const grp of groups) {
    if (grp?.group && !groupsByName.has(grp.group)) groupsByName.set(grp.group, grp);
  }

  for (const groupName of IMAGE_GROUP_PRIORITY) {
    const grp = groupsByName.get(groupName);
    if (!grp?.details) continue;
    for (const d of grp.details) {
      const url = d.imageUrlHttps || d.imageUrlHttp;
      if (url && !seenUrls.has(url)) {
        seenUrls.add(url);
        images.push({
          url,
          type: d.type || "jpg",
          width: d.pixelWidth ? parseInt(d.pixelWidth, 10) : undefined,
          height: d.pixelHeight ? parseInt(d.pixelHeight, 10) : undefined,
          altText: d.fullTitle,
        });
      }
    }
  }

  return images;
}

// ── Category derivation ──────────────────────────────────────────────────────

/**
 * The Hermes catalogitems/hierarchyNodes response never includes a category
 * field, so the catalog an item was fetched from (e.g. "Printers",
 * "Desktops") is the most reliable category signal. Name/content text is
 * layered on top to split Laptops into gaming/business/creator/ultrabook.
 */
const CATALOG_CATEGORY_MAP: Record<string, Product["category"]> = {
  desktops: "desktop",
  desktops_home: "desktop",
  desktops_business: "desktop",
  workstations: "desktop",
  thin_clients: "desktop",
  pos: "desktop",
  printers: "printer",
  designjet_printers: "printer",
  industrial_printers: "printer",
  laserjet_multifunction_printers: "printer",
  inkjet_multifunction_printers: "printer",
  pagewide_printers: "printer",
  scanners: "printer",
  gaming_systems: "gaming",
  monitors: "accessory",
  accessories: "accessory",
  storage: "accessory",
  supplies: "accessory",
  keyboards_mice: "accessory",
  docking_stations: "accessory",
  chargers_power_adaptors: "accessory",
  ink_toner_cartridges: "accessory",
  printer_supplies: "accessory",
  paper: "accessory",
  carepacks: "accessory",
  software: "accessory",
  services: "accessory",
  solutions: "accessory",
  industries: "accessory",
  hyperx: "accessory",
  entertainment: "accessory",
  handhelds_calculators: "accessory",
  "3d": "accessory",
};

function normalizeCatalogKey(catalogName?: string): string {
  return (catalogName || "").toLowerCase().replace(/[\s-]+/g, "_");
}

export function deriveCategory(opts: {
  catalogName?: string;
  name?: string;
  contentCategory?: string;
}): Product["category"] {
  const text = `${opts.name || ""} ${opts.contentCategory || ""}`.toLowerCase();

  if (text.includes("omen") || text.includes("victus") || /\bgaming\b/.test(text)) return "gaming";
  if (text.includes("elitebook") || text.includes("probook") || /\belite\b/.test(text) || /\bbusiness\b/.test(text)) return "business";
  if (text.includes("zbook") || text.includes("envy") || text.includes("spectre") || /\bcreator\b/.test(text)) return "creator";
  if (text.includes("mfp") || text.includes("multifunction") || text.includes("copier")) return "copier";

  const mapped = CATALOG_CATEGORY_MAP[normalizeCatalogKey(opts.catalogName)];
  if (mapped) return mapped;

  if (text.includes("laptop") || text.includes("notebook") || text.includes("chromebook")) return "ultrabook";
  if (text.includes("desktop") || text.includes("all-in-one") || text.includes("tower") || text.includes("workstation")) return "desktop";
  if (text.includes("printer") || text.includes("laser") || text.includes("inkjet") || text.includes("designjet")) return "printer";
  if (
    text.includes("monitor") ||
    text.includes("dock") ||
    text.includes("mouse") ||
    text.includes("keyboard") ||
    text.includes("accessory") ||
    text.includes("cartridge") ||
    text.includes("toner") ||
    text.includes("paper")
  )
    return "accessory";

  return "ultrabook";
}

// ── Product assembly ─────────────────────────────────────────────────────────

const USD_TO_INR = 84;

export interface RawCatalogItem {
  productNumber: string;
  shortName?: string;
  longName?: string;
  price?: { unitPrice?: number; listPrice?: number };
}

/**
 * Deterministic placeholder price. The Hermes PDB API is a content/catalog
 * syndication feed — it does not return live pricing for IN, so catalog
 * items almost always come back with unitPrice 0. This derives a stable
 * (not random-per-render) price from the SKU so the UI has something
 * consistent to show instead of ₹0.
 */
function fallbackPrice(productNumber: string, category: Product["category"]): { price: number; originalPrice?: number } {
  let hash = 0;
  for (let i = 0; i < productNumber.length; i++) {
    hash = productNumber.charCodeAt(i) + ((hash << 5) - hash);
  }
  const isPrinter = category === "printer" || category === "copier";
  const isAccessory = category === "accessory";
  const base = isAccessory ? 2500 : isPrinter ? 12000 : 45000;
  const variance = Math.abs(hash % 15) * 2000;
  const price = base + variance + 999;
  const originalPrice = hash % 2 === 0 ? Math.round(price * 1.15) : undefined;
  return { price, originalPrice };
}

export function mapItemToProduct(
  item: RawCatalogItem,
  opts: {
    catalogName?: string;
    content?: ParsedContent;
    images?: ParsedImage[];
  } = {}
): Product {
  const { content, images, catalogName } = opts;
  const name = content?.name || item.longName || item.shortName || item.productNumber;
  const category = deriveCategory({ catalogName, name, contentCategory: content?.category });

  const unitPrice = item.price?.unitPrice ?? 0;
  const listPrice = item.price?.listPrice;
  let price = Math.round(unitPrice * USD_TO_INR);
  let originalPrice = listPrice ? Math.round(listPrice * USD_TO_INR) : undefined;

  if (price === 0) {
    const fallback = fallbackPrice(item.productNumber, category);
    price = fallback.price;
    originalPrice = fallback.originalPrice;
  }

  const specs: Product["specs"] =
    content?.specifications?.map((s) => ({ label: s.name, value: s.value, groupName: s.groupName })) ?? [];

  const productImages = images?.map((img) => img.url) ?? [];

  return {
    id: item.productNumber,
    slug: buildProductSlug(name, item.productNumber),
    productNumber: item.productNumber,
    name,
    series: content?.series || "HP",
    tagline: content?.shortDescription ?? "",
    description:
      content?.longDescription || content?.shortDescription || "",
    price,
    originalPrice,
    category,
    plcStatus: content?.plcStatus,
    colors: [{ name: "Default", hex: "#1a1a2e" }],
    configs: [{ ram: "—", storage: "—", price }],
    specs,
    images: productImages,
    highlights: content?.highlights && content.highlights.length > 0 ? content.highlights : undefined,
    inBox: [],
  };
}
