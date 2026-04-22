"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/context/CartContext";

const STEPS = ["Shipping", "Payment", "Review", "Confirmation"];

type ShippingData = {
  firstName: string; lastName: string; email: string; phone: string;
  address1: string; address2: string; city: string; state: string;
  zip: string; country: string; shippingMethod: "standard" | "express";
};

const EMPTY_SHIPPING: ShippingData = {
  firstName: "", lastName: "", email: "", phone: "",
  address1: "", address2: "", city: "", state: "", zip: "", country: "US",
  shippingMethod: "standard",
};

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState<ShippingData>(EMPTY_SHIPPING);

  // If express is selected, it costs 1499 (or similar), otherwise 0
  // Standard shipping is free if subtotal > 40000, otherwise 999
  const shippingBase = subtotal >= 40000 ? 0 : 999;
  const shippingExtra = shipping.shippingMethod === "express" ? 1500 : 0;
  const shippingCost = shippingBase + shippingExtra;
  
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shippingCost + tax;

  const update = (field: keyof ShippingData, val: string) =>
    setShipping((prev) => ({ ...prev, [field]: val }));

  if (items.length === 0 && step < 3) {
    return (
      <>
        <Navbar />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-light mb-6">Your cart is empty</h2>
            <Link href="/collections" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <div className="section-pad py-10 md:py-14">
          <div className="max-content">

            {/* Progress bar */}
            <div className="flex items-center justify-center gap-0 mb-12 max-w-xl mx-auto">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300",
                      i < step  ? "bg-hp-blue text-white" :
                      i === step ? "bg-hp-black text-white" :
                                   "bg-hp-light text-hp-gray"
                    )}>
                      {i < step ? <Check size={14} strokeWidth={2.5} /> : i + 1}
                    </div>
                    <span className={cn(
                      "text-[10px] tracking-[0.1em] uppercase font-medium whitespace-nowrap",
                      i === step ? "text-hp-black" : "text-hp-gray"
                    )}>
                      {s}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={cn(
                      "flex-1 h-px mx-3 mb-5 transition-all duration-300",
                      i < step ? "bg-hp-blue" : "bg-hp-light"
                    )} />
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 xl:gap-16">

              {/* Left — Form */}
              <div>
                {/* STEP 0 — Shipping */}
                {step === 0 && (
                  <div>
                    <h2 className="font-serif text-3xl font-light mb-8">Shipping Information</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
                      {[
                        { field: "firstName" as const, label: "First Name", sm: true },
                        { field: "lastName"  as const, label: "Last Name",  sm: true },
                        { field: "email"     as const, label: "Email Address", sm: false },
                        { field: "phone"     as const, label: "Phone Number",  sm: false },
                        { field: "address1"  as const, label: "Address Line 1", sm: false },
                        { field: "address2"  as const, label: "Address Line 2 (optional)", sm: false },
                        { field: "city"      as const, label: "City",  sm: true },
                        { field: "state"     as const, label: "State", sm: true },
                        { field: "zip"       as const, label: "ZIP Code", sm: true },
                      ].map(({ field, label, sm }) => (
                        <div key={field} className={sm ? "" : "sm:col-span-2"}>
                          <label className="block text-[11px] tracking-[0.1em] uppercase
                                            font-medium text-hp-black mb-2">
                            {label}
                          </label>
                          <input
                            type="text"
                            value={shipping[field]}
                            onChange={(e) => update(field, e.target.value)}
                            className="input-underline"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Shipping method */}
                    <div className="mt-10">
                      <h3 className="font-serif text-xl font-light mb-5">Shipping Method</h3>
                      <div className="space-y-3">
                        {[
                          { val: "standard", title: "Standard Shipping", sub: "5–7 business days", price: shippingBase === 0 ? "Free" : formatPrice(shippingBase) },
                          { val: "express",  title: "Express Shipping",  sub: "2 business days",    price: formatPrice(shippingBase + 1500) },
                        ].map(({ val, title, sub, price }) => (
                          <label
                            key={val}
                            className={cn(
                              "flex items-center justify-between p-4 border cursor-pointer transition-all duration-200",
                              shipping.shippingMethod === val
                                ? "border-hp-blue bg-blue-50/30"
                                : "border-hp-light hover:border-hp-gray"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                shipping.shippingMethod === val
                                  ? "border-hp-blue"
                                  : "border-hp-light"
                              )}>
                                {shipping.shippingMethod === val && (
                                  <div className="w-2 h-2 rounded-full bg-hp-blue" />
                                )}
                              </div>
                              <input
                                type="radio"
                                className="hidden"
                                value={val}
                                checked={shipping.shippingMethod === val as any}
                                onChange={() => update("shippingMethod", val)}
                              />
                              <div>
                                <p className="text-sm font-medium text-hp-black">{title}</p>
                                <p className="text-[11px] text-hp-gray font-light">{sub}</p>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-hp-black">{price}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setStep(1)}
                      className="btn-primary mt-10 w-full flex items-center justify-center gap-2"
                    >
                      Continue to Payment <ChevronRight size={14} strokeWidth={2} />
                    </button>
                  </div>
                )}

                {/* STEP 1 — Payment */}
                {step === 1 && (
                  <div>
                    <h2 className="font-serif text-3xl font-light mb-8">Payment</h2>
                    <div className="space-y-7">
                      <div>
                        <label className="block text-[11px] tracking-[0.1em] uppercase font-medium text-hp-black mb-2">
                          Name on Card
                        </label>
                        <input type="text" className="input-underline" placeholder="Full name" />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-[0.1em] uppercase font-medium text-hp-black mb-2">
                          Card Number
                        </label>
                        <input type="text" className="input-underline" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[11px] tracking-[0.1em] uppercase font-medium text-hp-black mb-2">
                            Expiry Date
                          </label>
                          <input type="text" className="input-underline" placeholder="MM / YY" />
                        </div>
                        <div>
                          <label className="block text-[11px] tracking-[0.1em] uppercase font-medium text-hp-black mb-2">
                            CVV
                          </label>
                          <input type="text" className="input-underline" placeholder="•••" />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-10">
                      <button onClick={() => setStep(0)} className="btn-ghost">Back</button>
                      <button onClick={() => setStep(2)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                        Review Order <ChevronRight size={14} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2 — Review */}
                {step === 2 && (
                  <div>
                    <h2 className="font-serif text-3xl font-light mb-8">Review Your Order</h2>
                    <div className="space-y-4 pb-8 border-b border-hp-light">
                      {items.map((item) => (
                        <div key={`${item.id}-${item.config}`} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-[11px] text-hp-gray font-light">{item.config} (x{item.qty})</p>
                          </div>
                          <span className="font-serif text-lg font-medium">{formatPrice(item.price * item.qty)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 mt-10">
                      <button onClick={() => setStep(1)} className="btn-ghost">Back</button>
                      <button onClick={() => setStep(3)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                        Place Order <ChevronRight size={14} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3 — Confirmation */}
                {step === 3 && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check size={28} strokeWidth={2} className="text-green-600" />
                    </div>
                    <h2 className="font-serif text-4xl font-light mb-3">Order Confirmed!</h2>
                    <p className="text-sm font-light text-hp-gray mb-8 max-w-md mx-auto">
                      Thank you for your purchase. You will receive a confirmation email shortly.
                    </p>
                    <Link href="/" className="btn-primary inline-block">Back to Home</Link>
                  </div>
                )}
              </div>

              {/* Right — Order summary */}
              {step < 3 && (
                <div>
                  <div className="border border-hp-light bg-hp-cream p-6 sticky top-24">
                    <h3 className="font-serif text-xl font-light mb-5">Order Summary</h3>
                    <div className="space-y-3 pb-5 border-b border-hp-light">
                      {items.map((item) => (
                        <div key={`${item.id}-${item.config}`} className="flex justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-[11px] text-hp-gray font-light">{item.config} (x{item.qty})</p>
                          </div>
                          <span className="text-sm font-medium flex-shrink-0">{formatPrice(item.price * item.qty)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2.5 py-5 border-b border-hp-light text-sm">
                      <div className="flex justify-between">
                        <span className="font-light text-hp-gray">Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-light text-hp-gray">Shipping</span>
                        <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-light text-hp-gray">Tax (18% GST)</span>
                        <span>{formatPrice(tax)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-baseline pt-4">
                      <span className="text-sm font-medium uppercase tracking-[0.05em]">Total</span>
                      <span className="font-serif text-2xl font-medium">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
