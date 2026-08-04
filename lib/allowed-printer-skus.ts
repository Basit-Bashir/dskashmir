import type { Product } from "./products";

/**
 * 189 Commercial Printer SKUs extracted from DSK commercial spreadsheets.
 */
export const ALLOWED_PRINTER_SKUS: string[] = [
  "1F3W2A", "1F3W3A", "1F3Y2A", "1F3Y4A", "1PS54A", "1PV64A", "1PV87A", "20G05A", "20G06A", "20G07A",
  "20G08A", "28C12A", "2Z613A", "2Z614A", "2Z615A", "2Z632A", "2Z633A", "2Z634A", "2ZN49A", "2ZN50A",
  "3G635A", "3G636A", "3G658A", "3GY10A", "3GY12A", "3GY14A", "3GY15A", "3GY16A", "3GY17A", "3PZ35A",
  "3PZ75A", "3QA35A", "3QA55A", "3QA75A", "3SJ00A", "3SJ01A", "3SJ02A", "3SJ03A", "3SJ07A", "3SJ08A",
  "3SJ09A", "3SJ11A", "3SJ12A", "3SJ13A", "3SJ19A", "3SJ20A", "3SJ21A", "3SJ22A", "3SJ28A", "3SJ30A",
  "3SJ34A", "3SJ36A", "3SJ38A", "404L7C", "405W2C", "499M6A", "499N4A", "4A8D4A", "4A8D7A", "4A8D9A",
  "4A8R9A", "4A8S2A", "4A8S4A", "4D047C", "4RA89A", "4SB24A", "4U552C", "4WF66A", "4ZB95A", "4ZB96A",
  "537P5C", "53P41A", "53X74A", "53X75A", "53X76A", "54R50B", "54R53B", "54R58B", "588J8B", "588L3D",
  "58R10A", "5D174A", "5D1C1A", "5HH48A", "5HH65A", "5HH67A", "5QJ81A", "5QK15A", "60K34B", "6BS58A",
  "6BS59A", "6FW06A", "6FW07A", "6FW08A", "6FW09A", "6FW10A", "6GW46A", "6GW47A", "6GW48A", "6GW49A",
  "6GW50A", "6GW51A", "6GW52A", "6GW53A", "6GW54A", "6GW55A", "6GW56A", "6GW57A", "6GW58A", "6GW64A",
  "6GX04A", "6GX06A", "6QN28A", "6QN29A", "6QN33A", "6QN35A", "6QN36A", "6QP97A", "6QP98A", "6UU46A",
  "6UU47A", "6UU48A", "714Z8A", "714Z8A", "714Z9A", "714Z9A", "715A2A", "715A2A", "715A3A",
  "715A3A", "715A4A", "715A4A", "715A5A", "715A5A", "7PS84A", "7PS86A", "7PS94A", "7PS97A",
  "7PS98A", "7PS99A", "7PT00A", "7WQ06B", "89F95A", "8AF43A", "8AF44A", "8AF45A", "8AF48A", "8AF52A",
  "8Q4W0A", "8Q4W1A", "8Q4W2A", "A24J8B", "A24J9A", "A2W75A", "A3E42A", "A58WCA", "A58WCA",
  "A58WFA", "A58WFA", "A58WGA", "A58WGA", "A58WHA", "A58WHA", "A58WKA", "A58WKA",
  "A58WLA", "A58WLA", "A58WMA", "A58WMA", "A58WPA", "A58WPA", "AJ4W9B", "AJ4X0B", "B6S02A",
  "CE711A", "CE712A", "CF066A", "CF067A", "CF068A", "CF236A", "CF238A", "J8H61A", "L2757A", "L2762A",
  "L2763A", "W1A24A", "X0R64A", "X0R65A", "Y1F97A"
];

export const PRINTER_SKU_SET: Set<string> = new Set(
  ALLOWED_PRINTER_SKUS.map((sku) => sku.trim().toUpperCase())
);

const PRINTER_DEVICE_REGEX = /\b(printer|printers|copier|copiers|mfp|multifunction|laserjet|deskjet|inkjet|smart\s*tank|officejet|pagewide|designjet|neverstop|photosmart|sprocket|scanjet|plotter)\b/i;

const SUPPLY_ACCESSORY_REGEX = /\b(cartridge|cartridges|toner|toners|paper|carepack|adapter|cable|dock|printhead|drum|fuser|maintenance\s*kit)\b/i;

/**
 * Checks whether a catalog name represents a printer catalog.
 */
export function isPrinterCatalog(catalogName?: string): boolean {
  if (!catalogName) return false;
  const name = catalogName.toLowerCase().replace(/[\s-]+/g, "_");
  return (
    name === "printers" ||
    name === "laserjet_multifunction_printers" ||
    name === "inkjet_multifunction_printers" ||
    name === "pagewide_printers" ||
    name === "designjet_printers" ||
    name === "industrial_printers" ||
    name === "scanners"
  );
}

/**
 * Checks whether a Product object represents a printer, copier, scanner, or print device.
 */
export function isPrinterProduct(product: {
  category?: string;
  subCategory?: string;
  name?: string;
  description?: string;
}): boolean {
  if (!product) return false;

  const cat = (product.category || "").toLowerCase();
  if (cat === "printer" || cat === "copier" || cat === "printers") return true;

  const text = `${product.name || ""} ${product.description || ""}`.toLowerCase();

  if (SUPPLY_ACCESSORY_REGEX.test(text) && !text.includes("all-in-one") && !text.includes("mfp")) {
    return false;
  }

  return PRINTER_DEVICE_REGEX.test(text);
}

/**
 * Normalizes SKU comparison (trim whitespace, handle uppercase, option suffixes like #460).
 */
export function isAllowedPrinterSku(sku?: string | null): boolean {
  if (!sku) return false;
  const cleanSku = sku.trim().toUpperCase();
  if (!cleanSku) return false;
  const baseSku = cleanSku.split("#")[0].trim();
  return PRINTER_SKU_SET.has(cleanSku) || PRINTER_SKU_SET.has(baseSku);
}

/**
 * Filters out any printer products that are not present in ALLOWED_PRINTER_SKUS.
 * Non-printer products are passed through unchanged.
 */
export function sanitizeProducts(products: Product[], catalogName?: string): Product[] {
  return products.filter((p) => {
    const isPrinter = isPrinterCatalog(catalogName) || isPrinterProduct(p);
    if (!isPrinter) return true;
    const sku = p.productNumber || p.id;
    return isAllowedPrinterSku(sku);
  });
}
