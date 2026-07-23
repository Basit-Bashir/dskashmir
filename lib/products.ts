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
  badge?: "New" | "Best Seller" | "Limited" | "Sale" | string;
  plcStatus?: string;
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
  specs: { label: string; value: string; groupName?: string }[];
  images: string[];
  richMedia?: Array<{ title?: string; type?: string; url?: string; description?: string }>;
  companions?: Array<{ sku: string; name?: string; category?: string }>;
  documents?: Array<{ title?: string; url: string; format?: string; type?: string }>;
  hierarchyPath?: string[];
  rating: number;
  reviewCount: number;
  inBox: string[];
};
