"use client";

import { products } from "@/lib/products";
import { useCartStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Star, ArrowLeft, ShoppingBag, Check } from "lucide-react";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCartStore();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-stone-400 text-lg">Product not found.</p>
        <Link href="/products" className="text-stone-900 underline mt-4 inline-block">
          Back to shop
        </Link>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    addItem(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/products" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors mb-8">
        <ArrowLeft size={16} /> Back to shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100">
            <Image src={product.images[activeImage]} alt={product.name} fill className="object-cover" />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-stone-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {product.badge}
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-colors ${
                    activeImage === i ? "border-stone-900" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">{product.category}</p>
          <h1 className="text-3xl font-bold text-stone-900 mb-3">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-stone-200 fill-stone-200"}
                />
              ))}
            </div>
            <span className="text-sm text-stone-500">{product.rating} · {product.reviews} reviews</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-stone-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xl text-stone-400 line-through">₹{product.originalPrice}</span>
            )}
            {product.originalPrice && (
              <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Save ₹{product.originalPrice - product.price}
              </span>
            )}
          </div>

          <p className="text-stone-500 leading-relaxed mb-8 text-sm">{product.description}</p>

          {/* Color */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-stone-900 mb-3">
              Color {selectedColor && <span className="font-normal text-stone-400">— {selectedColor}</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${
                    selectedColor === color
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 text-stone-600 hover:border-stone-400"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-stone-900 mb-3">
              Size {selectedSize && <span className="font-normal text-stone-400">— {selectedSize}</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-xl text-sm font-medium border transition-all ${
                    selectedSize === size
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 text-stone-600 hover:border-stone-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || !selectedColor}
            className={`w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              !selectedSize || !selectedColor
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : added
                ? "bg-emerald-600 text-white"
                : "bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.99]"
            }`}
          >
            {added ? (
              <><Check size={16} /> Added to Cart</>
            ) : (
              <><ShoppingBag size={16} /> Add to Cart</>
            )}
          </button>

          {(!selectedSize || !selectedColor) && (
            <p className="text-xs text-stone-400 text-center mt-2">
              {!selectedColor ? "Select a color" : "Select a size"} to continue
            </p>
          )}

          {/* Details accordion */}
          <div className="mt-10 border-t border-stone-100 pt-6 space-y-4 text-sm text-stone-500">
            <div className="flex justify-between">
              <span>Material</span>
              <span className="text-stone-700 font-medium">100% Organic Cotton</span>
            </div>
            <div className="flex justify-between border-t border-stone-100 pt-4">
              <span>Shipping</span>
              <span className="text-stone-700 font-medium">Free over ₹75</span>
            </div>
            <div className="flex justify-between border-t border-stone-100 pt-4">
              <span>Returns</span>
              <span className="text-stone-700 font-medium">30 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-8">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
