"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PressPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="section-pad py-16 md:py-24">
          <div className="max-content max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl font-light mb-12">Press & Media</h1>
            
            <div className="space-y-12">
              {[
                { date: "Oct 12, 2024", title: "DSK Announces Exclusive Partnership with HP for Premium Series", category: "Corporate" },
                { date: "Sep 28, 2024", title: "The New Spectre x360: A Masterclass in Design and Detail", category: "Product Launch" },
                { date: "Aug 15, 2024", title: "DSK Commits to 100% Sustainable Packaging by 2025", category: "Sustainability" },
              ].map((news) => (
                <div key={news.title} className="group cursor-pointer">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-hp-blue font-medium mb-3">
                    {news.category} · {news.date}
                  </p>
                  <h2 className="font-serif text-2xl font-light group-hover:text-hp-blue transition-colors">
                    {news.title}
                  </h2>
                  <div className="w-full h-px bg-hp-light mt-8" />
                </div>
              ))}
            </div>

            <div className="mt-16 p-8 bg-hp-cream">
              <h3 className="text-[11px] tracking-[0.1em] uppercase font-semibold text-hp-black mb-4">Media Inquiries</h3>
              <p className="text-sm text-hp-gray font-light mb-6">
                For all press inquiries, high-resolution imagery, and product loan requests, please contact:
              </p>
              <a href="mailto:press@dsk.in" className="text-hp-black font-medium border-b border-hp-black pb-1 hover:text-hp-blue hover:border-hp-blue transition-colors">
                press@dsk.in
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
