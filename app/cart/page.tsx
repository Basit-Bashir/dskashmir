"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Minus, Plus, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { formatPrice } from "@/lib/utils";

type CartItem = {
  id: string;
  name: string;
  series: string;
  config: string;
  price: number;
  qty: number;
};

const INITIAL_CART: CartItem[] = [
  { id: "1", name: "HP Spectre x360 14",  series: "HP Spectre Series", config: "16GB / 1TB / Nightfall Black", price: 2099, qty: 1 },
  { id: "2", name: "HP EliteBook 840 G11", series: "HP EliteBook Series", config: "32GB / 512GB / Pike Silver",  price: 1599, qty: 1 },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);
  const [promo, setPromo]   = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal  = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping  = subtotal >= 500 ? 0 : 19.99;
  const discount  = promoApplied ? subtotal * 0.1 : 0;
  const tax       = (subtotal - discount) * 0.08;
  const total     = subtotal - discount + shipping + tax;

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="section-pad py-12 md:py-16">
          <div className="max-content">
            <h1 className="font-serif text-4xl md:text-5xl font-light mb-2">
              Your Cart
            </h1>
            <p className="text-sm text-hp-gray font-light mb-10">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>

            {items.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-serif text-3xl font-light text-hp-gray/50 mb-6">
                  Your cart is empty
                </p>
                <Link href="/collections" className="btn-primary inline-block">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 xl:gap-16">

                {/* Items */}
                <div>
                  <div className="divider mb-0" />
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-5 py-7 border-b border-hp-light"
                    >
                      {/* Thumbnail */}
                      <div className="w-24 h-20 bg-hp-cream flex items-center
                                      justify-center flex-shrink-0">
                        <span className="text-[10px] text-hp-gray/40 font-serif">
                          {item.name.split(" ")[1]}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[10px] tracking-[0.15em] uppercase text-hp-gray font-light mb-1">
                              {item.series}
                            </p>
                            <h3 className="text-sm font-medium text-hp-black">{item.name}</h3>
                            <p className="text-[11px] text-hp-gray font-light mt-1">{item.config}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-hp-gray/40 hover:text-hp-black transition-colors
                                       flex-shrink-0 mt-0.5"
                            aria-label="Remove item"
                          >
                            <X size={16} strokeWidth={1.5} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Qty stepper */}
                          <div className="flex items-center border border-hp-light">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center
                                         text-hp-gray hover:text-hp-black transition-colors
                                         border-r border-hp-light"
                            >
                              <Minus size={12} strokeWidth={2} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center
                                         text-hp-gray hover:text-hp-black transition-colors
                                         border-l border-hp-light"
                            >
                              <Plus size={12} strokeWidth={2} />
                            </button>
                          </div>

                          <span className="font-serif text-xl font-medium">
                            {formatPrice(item.price * item.qty)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Link
                    href="/collections"
                    className="inline-flex items-center gap-2 mt-6 text-[11px]
                               tracking-[0.12em] uppercase text-hp-gray hover:text-hp-blue
                               transition-colors duration-200"
                  >
                    ← Continue Shopping
                  </Link>
                </div>

                {/* Summary */}
                <div>
                  <div className="border border-hp-light bg-hp-cream p-6 md:p-8 sticky top-24">
                    <h2 className="font-serif text-2xl font-light mb-6">Order Summary</h2>

                    <div className="space-y-3 pb-5 border-b border-hp-light">
                      <div className="flex justify-between text-sm">
                        <span className="font-light text-hp-gray">Subtotal</span>
                        <span className="font-medium">{formatPrice(subtotal)}</span>
                      </div>
                      {promoApplied && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span className="font-light">Discount (10%)</span>
                          <span className="font-medium">−{formatPrice(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="font-light text-hp-gray">Shipping</span>
                        <span className="font-medium">
                          {shipping === 0 ? "Free" : formatPrice(shipping)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-light text-hp-gray">Tax (est.)</span>
                        <span className="font-medium">{formatPrice(tax)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline py-5 border-b border-hp-light">
                      <span className="text-sm font-medium tracking-[0.05em] uppercase">Total</span>
                      <span className="font-serif text-3xl font-medium">{formatPrice(total)}</span>
                    </div>

                    {/* Promo */}
                    <div className="pt-5 pb-6">
                      <label className="text-[11px] tracking-[0.1em] uppercase font-medium
                                        text-hp-black block mb-3">
                        Promo Code
                      </label>
                      <div className="flex gap-0">
                        <input
                          type="text"
                          value={promo}
                          onChange={(e) => setPromo(e.target.value)}
                          placeholder="Enter code"
                          className="flex-1 border border-hp-light bg-white text-sm
                                     font-light px-3 py-2.5 focus:outline-none
                                     focus:border-hp-blue transition-colors"
                        />
                        <button
                          onClick={() => {
                            if (promo.toLowerCase() === "hp10") setPromoApplied(true);
                          }}
                          className="bg-hp-black text-white text-[10px] tracking-[0.1em]
                                     uppercase font-medium px-4 hover:bg-hp-blue
                                     transition-colors duration-200"
                        >
                          Apply
                        </button>
                      </div>
                      {promo && !promoApplied && (
                        <p className="text-[11px] text-hp-gray mt-2">
                          Try <strong>HP10</strong> for 10% off
                        </p>
                      )}
                    </div>

                    <Link
                      href="/checkout"
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      Proceed to Checkout <ArrowRight size={12} strokeWidth={2} />
                    </Link>

                    <div className="flex items-center justify-center gap-2 mt-4">
                      <ShieldCheck size={13} strokeWidth={1.5} className="text-hp-gray" />
                      <p className="text-[11px] text-hp-gray font-light text-center">
                        Secure checkout · Free returns · 2-year warranty
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
