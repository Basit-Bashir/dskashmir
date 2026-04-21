export type Product = {
  id: string;
  slug: string;
  name: string;
  series: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  badge?: "New" | "Best Seller" | "Limited" | "Sale";
  category: "ultrabook" | "business" | "creator" | "gaming" | "desktop" | "accessory";
  colors: { name: string; hex: string }[];
  configs: { ram: string; storage: string; price: number }[];
  specs: { label: string; value: string }[];
  images: string[]; // placeholder paths
  rating: number;
  reviewCount: number;
  inBox: string[];
};

export const PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "spectre-x360-14",
    name: "Spectre x360 14",
    series: "HP Spectre Series",
    tagline: "Power Meets Precision",
    description:
      "The ultimate expression of HP craftsmanship. A convertible ultrabook built for those who refuse to compromise — featuring OLED display technology and Intel's latest Core Ultra processor.",
    price: 1899,
    originalPrice: 2199,
    badge: "New",
    category: "ultrabook",
    colors: [
      { name: "Nightfall Black", hex: "#1a1a2e" },
      { name: "Poseidon Blue",   hex: "#1b4f72" },
      { name: "Natural Silver",  hex: "#c0c0c0" },
    ],
    configs: [
      { ram: "16GB", storage: "512GB", price: 1899 },
      { ram: "16GB", storage: "1TB",   price: 2099 },
      { ram: "32GB", storage: "1TB",   price: 2399 },
    ],
    specs: [
      { label: "Processor",   value: "Intel Core Ultra 7 165H" },
      { label: "Display",     value: "14\" 2.8K OLED, 120Hz" },
      { label: "Graphics",    value: "Intel Arc Graphics" },
      { label: "Battery",     value: "Up to 17 hours" },
      { label: "Weight",      value: "1.41 kg" },
      { label: "OS",          value: "Windows 11 Home" },
    ],
    images: ["/images/spectre-1.jpg", "/images/spectre-2.jpg", "/images/spectre-3.jpg"],
    rating: 4.8,
    reviewCount: 142,
    inBox: ["HP Spectre x360 14", "65W USB-C Slim Adapter", "HP Pen", "Quick Start Guide"],
  },
  {
    id: "2",
    slug: "envy-16",
    name: "Envy 16",
    series: "HP Envy Series",
    tagline: "Create Without Limits",
    description:
      "Built for creators who demand more. A powerhouse with dedicated GPU, stunning display, and studio-grade audio in a premium aluminium chassis.",
    price: 1499,
    badge: "Best Seller",
    category: "creator",
    colors: [
      { name: "Meteor Silver", hex: "#9EA3A8" },
      { name: "Warm Gold",     hex: "#C8A96E" },
    ],
    configs: [
      { ram: "16GB", storage: "512GB", price: 1499 },
      { ram: "32GB", storage: "1TB",   price: 1799 },
    ],
    specs: [
      { label: "Processor",   value: "Intel Core i9-13900H" },
      { label: "Display",     value: "16\" 2.5K IPS, 120Hz" },
      { label: "Graphics",    value: "NVIDIA RTX 4060" },
      { label: "Battery",     value: "Up to 13 hours" },
      { label: "Weight",      value: "2.0 kg" },
      { label: "OS",          value: "Windows 11 Home" },
    ],
    images: ["/images/envy-1.jpg", "/images/envy-2.jpg"],
    rating: 4.7,
    reviewCount: 308,
    inBox: ["HP Envy 16", "200W Power Adapter", "Quick Start Guide"],
  },
  {
    id: "3",
    slug: "elitebook-840",
    name: "EliteBook 840 G11",
    series: "HP EliteBook Series",
    tagline: "Built for Business",
    description:
      "Enterprise-grade reliability meets refined design. MIL-STD-810H certified durability with HP Sure View privacy display and AI-powered collaboration tools.",
    price: 1299,
    badge: "New",
    category: "business",
    colors: [
      { name: "Pike Silver", hex: "#8C9099" },
      { name: "Black",       hex: "#1C1C1C" },
    ],
    configs: [
      { ram: "16GB", storage: "256GB", price: 1299 },
      { ram: "32GB", storage: "512GB", price: 1599 },
    ],
    specs: [
      { label: "Processor",   value: "Intel Core Ultra 5 135U" },
      { label: "Display",     value: "14\" WUXGA IPS, Sure View" },
      { label: "Graphics",    value: "Intel Graphics" },
      { label: "Battery",     value: "Up to 19 hours" },
      { label: "Weight",      value: "1.29 kg" },
      { label: "OS",          value: "Windows 11 Pro" },
    ],
    images: ["/images/elitebook-1.jpg", "/images/elitebook-2.jpg"],
    rating: 4.9,
    reviewCount: 87,
    inBox: ["HP EliteBook 840 G11", "65W USB-C Power Adapter", "Documentation"],
  },
  {
    id: "4",
    slug: "omen-16",
    name: "Omen 16",
    series: "HP Omen Series",
    tagline: "Dominate Every Frame",
    description:
      "Engineered for competitive gaming. Thermal architecture built for sustained performance with RGB keyboard and high-refresh display.",
    price: 1699,
    badge: "Limited",
    category: "gaming",
    colors: [{ name: "Shadow Black", hex: "#0D0D0D" }],
    configs: [
      { ram: "16GB", storage: "512GB", price: 1699 },
      { ram: "32GB", storage: "1TB",   price: 1999 },
    ],
    specs: [
      { label: "Processor",   value: "AMD Ryzen 9 7945HX" },
      { label: "Display",     value: "16.1\" QHD, 165Hz" },
      { label: "Graphics",    value: "NVIDIA RTX 4070" },
      { label: "Battery",     value: "Up to 8 hours" },
      { label: "Weight",      value: "2.4 kg" },
      { label: "OS",          value: "Windows 11 Home" },
    ],
    images: ["/images/omen-1.jpg", "/images/omen-2.jpg"],
    rating: 4.6,
    reviewCount: 214,
    inBox: ["HP Omen 16", "230W Power Adapter", "Quick Start Guide"],
  },
  {
    id: "5",
    slug: "dragonfly-g4",
    name: "Dragonfly G4",
    series: "HP Dragonfly Series",
    tagline: "The World's Best Business Laptop",
    description:
      "Ultra-light. Ultra-secure. The HP Dragonfly G4 weighs under 1kg yet delivers uncompromising performance and all-day battery life.",
    price: 2199,
    badge: "New",
    category: "business",
    colors: [
      { name: "Slate Blue", hex: "#3B5BDB" },
      { name: "Sparkling Black", hex: "#1A1A1A" },
    ],
    configs: [
      { ram: "16GB", storage: "512GB", price: 2199 },
      { ram: "32GB", storage: "1TB",   price: 2599 },
    ],
    specs: [
      { label: "Processor",   value: "Intel Core Ultra 7 165U" },
      { label: "Display",     value: "13.5\" 3:2 OLED, 120Hz" },
      { label: "Graphics",    value: "Intel Arc Graphics" },
      { label: "Battery",     value: "Up to 20 hours" },
      { label: "Weight",      value: "0.99 kg" },
      { label: "OS",          value: "Windows 11 Pro" },
    ],
    images: ["/images/dragonfly-1.jpg", "/images/dragonfly-2.jpg"],
    rating: 4.9,
    reviewCount: 56,
    inBox: ["HP Dragonfly G4", "65W USB-C Adapter", "Sleeve", "Quick Start Guide"],
  },
  {
    id: "6",
    slug: "pavilion-plus-14",
    name: "Pavilion Plus 14",
    series: "HP Pavilion Series",
    tagline: "Everyday Excellence",
    description:
      "Premium performance for everyday life. A beautiful OLED display and all-day battery in a slim, lightweight design.",
    price: 899,
    originalPrice: 999,
    badge: "Sale",
    category: "ultrabook",
    colors: [
      { name: "Warm Gold",  hex: "#C8A96E" },
      { name: "Cool Silver", hex: "#A8B4BE" },
    ],
    configs: [
      { ram: "8GB",  storage: "512GB", price: 899 },
      { ram: "16GB", storage: "512GB", price: 1099 },
    ],
    specs: [
      { label: "Processor",   value: "Intel Core i7-1355U" },
      { label: "Display",     value: "14\" 2.8K OLED, 90Hz" },
      { label: "Graphics",    value: "Intel Iris Xe" },
      { label: "Battery",     value: "Up to 12 hours" },
      { label: "Weight",      value: "1.46 kg" },
      { label: "OS",          value: "Windows 11 Home" },
    ],
    images: ["/images/pavilion-1.jpg"],
    rating: 4.5,
    reviewCount: 421,
    inBox: ["HP Pavilion Plus 14", "45W USB-C Adapter", "Quick Start Guide"],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}
