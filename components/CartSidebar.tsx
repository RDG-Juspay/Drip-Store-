"use client";

import { useCartStore } from "@/lib/store";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50" onClick={closeCart} />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <h2 className="text-lg font-semibold text-stone-900">Your Cart ({items.length})</h2>
          <button onClick={closeCart} className="text-stone-400 hover:text-stone-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-stone-400">
            <ShoppingBag size={48} strokeWidth={1} />
            <p className="text-sm">Your cart is empty</p>
            <button
              onClick={closeCart}
              className="text-sm text-stone-900 underline underline-offset-2"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4">
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 truncate">{item.product.name}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{item.size} · {item.color}</p>
                    <p className="text-sm font-semibold text-stone-900 mt-1">₹{item.product.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.size, item.color)}
                    className="text-stone-300 hover:text-stone-600 transition-colors self-start mt-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-100 px-6 py-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Subtotal</span>
                <span className="font-semibold text-stone-900">₹{total()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Shipping</span>
                <span className="text-stone-500">Calculated at checkout</span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full bg-stone-900 text-white text-sm font-semibold py-4 rounded-xl text-center hover:bg-stone-800 transition-colors"
              >
                Checkout · ₹{total()}
              </Link>
              <button
                onClick={closeCart}
                className="block w-full text-center text-sm text-stone-500 hover:text-stone-900 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
