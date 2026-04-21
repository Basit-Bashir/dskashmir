"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function WarrantyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="section-pad py-16 md:py-24">
          <div className="max-content max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl font-light mb-12">Warranty & Support</h1>
            
            <div className="space-y-12">
              <section>
                <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black mb-6">Standard 2-Year Warranty</h2>
                <div className="space-y-4 text-hp-gray font-light leading-relaxed">
                  <p>
                    Every DSK device comes with our comprehensive 2-year limited hardware warranty. 
                    This covers any defects in materials or workmanship under normal use during the warranty period.
                  </p>
                  <p>
                    During the warranty period, DSK will repair or replace, at no charge, products or parts 
                    of a product that prove defective because of improper material or workmanship.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black mb-6">Technical Support</h2>
                <p className="text-hp-gray font-light leading-relaxed">
                  As a DSK owner, you have access to prioritized technical support. Our specialists 
                  are available via phone, email, or live chat to help you get the most out of your technology.
                </p>
              </section>

              <section>
                <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black mb-6">Exclusions</h2>
                <p className="text-hp-gray font-light leading-relaxed">
                  The warranty does not cover any problem that is caused by conditions, malfunctions or 
                  damage not resulting from defects in material or workmanship, such as accidental damage, 
                  liquid spills, or unauthorized modifications.
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
