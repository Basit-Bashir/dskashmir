"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface EnquiryFormProps {
  /** Preselects the Subject dropdown, e.g. "Product Enquiry". */
  defaultSubject?: string;
  /** Prefills the message textarea, e.g. with the product being enquired about. */
  defaultMessage?: string;
}

const SUBJECTS = ["General Inquiry", "Product Enquiry", "Technical Support", "Order Status", "Press Inquiry"];

export default function EnquiryForm({ defaultSubject, defaultMessage }: EnquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-12">
        <CheckCircle2 size={40} className="text-hp-blue mb-4" strokeWidth={1.5} />
        <p className="font-serif text-xl font-light text-hp-black mb-2">Thank you.</p>
        <p className="text-sm text-hp-gray font-light max-w-xs">
          Your enquiry has been noted. One of our specialists will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] tracking-widest uppercase font-medium text-hp-black mb-2 block">
            First Name
          </label>
          <input
            type="text"
            required
            className="w-full border-b border-hp-light py-2 focus:border-hp-blue outline-none transition-colors font-light text-sm"
          />
        </div>
        <div>
          <label className="text-[10px] tracking-widest uppercase font-medium text-hp-black mb-2 block">
            Last Name
          </label>
          <input
            type="text"
            className="w-full border-b border-hp-light py-2 focus:border-hp-blue outline-none transition-colors font-light text-sm"
          />
        </div>
      </div>
      <div>
        <label className="text-[10px] tracking-widest uppercase font-medium text-hp-black mb-2 block">
          Email Address
        </label>
        <input
          type="email"
          required
          className="w-full border-b border-hp-light py-2 focus:border-hp-blue outline-none transition-colors font-light text-sm"
        />
      </div>
      <div>
        <label className="text-[10px] tracking-widest uppercase font-medium text-hp-black mb-2 block">
          Phone
        </label>
        <input
          type="tel"
          className="w-full border-b border-hp-light py-2 focus:border-hp-blue outline-none transition-colors font-light text-sm"
        />
      </div>
      <div>
        <label className="text-[10px] tracking-widest uppercase font-medium text-hp-black mb-2 block">
          Subject
        </label>
        <select
          defaultValue={defaultSubject || SUBJECTS[0]}
          className="w-full border-b border-hp-light py-2 focus:border-hp-blue outline-none transition-colors font-light text-sm bg-transparent"
        >
          {SUBJECTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-[10px] tracking-widest uppercase font-medium text-hp-black mb-2 block">
          Message
        </label>
        <textarea
          rows={4}
          defaultValue={defaultMessage}
          className="w-full border-b border-hp-light py-2 focus:border-hp-blue outline-none transition-colors font-light text-sm resize-none"
        />
      </div>
      <button className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
        Send Enquiry <ArrowRight size={14} />
      </button>
    </form>
  );
}
