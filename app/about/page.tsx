"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="section-pad py-20 md:py-32 bg-hp-cream">
          <div className="max-content">
            <div className="max-w-3xl">
              <p className="eyebrow mb-6">Our Legacy</p>
              <h1 className="font-serif text-5xl md:text-7xl font-light leading-tight mb-10">
                Crafting the Future of <span className="text-hp-blue">Excellence</span>.
              </h1>
              <p className="text-xl font-light text-hp-gray leading-relaxed">
                DSK was founded on a simple principle: that technology should be as beautiful as it is powerful. 
                As a premier HP partner, we curate the most extraordinary computing experiences for the most 
                discerning users.
              </p>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section id="philosophy" className="section-pad py-24 bg-white">
          <div className="max-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-serif text-4xl font-light mb-8">The DSK Philosophy</h2>
                <div className="space-y-6 text-hp-gray font-light leading-relaxed">
                  <p>
                    We believe that the tools you use define the work you do. That's why we don't just sell 
                    laptops; we provide the instruments of creation and productivity.
                  </p>
                  <p>
                    Every product in our collection is selected for its design integrity, material quality, 
                    and uncompromising performance. From the eco-conscious materials in our Spectre series 
                    to the raw power of the Omen range, excellence is our only standard.
                  </p>
                </div>
              </div>
              <div className="aspect-[4/5] bg-hp-cream flex items-center justify-center p-12">
                <div className="text-center">
                  <p className="font-serif text-3xl text-hp-gray/40">Design First</p>
                  <div className="w-12 h-px bg-hp-blue mx-auto mt-4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sustainability */}
        <section id="sustainability" className="section-pad py-24 bg-hp-black text-hp-white">
          <div className="max-content">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-serif text-4xl font-light mb-8 text-hp-gold">Committed to the Planet</h2>
              <p className="text-hp-white/60 font-light leading-snug mb-10">
                In partnership with HP, DSK is leading the way in sustainable technology. Many of our 
                products are built using ocean-bound plastics and recycled aluminium, ensuring that 
                high performance doesn't come at a high cost to the environment.
              </p>
              <div className="flex justify-center gap-12">
                <div>
                  <p className="font-serif text-4xl font-medium text-hp-white mb-1">95%</p>
                  <p className="text-[10px] tracking-widest uppercase text-hp-white/30">Recyclable Packaging</p>
                </div>
                <div>
                  <p className="font-serif text-4xl font-medium text-hp-white mb-1">2030</p>
                  <p className="text-[10px] tracking-widest uppercase text-hp-white/30">Net Zero Target</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
