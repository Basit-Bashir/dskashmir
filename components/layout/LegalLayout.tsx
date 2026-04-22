"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ReactNode } from "react";

interface LegalLayoutProps {
  children: ReactNode;
  title: string;
}

export default function LegalLayout({ children, title }: LegalLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="pt-20 bg-hp-white min-h-screen">
        <section className="section-pad py-16 md:py-24">
          <div className="max-content max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl font-light mb-12 animate-fade-up">
              {title}
            </h1>
            <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
              {children}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
