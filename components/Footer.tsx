import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="col-span-1 md:col-span-2">
          <p className="text-white text-2xl font-bold tracking-tight mb-3">DRIP</p>
          <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
            Minimalist fashion for the modern wardrobe. Quality pieces designed to last, styled to impress.
          </p>
        </div>
        <div>
          <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Shop</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
            <li><Link href="/products?category=Men" className="hover:text-white transition-colors">Men</Link></li>
            <li><Link href="/products?category=Women" className="hover:text-white transition-colors">Women</Link></li>
            <li><Link href="/products?category=Unisex" className="hover:text-white transition-colors">Unisex</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Help</p>
          <ul className="space-y-2 text-sm">
            <li><span className="hover:text-white transition-colors cursor-pointer">Shipping & Returns</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Size Guide</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Contact Us</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">FAQ</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-800 px-4 sm:px-6 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-stone-500 text-xs">© 2024 DRIP. All rights reserved.</p>
        <p className="text-stone-500 text-xs">Made with care · Shipped with love</p>
      </div>
    </footer>
  );
}
