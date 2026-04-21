"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SizeGuidePage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="section-pad py-16 md:py-24">
          <div className="max-content max-w-4xl">
            <h1 className="font-serif text-4xl md:text-5xl font-light mb-8">Technical Guide</h1>
            <p className="text-hp-gray font-light mb-12 max-w-2xl">
              Selecting the right display size and configuration is essential for your workflow. 
              Use this guide to understand the physical dimensions and capabilities of our collection.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <section className="space-y-6">
                <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black">Ultra-Portables (13" - 14")</h2>
                <div className="bg-hp-cream p-6 rounded-sm">
                  <ul className="space-y-4 text-sm font-light text-hp-gray">
                    <li><strong>Ideal for:</strong> Remote professionals, travel, and light creative work.</li>
                    <li><strong>Weight:</strong> Typically 0.9kg - 1.4kg.</li>
                    <li><strong>Typical Specs:</strong> Intel Core Ultra 5/7, 16GB RAM.</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black">Workstations (15" - 17")</h2>
                <div className="bg-hp-cream p-6 rounded-sm">
                  <ul className="space-y-4 text-sm font-light text-hp-gray">
                    <li><strong>Ideal for:</strong> Designers, developers, and competitive gamers.</li>
                    <li><strong>Weight:</strong> Typically 1.8kg - 2.5kg.</li>
                    <li><strong>Typical Specs:</strong> Intel Core i9 / Ryzen 9, Dedicated RTX GPU.</li>
                  </ul>
                </div>
              </section>
            </div>

            <div className="mt-16 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-hp-black">
                    <th className="py-4 text-[10px] uppercase tracking-widest font-medium text-hp-gray w-1/3">Series</th>
                    <th className="py-4 text-[10px] uppercase tracking-widest font-medium text-hp-gray">Display Size</th>
                    <th className="py-4 text-[10px] uppercase tracking-widest font-medium text-hp-gray">Best For</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-light text-hp-gray">
                  <tr className="border-b border-hp-light">
                    <td className="py-4 font-medium text-hp-black">Spectre</td>
                    <td className="py-4">14" OLED</td>
                    <td className="py-4">Versatility & Premium Design</td>
                  </tr>
                  <tr className="border-b border-hp-light">
                    <td className="py-4 font-medium text-hp-black">Envy</td>
                    <td className="py-4">16" IPS</td>
                    <td className="py-4">Content Creation</td>
                  </tr>
                  <tr className="border-b border-hp-light">
                    <td className="py-4 font-medium text-hp-black">EliteBook</td>
                    <td className="py-4">14" WUXGA</td>
                    <td className="py-4">Business & Privacy</td>
                  </tr>
                  <tr className="border-b border-hp-light">
                    <td className="py-4 font-medium text-hp-black">Omen</td>
                    <td className="py-4">16.1" QHD</td>
                    <td className="py-4">High-Performance Gaming</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
