export type Product = {
  id: string;
  slug: string;
  productNumber?: string; // HP Hermes product number — present for API-sourced products
  name: string;
  series: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  badge?: "New" | "Best Seller" | "Limited" | "Sale";
  category:
    | "ultrabook"
    | "business"
    | "creator"
    | "gaming"
    | "desktop"
    | "accessory"
    | "printer"
    | "copier";
  colors: { name: string; hex: string }[];
  configs: { ram: string; storage: string; price: number }[];
  specs: { label: string; value: string }[];
  images: string[]; // placeholder paths
  rating: number;
  reviewCount: number;
  inBox: string[];
};
