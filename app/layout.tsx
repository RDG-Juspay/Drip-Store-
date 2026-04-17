import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DRIP — Minimalist Fashion",
  description: "Curated clothing for the modern wardrobe",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-white text-stone-900 antialiased`}>
        <Navbar />
        <CartSidebar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
