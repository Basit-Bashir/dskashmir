"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import EnquiryForm from "./EnquiryForm";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Shown above the form, e.g. "HP Color LaserJet CP3505x Printer (CB444A)". */
  productLabel?: string;
  defaultMessage?: string;
}

export default function EnquiryModal({ isOpen, onClose, productLabel, defaultMessage }: EnquiryModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-hp-black/50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 md:p-10 relative shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-hp-gray hover:text-hp-black transition-colors"
              aria-label="Close"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            <p className="eyebrow mb-2">Enquire Now</p>
            <h2 className="font-serif text-2xl font-light text-hp-black mb-1">Request pricing & availability</h2>
            {productLabel && <p className="text-sm text-hp-gray font-light mb-6">{productLabel}</p>}

            <EnquiryForm defaultSubject="Product Enquiry" defaultMessage={defaultMessage} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
