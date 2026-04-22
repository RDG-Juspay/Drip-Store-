"use client";

import { useCartStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";

type FormData = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export default function CheckoutPage() {
  const { items, total } = useCartStore();
  const [form, setForm] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const subtotal = total();
  const shipping = subtotal >= 75 ? 0 : 9.99;
  const tax = +(subtotal * 0.08).toFixed(2);
  const orderTotal = +(subtotal + shipping + tax).toFixed(2);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            size: i.size,
            color: i.color,
          })),
          customer: {
            email: form.email,
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      // Redirect browser to Juspay-hosted payment page
      window.location.href = data.paymentUrl;
    } catch {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const isComplete =
    form.email &&
    form.firstName &&
    form.lastName &&
    form.phone &&
    form.address &&
    form.city &&
    form.zip;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-stone-400 text-lg mb-4">Your cart is empty.</p>
          <Link href="/products" className="text-stone-900 underline text-sm">
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Continue Shopping
      </Link>

      <h1 className="text-3xl font-bold text-stone-900 mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
          {/* Contact */}
          <div>
            <h2 className="text-lg font-semibold text-stone-900 mb-4">
              Contact
            </h2>
            <div className="space-y-3">
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-500 transition-colors"
              />
              <input
                name="phone"
                type="tel"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={handleChange}
                required
                maxLength={15}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-500 transition-colors"
              />
            </div>
          </div>

          {/* Shipping */}
          <div>
            <h2 className="text-lg font-semibold text-stone-900 mb-4">
              Shipping Address
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <input
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                required
                className="border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-500 transition-colors"
              />
              <input
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                className="border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-500 transition-colors"
              />
              <input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                required
                className="col-span-2 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-500 transition-colors"
              />
              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                required
                className="border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-500 transition-colors"
              />
              <input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                className="border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-500 transition-colors"
              />
              <input
                name="zip"
                placeholder="PIN code"
                value={form.zip}
                onChange={handleChange}
                required
                className="border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-500 transition-colors"
              />
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-600 focus:outline-none focus:border-stone-500 transition-colors bg-white"
              >
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Australia</option>
              </select>
            </div>
          </div>

          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              {apiError}
            </div>
          )}

          <button
            type="submit"
            disabled={!isComplete || loading}
            className={`w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              isComplete && !loading
                ? "bg-stone-900 text-white hover:bg-stone-800"
                : "bg-stone-100 text-stone-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Redirecting to payment…
              </>
            ) : (
              `Pay ₹${orderTotal} securely`
            )}
          </button>

          <p className="text-center text-xs text-stone-400">
            Secured by Juspay · Your card details are never stored on our
            servers
          </p>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-stone-50 rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-stone-900 mb-5">
              Order Summary
            </h2>

            <div className="space-y-4 mb-5 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  className="flex gap-3"
                >
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute -top-1 -right-1 bg-stone-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-stone-400">
                      {item.size} · {item.color}
                    </p>
                    <p className="text-sm font-semibold mt-1">
                      ₹{item.product.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-600">Free</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Tax (8%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 text-base border-t border-stone-200 pt-3">
                <span>Total</span>
                <span>₹{orderTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
