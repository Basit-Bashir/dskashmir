"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="section-pad py-20 bg-hp-cream">
          <div className="max-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

              {/* Info */}
              <div>
                <p className="eyebrow mb-6">Get in Touch</p>
                <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight mb-8">
                  We're here to <span className="text-hp-blue">assist</span> you.
                </h1>
                <p className="text-hp-gray font-light leading-relaxed mb-12 max-w-md">
                  Whether you have a question about our collections or need technical support,
                  our specialists are ready to help.
                </p>

                <div className="space-y-10">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-white flex items-center justify-center flex-shrink-0">
                      <Mail size={20} strokeWidth={1} className="text-hp-blue" />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-widest uppercase font-medium text-hp-black mb-1">Email</p>
                      <p className="text-hp-gray font-light">DSK5576@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-white flex items-center justify-center flex-shrink-0">
                      <Phone size={20} strokeWidth={1} className="text-hp-blue" />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-widest uppercase font-medium text-hp-black mb-1">Phone</p>
                      <p className="text-hp-gray font-light">+91 9596189515, +91 9419055576</p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-white flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} strokeWidth={1} className="text-hp-blue" />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-widest uppercase font-medium text-hp-black mb-1">Office</p>
                      <p className="text-hp-gray font-light">MIR MALL, OPP. DPL KARAN NAGAR, SRINAGAR, J&K, 190010</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="bg-white p-8 md:p-12 shadow-sm">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] tracking-widest uppercase font-medium text-hp-black mb-2 block">
                        First Name
                      </label>
                      <input type="text" className="w-full border-b border-hp-light py-2 focus:border-hp-blue outline-none transition-colors font-light text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] tracking-widest uppercase font-medium text-hp-black mb-2 block">
                        Last Name
                      </label>
                      <input type="text" className="w-full border-b border-hp-light py-2 focus:border-hp-blue outline-none transition-colors font-light text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] tracking-widest uppercase font-medium text-hp-black mb-2 block">
                      Email Address
                    </label>
                    <input type="email" className="w-full border-b border-hp-light py-2 focus:border-hp-blue outline-none transition-colors font-light text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-widest uppercase font-medium text-hp-black mb-2 block">
                      Subject
                    </label>
                    <select className="w-full border-b border-hp-light py-2 focus:border-hp-blue outline-none transition-colors font-light text-sm bg-transparent">
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Order Status</option>
                      <option>Press Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] tracking-widest uppercase font-medium text-hp-black mb-2 block">
                      Message
                    </label>
                    <textarea rows={4} className="w-full border-b border-hp-light py-2 focus:border-hp-blue outline-none transition-colors font-light text-sm resize-none" />
                  </div>
                  <button className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
                    Send Message <ArrowRight size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
