"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ShippingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="section-pad py-16 md:py-24">
          <div className="max-content max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl font-light mb-12">Shipping & Returns</h1>
            
            <div className="space-y-12">
              <section>
                <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black mb-6">Shipping Delivery</h2>
                <div className="space-y-4 text-hp-gray font-light leading-relaxed">
                  <p>
                    DSK offers complimentary standard shipping on all orders over ₹40,000 within India. 
                    Standard delivery typically takes 3-5 business days.
                  </p>
                  <p>
                    For orders below ₹40,000, a flat shipping rate of ₹999 applies. 
                    Express shipping is available for select locations and will be calculated at checkout.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black mb-6">Order Tracking</h2>
                <p className="text-hp-gray font-light leading-relaxed">
                  Once your order has been dispatched, you will receive a confirmation email containing 
                  your tracking number and a link to trace your shipment.
                </p>
              </section>

              <section>
                <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-hp-black mb-6">Returns & Exchanges</h2>
                <div className="space-y-4 text-hp-gray font-light leading-relaxed">
                  <p>
                    We want you to be completely satisfied with your DSK purchase. If for any reason 
                    you are not, you may return the product within 14 days of receipt for a full refund.
                  </p>
                  <p>
                    Items must be in their original, unopened packaging with all accessories and docs. 
                    To initiate a return, please contact our concierge team at DSK5576@GMAIL.COM.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
