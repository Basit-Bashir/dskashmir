"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import EnquiryForm from "@/components/contact/EnquiryForm";

export default function ContactClient() {
  return (
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
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
