"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: string;
  name: string;
  series: string;
  config: string;
  price: number;
  qty: number;
  image?: string;
};

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, config: string) => void;
  updateQty: (id: string, config: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("dsk-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("dsk-cart", JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id && i.config === newItem.config);
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id && i.config === newItem.config
            ? { ...i, qty: i.qty + newItem.qty }
            : i
        );
      }
      return [...prev, newItem];
    });
  };

  const removeItem = (id: string, config: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.config === config)));
  };

  const updateQty = (id: string, config: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.config === config ? { ...i, qty: Math.max(1, i.qty + delta) } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        cartCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
