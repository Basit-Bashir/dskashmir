import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CollectionsClient from "./CollectionsClient";
import { fetchCatalogSummary } from "@/lib/hp-api";
import { COLLECTIONS_PAGE_SIZE } from "@/lib/hp-catalogs";

export const metadata: Metadata = {
  title: "Shop All HP Collections — Laptops, Printers & Accessories",
  description:
    "Explore the full DSK collection of premium HP technology. From the versatile Spectre x360 to powerful Omen gaming rigs and professional LaserJet printers.",
  openGraph: {
    title: "The Collection | DSK HP Store",
    description: "Curated selection of HP's finest technology.",
    url: "https://dskashmir.com/collections",
  },
};

export default async function CollectionsPage() {
  const { products, total, catalogReferences } = await fetchCatalogSummary({
    pageNumber: 1,
    pageSize: COLLECTIONS_PAGE_SIZE,
  });

  return (
    <>
      <Navbar />
      <CollectionsClient
        initialProducts={products}
        totalCount={total}
        initialCatalogReferences={catalogReferences}
      />
      <Footer />
    </>
  );
}