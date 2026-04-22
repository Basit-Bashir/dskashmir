import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About DSK — Our Heritage & Philosophy",
  description: "Learn about DSK's commitment to excellence and our partnership with HP. Discover how we curate the finest technology experiences since our founding.",
  openGraph: {
    title: "Our Story | DSK HP Store",
    description: "Crafting the future of excellence in technology.",
    url: "https://dsk-hp-store.vercel.app/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <AboutClient />
      <Footer />
    </>
  );
}
