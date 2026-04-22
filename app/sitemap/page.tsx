import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SitemapClient from "./SitemapClient";

export const metadata: Metadata = {
  title: "Sitemap — Browse All Pages & Products",
  description: "A comprehensive map of the DSK HP Store. Find products, collections, and informational pages quickly and easily.",
  openGraph: {
    title: "Sitemap | DSK HP Store",
    description: "Complete index of the DSK technology boutique.",
    url: "https://dsk-hp-store.vercel.app/sitemap",
  },
};

export default function SitemapPage() {
  return (
    <>
      <Navbar />
      <SitemapClient />
      <Footer />
    </>
  );
}
