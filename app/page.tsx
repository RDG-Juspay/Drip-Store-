import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Download, Smartphone } from "lucide-react";

export default function HomePage() {
  const featured = products.slice(0, 4);
  const newArrivals = products.filter((p) => p.badge === "New");

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[90vh] min-h-[600px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85"
            alt="Hero"
            fill
            priority
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 w-full">
          <div className="max-w-xl">
            <p className="text-stone-300 text-sm uppercase tracking-widest mb-3 font-medium">
              Spring / Summer 2024
            </p>
            <h1 className="text-white text-5xl sm:text-7xl font-bold leading-tight tracking-tight mb-6">
              Dress for<br />the moment.
            </h1>
            <p className="text-stone-300 text-lg mb-8 leading-relaxed">
              Curated essentials for every occasion. Clean lines, quality fabrics.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="bg-white text-stone-900 px-8 py-4 rounded-full font-semibold text-sm hover:bg-stone-100 transition-colors inline-flex items-center gap-2"
              >
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link
                href="/products?category=Women"
                className="border border-white/50 text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                {"Women's Collection"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-2xl font-bold text-stone-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Men", href: "/products?category=Men", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80" },
            { label: "Women", href: "/products?category=Women", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80" },
            { label: "Unisex", href: "/products?category=Unisex", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80" },
          ].map((cat) => (
            <Link key={cat.label} href={cat.href} className="group relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src={cat.image} alt={cat.label} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-white text-2xl font-bold">{cat.label}</p>
                <p className="text-stone-300 text-sm mt-1 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Shop now <ArrowRight size={14} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-stone-900">Featured Picks</h2>
          <Link href="/products" className="text-sm text-stone-500 hover:text-stone-900 transition-colors inline-flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="relative rounded-3xl overflow-hidden h-72 sm:h-96">
          <Image
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80"
            alt="Sale banner"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-stone-900/50" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <p className="text-stone-300 text-sm uppercase tracking-widest mb-2">Limited Time</p>
            <h2 className="text-white text-4xl sm:text-5xl font-bold mb-4">Up to 40% Off</h2>
            <p className="text-stone-300 mb-6">Selected styles on sale now</p>
            <Link
              href="/products"
              className="bg-white text-stone-900 px-8 py-3 rounded-full font-semibold text-sm hover:bg-stone-100 transition-colors"
            >
              Shop the Sale
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-stone-900">New Arrivals</h2>
            <Link href="/products" className="text-sm text-stone-500 hover:text-stone-900 transition-colors inline-flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* App Download Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-stone-900 rounded-3xl px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Smartphone size={28} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-xl leading-tight">Drip Store — now on Android</p>
              <p className="text-stone-400 text-sm mt-1">Shop faster with our native app. Free download, no sign-up required.</p>
            </div>
          </div>
          <a
            href="https://github.com/RDG-Juspay/Drip-Store-Flutter-App/releases/download/v1.0.0/drip-store-v1.0.0.apk"
            download
            className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-stone-900 font-semibold text-sm px-6 py-3 rounded-full hover:bg-stone-100 transition-colors"
          >
            <Download size={16} /> Download APK
          </a>
        </div>
      </section>

      {/* USPs */}
      <section className="bg-stone-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: "🚚", title: "Free Shipping", desc: "On orders over ₹75" },
            { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
            { icon: "🔒", title: "Secure Payment", desc: "100% secure checkout" },
            { icon: "🌿", title: "Sustainable", desc: "Ethically made" },
          ].map((item) => (
            <div key={item.title}>
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="font-semibold text-stone-900 text-sm">{item.title}</p>
              <p className="text-stone-400 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
