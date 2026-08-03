/**
 * Dynamic HP Catalogs supported by the HP Hermes PDB backend.
 * Full L1 (Main) and L2 (Subcategory) Catalog Mapping Reference.
 */

export const COLLECTIONS_PAGE_SIZE = 20;

export interface HPCatalogRef {
  id: number;
  name: string;
  level: "L1" | "L2";
  path: string;
  subcategories?: Record<string, HPCatalogRef>;
}

export const HP_CATALOG_MAPPINGS: Record<string, HPCatalogRef> = {
  Laptops: {
    id: 35,
    name: "Laptops",
    level: "L1",
    path: "Root/Live Catalogs/L1 - Live - Product Type Catalogs/",
    subcategories: {
      Laptops_Business: { id: 13, name: "Laptops_Business", level: "L2", path: "Root/Live Catalogs/L2 - Live - Product Category Catalogs/PS/" },
      Laptops_Home: { id: 14, name: "Laptops_Home", level: "L2", path: "Root/Live Catalogs/L2 - Live - Product Category Catalogs/PS/" },
      Chromebooks: { id: 31, name: "Chromebooks", level: "L2", path: "Root/Live Catalogs/L2 - Live - Product Category Catalogs/PS/" },
    },
  },
  Desktops: {
    id: 36,
    name: "Desktops",
    level: "L1",
    path: "Root/Live Catalogs/L1 - Live - Product Type Catalogs/",
    subcategories: {
      Desktops_Business: { id: 3, name: "Desktops_Business", level: "L2", path: "Root/Live Catalogs/L2 - Live - Product Category Catalogs/PS/" },
      Workstations: { id: 4, name: "Workstations", level: "L2", path: "Root/Live Catalogs/L2 - Live - Product Category Catalogs/PS/" },
      Desktops_Home: { id: 5, name: "Desktops_Home", level: "L2", path: "Root/Live Catalogs/L2 - Live - Product Category Catalogs/PS/" },
      Thin_Clients: { id: 6, name: "Thin_Clients", level: "L2", path: "Root/Live Catalogs/L2 - Live - Product Category Catalogs/PS/" },
    },
  },
  Printers: {
    id: 37,
    name: "Printers",
    level: "L1",
    path: "Root/Live Catalogs/L1 - Live - Product Type Catalogs/",
    subcategories: {
      LaserJet_Multifunction_Printers: { id: 17, name: "LaserJet_Multifunction_Printers", level: "L2", path: "Root/Live Catalogs/L2 - Live - Product Category Catalogs/Print/" },
      InkJet_Multifunction_Printers: { id: 18, name: "InkJet_Multifunction_Printers", level: "L2", path: "Root/Live Catalogs/L2 - Live - Product Category Catalogs/Print/" },
      PageWide_Printers: { id: 19, name: "PageWide_Printers", level: "L2", path: "Root/Live Catalogs/L2 - Live - Product Category Catalogs/Print/" },
      DesignJet_Printers: { id: 20, name: "DesignJet_Printers", level: "L2", path: "Root/Live Catalogs/L2 - Live - Product Category Catalogs/Print/" },
      Industrial_Printers: { id: 21, name: "Industrial_Printers", level: "L2", path: "Root/Live Catalogs/L2 - Live - Product Category Catalogs/Print/" },
    },
  },
  Accessories: {
    id: 2,
    name: "Accessories",
    level: "L1",
    path: "Root/Live Catalogs/L1 - Live - Product Type Catalogs/",
    subcategories: {
      Keyboards_Mice: { id: 27, name: "Keyboards_Mice", level: "L2", path: "Root/Live Catalogs/L2 - Live - Product Category Catalogs/PS/" },
      Docking_Stations: { id: 28, name: "Docking_Stations", level: "L2", path: "Root/Live Catalogs/L2 - Live - Product Category Catalogs/PS/" },
      Chargers_Power_Adaptors: { id: 29, name: "Chargers_Power_Adaptors", level: "L2", path: "Root/Live Catalogs/L2 - Live - Product Category Catalogs/PS/" },
      Carepacks: { id: 30, name: "Carepacks", level: "L2", path: "Root/Live Catalogs/L2 - Live - Product Category Catalogs/PS/" },
    },
  },
  Supplies: {
    id: 12,
    name: "Supplies",
    level: "L1",
    path: "Root/Live Catalogs/L1 - Live - Product Type Catalogs/",
    subcategories: {
      Ink_Toner_Cartridges: { id: 32, name: "Ink_Toner_Cartridges", level: "L2", path: "Root/Live Catalogs/L2 - Live - Product Category Catalogs/Print/" },
      Paper: { id: 33, name: "Paper", level: "L2", path: "Root/Live Catalogs/L2 - Live - Product Category Catalogs/Print/" },
      Printer_Supplies: { id: 34, name: "Printer_Supplies", level: "L2", path: "Root/Live Catalogs/L2 - Live - Product Category Catalogs/Print/" },
    },
  },
};

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
  | "Thin_Clients"
  | "Laptops_Business"
  | "Laptops_Home"
  | "LaserJet_Multifunction_Printers"
  | "InkJet_Multifunction_Printers"
  | "PageWide_Printers"
  | "DesignJet_Printers"
  | "Industrial_Printers"
  | "Keyboards_Mice"
  | "Docking_Stations"
  | "Chargers_Power_Adaptors"
  | "Carepacks"
  | "Chromebooks"
  | "Ink_Toner_Cartridges"
  | "Paper"
  | "Printer_Supplies";

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
