/**
 * Dynamic HP Catalogs supported by the HP Hermes PDB backend.
 */

/**
 * Page size for the /collections grid. Must stay identical between the
 * server-rendered first page and every client-side page change — HP's
 * catalogReference is scoped to the pageSize it was issued with, so mixing
 * sizes across paginated requests returns overlapping/wrong items.
 */
export const COLLECTIONS_PAGE_SIZE = 20;

export type HPCatalogName =
  | "Printers"
  | "Desktops"
  | "Laptops"
  | "Storage"
  | "Solutions"
  | "Software"
  | "Services"
  | "Scanners"
  | "POS"
  | "Monitors"
  | "Supplies"
  | "Industries"
  | "HyperX"
  | "Entertainment"
  | "Accessories"
  | "Desktops_Business"
  | "Workstations"
  | "Desktops_Home"
  | "Laptops_Home"
  | "DesignJet_Printers"
  | "Industrial_Printers"
  | "Carepacks"
  | "Chromebooks"
  | "Ink_Toner_Cartridges"
  | "Printer_Supplies"
  | "Paper";

export function catalogsForCategory(category?: string): string[] {
  if (!category || category === "all") {
    return [
      "Laptops",
      "Printers",
      "Desktops",
      "Monitors",
      "Accessories",
      "Workstations",
      "Storage",
      "Supplies",
    ];
  }
  return [category];
}
