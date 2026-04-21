import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSK — Premium Technology",
  description: "Discover HP's finest laptops, desktops, and accessories. Engineered for the extraordinary.",
  openGraph: {
    title: "DSK",
    description: "Premium HP technology, curated for those who demand the best.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
