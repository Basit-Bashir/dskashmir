/**
 * Dynamic HP Catalogs supported by the HP Hermes PDB backend.
 */

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
  if (!category || category === "all") return ["Laptops", "Printers", "Desktops"];
  return [category];
}
