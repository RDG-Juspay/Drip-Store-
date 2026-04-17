"use client";

import { Product } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-stone-900 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs text-stone-400 uppercase tracking-wider">{product.category}</p>
        <h3 className="text-sm font-semibold text-stone-900 group-hover:text-stone-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span className="text-xs text-stone-500">{product.rating} ({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-stone-900">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-stone-400 line-through">₹{product.originalPrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
