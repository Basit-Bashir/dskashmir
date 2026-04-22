import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us — DSK HP Support & Inquiries",
  description: "Get in touch with DSK for premium HP technology support, sales inquiries, or general questions. Visit our office in Srinagar or reach out via email/phone.",
  openGraph: {
    title: "Contact DSK | HP Authorized Store",
    description: "Expert assistance for all your HP technology needs.",
    url: "https://dsk-hp-store.vercel.app/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <ContactClient />
      <Footer />
    </>
  );
}
