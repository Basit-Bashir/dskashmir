/**
 * Maps the site's internal product category (used by collection pills, etc.)
 * to the HP catalog(s) that back it. The storefront only has two live
 * catalogs today: "Laptops" and "Printers".
 */

export type HPCatalogName = "Laptops" | "Printers";

export function catalogsForCategory(category?: string): HPCatalogName[] {
  if (category === "printer" || category === "copier") return ["Printers"];
  if (!category || category === "all") return ["Laptops", "Printers"];
  return ["Laptops"];
}
