import type { Product } from "./products";

/**
 * 257 Supplies SKUs extracted from DSK commercial spreadsheet Sheet 3.
 */
export const ALLOWED_SUPPLIES_SKUS: string[] = [
  "3KR68A", "3KR69A", "3MZ76A", "3WT88A", "3WT88MC", "3WT89A", "3WT89MC", "3WT90A", "430H4A", "4C8T4A",
  "4YL17A", "4YL17MC", "527F9A", "527G1A", "527G3A", "527G4MC", "527G7A", "527G8A", "527G9A", "527H0MC",
  "527H1MC", "527H2A", "527H3A", "5KZ38A", "5PN52A", "5PN57A", "5PN58A", "5PN59A", "5PN60A", "5PN62A",
  "5PN63A", "5PN64A", "5PN65A", "5PN66A", "5PN67A", "5PN69A", "5PN70A", "5PN72A", "5PN73A", "5PN74A",
  "5PN75A", "5PN77A", "5PN78A", "5PN79A", "5PN80A", "5PN82A", "5PN85A", "5RC00A", "5RC01A", "5RC02A",
  "5RC03A", "6H121A", "6H122A", "6M1P3A", "6SB84A", "6SB85A", "7HA22MC", "7HA23MC", "7QH79A", "8JM70A",
  "8JM71A", "8JM72A", "8JM73A", "8NB97A", "B3M78A", "B5L09A", "B5L36A", "B5L37A", "C1N58A", "C1P70A",
  "C2H57A", "C35T4A", "C35T5A", "C35T6A", "C9153A", "CB389A", "CE247A", "CE249A", "CE254A", "CE265A",
  "CE506A", "CE515A", "CE516A", "CE978A", "CE980A", "CF065A", "CF254A", "CF256A", "CF256X", "CF257A",
  "D7H14A", "F2G77A", "J8J88A", "J8J95A", "L0H25A", "L2718A", "L2748A", "L2756A", "P1B92A", "P1B93A",
  "P1B94A", "Q5422A", "SS778A", "SS834A", "SS855A", "SU437A", "W1002YC", "W1335A", "W1335X", "W1336A",
  "W1336X", "W1B43A", "W1B44A", "W1B45A", "W1B47A", "W5U23A", "W9000MC", "W9001MC", "W9002MC", "W9003MC",
  "W9004MC", "W9005MC", "W9006MC", "W9007MC", "W9008MC", "W9010MC", "W9011MC", "W9012MC", "W9013MC", "W9015MC",
  "W9016MC", "W9017MC", "W9018MC", "W9020MC", "W9021MC", "W9022MC", "W9023MC", "W9024MC", "W9025MC", "W9027MC",
  "W9030MC", "W9031MC", "W9032MC", "W9033MC", "W9035MC", "W9036MC", "W9037MC", "W9044MC", "W9048MC", "W9050MC",
  "W9051MC", "W9052MC", "W9053MC", "W9054MC", "W9055MC", "W9058MC", "W9059MC", "W9060MC", "W9061MC", "W9062MC",
  "W9063MC", "W9065MC", "W9066MC", "W9074MC", "W9075MC", "W9077MC", "W9078MC", "W9085MC", "W9086MC", "W9087MC",
  "W9088MC", "W9090MC", "W9091MC", "W9092MC", "W9093MC", "W9100MC", "W9101MC", "W9102MC", "W9103MC", "W9120MC",
  "W9121MC", "W9122MC", "W9123MC", "W9130MC", "W9131MC", "W9132MC", "W9133MC", "W9150MC", "W9151MC", "W9152MC",
  "W9153MC", "W9170MC", "W9171MC", "W9172MC", "W9173MC", "W9187MC", "W9190MC", "W9191MC", "W9192MC", "W9193MC",
  "W9210MC", "W9211MC", "W9212MC", "W9213MC", "W9215MC", "W9220MC", "W9221MC", "W9222MC", "W9223MC", "W9240MC",
  "W9241MC", "W9242MC", "W9243MC", "W9250MC", "W9251MC", "W9252MC", "W9253MC", "W9260MC", "W9261MC", "W9262MC",
  "W9263MC", "W9270MC", "W9271MC", "W9272MC", "W9273MC", "W9280MC", "W9281MC", "W9282MC", "W9283MC", "Z7Y64A",
  "Z7Y65A", "Z7Y68A", "Z7Y69A", "Z7Y70A", "Z7Y72A", "Z7Y73A", "Z7Y76A", "Z7Y78A", "Z7Y79A", "Z7Y80A",
  "Z7Y81A", "Z7Y82A", "Z7Y83A", "Z7Y85A", "Z7Y88A", "Z7Y90A", "Z7Y91A", "Z8W50A", "Z8W51A", "Z8W52A",
  "Z9M01A", "Z9M02A", "Z9M03A", "Z9M04A", "Z9M05A", "Z9M07A", "Z9M08A"
];

export const SUPPLIES_SKU_SET: Set<string> = new Set(
  ALLOWED_SUPPLIES_SKUS.map((sku) => sku.trim().toUpperCase())
);

/**
 * Checks whether a catalog name represents a Supplies/Toner/Cartridge catalog.
 */
export function isSuppliesCatalog(catalogName?: string): boolean {
  if (!catalogName) return false;
  const name = catalogName.toLowerCase().replace(/[\s-]+/g, "_");
  return (
    name === "supplies" ||
    name === "ink_toner_cartridges" ||
    name === "paper" ||
    name === "printer_supplies"
  );
}

/**
 * Checks whether a Product object represents a Supplies or Toner/Ink item.
 */
export function isSuppliesProduct(product: {
  category?: string;
  subCategory?: string;
  name?: string;
  description?: string;
}): boolean {
  if (!product) return false;

  const cat = (product.category || "").toLowerCase();
  const subCat = (product.subCategory || "").toLowerCase();
  if (
    cat === "supplies" ||
    subCat.includes("toner") ||
    subCat.includes("cartridge") ||
    subCat.includes("ink") ||
    subCat.includes("supplies")
  ) {
    return true;
  }

  const text = `${product.name || ""} ${product.description || ""}`.toLowerCase();
  const SUPPLY_REGEX = /\b(cartridge|cartridges|toner|toners|ink|inkjet|printhead|drum|fuser|maintenance\s*kit|waste\s*toner|transfer\s*belt|staple)\b/i;

  // Make sure it's not an All-in-One printer or MFP device
  if (text.includes("printer") || text.includes("all-in-one") || text.includes("mfp") || text.includes("scanjet")) {
    return false;
  }

  return SUPPLY_REGEX.test(text);
}

/**
 * Normalizes SKU comparison for supplies (trim whitespace, handle uppercase, option suffixes like #460).
 */
export function isAllowedSuppliesSku(sku?: string | null): boolean {
  if (!sku) return false;
  const cleanSku = sku.trim().toUpperCase();
  if (!cleanSku) return false;
  const baseSku = cleanSku.split("#")[0].trim();
  return SUPPLIES_SKU_SET.has(cleanSku) || SUPPLIES_SKU_SET.has(baseSku);
}

/**
 * Filters out any supplies products that are not present in ALLOWED_SUPPLIES_SKUS.
 * Non-supplies products are passed through unchanged.
 */
export function sanitizeSuppliesProducts(products: Product[], catalogName?: string): Product[] {
  return products.filter((p) => {
    const isSupply = isSuppliesCatalog(catalogName) || isSuppliesProduct(p);
    if (!isSupply) return true;
    const sku = p.productNumber || p.id;
    return isAllowedSuppliesSku(sku);
  });
}
