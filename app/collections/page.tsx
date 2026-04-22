import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CollectionsClient from "./CollectionsClient";

export const metadata: Metadata = {
  title: "Shop All HP Collections — Laptops, Printers & Accessories",
  description: "Explore the full DSK collection of premium HP technology. From the versatile Spectre x360 to powerful Omen gaming rigs and professional LaserJet printers.",
  openGraph: {
    title: "The Collection | DSK HP Store",
    description: "Curated selection of HP's finest technology.",
    url: "https://dsk-hp-store.vercel.app/collections",
  },
};

export default function CollectionsPage() {
  return (
    <>
      <Navbar />
      <CollectionsClient />
      <Footer />
    </>
  );
}
