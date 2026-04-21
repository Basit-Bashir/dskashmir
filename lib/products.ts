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
  category: "ultrabook" | "business" | "creator" | "gaming" | "desktop" | "accessory" | "printer" | "copier";
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
    price: 164999,
    originalPrice: 184999,
    badge: "New",
    category: "ultrabook",
    colors: [
      { name: "Nightfall Black", hex: "#1a1a2e" },
      { name: "Poseidon Blue",   hex: "#1b4f72" },
      { name: "Natural Silver",  hex: "#c0c0c0" },
    ],
    configs: [
      { ram: "16GB", storage: "512GB", price: 164999 },
      { ram: "16GB", storage: "1TB",   price: 179999 },
      { ram: "32GB", storage: "1TB",   price: 194999 },
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
    price: 129999,
    badge: "Best Seller",
    category: "creator",
    colors: [
      { name: "Meteor Silver", hex: "#9EA3A8" },
      { name: "Warm Gold",     hex: "#C8A96E" },
    ],
    configs: [
      { ram: "16GB", storage: "512GB", price: 129999 },
      { ram: "32GB", storage: "1TB",   price: 149999 },
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
    price: 114999,
    badge: "New",
    category: "business",
    colors: [
      { name: "Pike Silver", hex: "#8C9099" },
      { name: "Black",       hex: "#1C1C1C" },
    ],
    configs: [
      { ram: "16GB", storage: "256GB", price: 114999 },
      { ram: "32GB", storage: "512GB", price: 134999 },
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
    price: 149999,
    badge: "Limited",
    category: "gaming",
    colors: [{ name: "Shadow Black", hex: "#0D0D0D" }],
    configs: [
      { ram: "16GB", storage: "512GB", price: 149999 },
      { ram: "32GB", storage: "1TB",   price: 169999 },
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
    price: 189999,
    badge: "New",
    category: "business",
    colors: [
      { name: "Slate Blue", hex: "#3B5BDB" },
      { name: "Sparkling Black", hex: "#1A1A1A" },
    ],
    configs: [
      { ram: "16GB", storage: "512GB", price: 189999 },
      { ram: "32GB", storage: "1TB",   price: 219999 },
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
    price: 79999,
    originalPrice: 89999,
    badge: "Sale",
    category: "ultrabook",
    colors: [
      { name: "Warm Gold",  hex: "#C8A96E" },
      { name: "Cool Silver", hex: "#A8B4BE" },
    ],
    configs: [
      { ram: "8GB",  storage: "512GB", price: 79999 },
      { ram: "16GB", storage: "512GB", price: 94999 },
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
  {
    id: "7",
    slug: "laserjet-pro-m404dn",
    name: "LaserJet Pro M404dn",
    series: "HP LaserJet Series",
    tagline: "Built to Keep You Moving",
    description:
      "A laser printer designed to let you focus your time where it’s most effective-helping to grow your business and staying ahead of the competition.",
    price: 34999,
    originalPrice: 39999,
    category: "printer",
    colors: [{ name: "Professional White", hex: "#F3F4F6" }],
    configs: [{ ram: "256MB", storage: "Flash", price: 34999 }],
    specs: [
      { label: "Function",    value: "Print only" },
      { label: "Speed",       value: "Up to 40 ppm" },
      { label: "Resolution",  value: "1200 x 1200 dpi" },
      { label: "Connectivity", value: "USB, Ethernet" },
    ],
    images: ["/images/printer-1.jpg"],
    rating: 4.8,
    reviewCount: 850,
    inBox: ["HP LaserJet Pro M404dn", "Preinstalled HP Black LaserJet Toner Cartridge", "Power Cord"],
  },
  {
    id: "8",
    slug: "smart-tank-580",
    name: "Smart Tank 580",
    series: "HP Smart Tank Series",
    tagline: "Smart Printing, Exceptional Savings",
    description:
      "Get reliable, high-quality printing with an ultra-low cost per page. Integrated ink tanks and an automatic ink sensor for a mess-free, high-volume printing experience.",
    price: 18999,
    badge: "Best Seller",
    category: "printer",
    colors: [{ name: "Basalt", hex: "#4B5563" }],
    configs: [{ ram: "64MB", storage: "None", price: 18999 }],
    specs: [
      { label: "Function",    value: "Print, Scan, Copy" },
      { label: "Speed",       value: "Up to 12 ppm" },
      { label: "Resolution",  value: "4800 x 1200 optimized dpi" },
      { label: "Connectivity", value: "Wi-Fi, USB, Bluetooth" },
    ],
    images: ["/images/printer-2.jpg"],
    rating: 4.6,
    reviewCount: 1240,
    inBox: ["HP Smart Tank 580", "HP GT53XL Black Original Ink Bottle", "HP GT52 Cyan/Magenta/Yellow Ink Bottles"],
  },
  {
    id: "9",
    slug: "laserjet-managed-mfp-m725dn",
    name: "LaserJet Managed MFP M725dn",
    series: "HP LaserJet Managed Series",
    tagline: "Large-format Printing, Manageable Costs",
    description:
      "Empower teams to do more—print, scan, copy, and fax on paper sizes up to A3—from a desktop-sized MFP. Focus on business while simplifying printing tasks.",
    price: 245000,
    badge: "Limited",
    category: "copier",
    colors: [{ name: "Office Grey", hex: "#D1D5DB" }],
    configs: [{ ram: "1GB", storage: "320GB HDD", price: 245000 }],
    specs: [
      { label: "Function",    value: "Print, Copy, Scan, Fax" },
      { label: "Speed",       value: "Up to 41 ppm" },
      { label: "Max Paper",   value: "A3 (11 x 17 in)" },
      { label: "Duty Cycle",  value: "Up to 200,000 pages" },
    ],
    images: ["/images/copier-1.jpg"],
    rating: 4.9,
    reviewCount: 15,
    inBox: ["HP LaserJet Managed MFP M725dn", "HP Black LaserJet Toner Cartridge", "Power Cord"],
  },
  {
    id: "10",
    slug: "thunderbolt-dock-g4",
    name: "Thunderbolt Dock G4",
    series: "HP Accessories",
    tagline: "The Dock That Does It All",
    description:
      "Connect and protect your fleet with a dock that delivers multi-OS compatibility and powerful security. Boost productivity with high-speed data transfers and 4K display support.",
    price: 24999,
    category: "accessory",
    colors: [{ name: "Black", hex: "#000000" }],
    configs: [{ ram: "N/A", storage: "N/A", price: 24999 }],
    specs: [
      { label: "Ports",       value: "Thunderbolt 4, USB-C, HDMI, DP, RJ-45" },
      { label: "Power",       value: "120W / 280W Delivery" },
      { label: "Resolution",  value: "Supports up to 4x 4K displays" },
    ],
    images: ["/images/accessory-1.jpg"],
    rating: 4.7,
    reviewCount: 312,
    inBox: ["HP Thunderbolt Dock 120W G4", "Power Adapter", "Warranty"],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}
