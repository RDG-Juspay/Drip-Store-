"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useState } from "react";

export default function Navbar() {
  const { openCart, itemCount } = useCartStore();
  const count = itemCount();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="text-2xl font-bold tracking-tight text-stone-900">
          DRIP
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Home</Link>
          <Link href="/products" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Shop</Link>
          <Link href="/products?category=Men" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Men</Link>
          <Link href="/products?category=Women" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Women</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="hidden md:flex text-stone-600 hover:text-stone-900 transition-colors">
            <Search size={20} />
          </button>
          <button
            onClick={openCart}
            className="relative text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </button>
          <button
            className="md:hidden text-stone-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 px-4 py-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-stone-700">Home</Link>
          <Link href="/products" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-stone-700">Shop All</Link>
          <Link href="/products?category=Men" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-stone-700">Men</Link>
          <Link href="/products?category=Women" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-stone-700">Women</Link>
        </div>
      )}
    </header>
  );
}
