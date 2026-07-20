import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CollectionsClient from "./CollectionsClient";
import { fetchCatalogProducts } from "@/lib/hp-api";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop All HP Collections — Laptops, Printers & Accessories",
  description:
    "Explore the full DSK collection of premium HP technology. From the versatile Spectre x360 to powerful Omen gaming rigs and professional LaserJet printers.",
  openGraph: {
    title: "The Collection | DSK HP Store",
    description: "Curated selection of HP's finest technology.",
    url: "https://dsk-hp-store.vercel.app/collections",
  },
};

export default async function CollectionsPage() {
  const { products: apiProducts, total } = await fetchCatalogProducts({
    pageNumber: 1,
    pageSize: 30,
  });

  // Fall back to static data when the backend is unreachable or returns nothing
  const products = apiProducts.length > 0 ? apiProducts : PRODUCTS;
  const totalCount = apiProducts.length > 0 ? total : PRODUCTS.length;

  return (
    <>
      <Navbar />
      <CollectionsClient
        initialProducts={products}
        totalCount={totalCount}
        usingApiData={apiProducts.length > 0}
      />
      <Footer />
    </>
  );
}