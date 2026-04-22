import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dsk-hp-store.vercel.app"),
  title: {
    default: "DSK — Premium HP Technology Store",
    template: "%s | DSK"
  },
  description: "Experience the pinnacle of HP technology. Shop HP Spectre, Envy, EliteBook, and Omen series at DSK. Premium authorized retailer for HP laptops, printers, and accessories.",
  keywords: ["HP Store", "DSK HP", "HP Laptops", "HP Spectre x360", "HP Envy", "HP Omen Gaming", "HP Business Laptops", "LaserJet Printers", "HP Accessories"],
  authors: [{ name: "DSK" }],
  creator: "DSK",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://dsk-hp-store.vercel.app",
    siteName: "DSK HP Store",
    title: "DSK — Premium HP Technology",
    description: "Discover HP's finest laptops, desktops, and accessories. Engineered for the extraordinary.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DSK HP Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DSK — Premium HP Technology",
    description: "Experience HP's most refined lineup at DSK.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { CartProvider } from "@/lib/context/CartContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
