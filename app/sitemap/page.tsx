import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SitemapClient from "./SitemapClient";
import { fetchCatalogSummary } from "@/lib/hp-api";

export const metadata: Metadata = {
  title: "Sitemap — Browse All Pages & Products",
  description: "A comprehensive map of the DSK HP Store. Find products, collections, and informational pages quickly and easily.",
  openGraph: {
    title: "Sitemap | DSK HP Store",
    description: "Complete index of the DSK technology boutique.",
    url: "https://dsk-hp-store.vercel.app/sitemap",
  },
};

export default async function SitemapPage() {
  const { products } = await fetchCatalogSummary({ catalogName: "Laptops", pageSize: 1000 });

  return (
    <>
      <Navbar />
      <SitemapClient products={products} />
      <Footer />
    </>
  );
}
