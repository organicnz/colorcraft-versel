import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | ColorCraft Furniture",
    default: "ColorCraft Furniture - Professional Furniture Painting",
  },
  description: "Transforming furniture with professional painting and restoration services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <header className="absolute top-0 left-0 w-full z-50">
            <div className="container mx-auto px-6 py-6 flex justify-between items-center">
              <div>
                <Link href="/" className="text-xl font-semibold text-white">
                  ColorCraft
                </Link>
              </div>
              <nav className="hidden md:flex space-x-8">
                <Link href="/services" className="text-white hover:text-white/80 transition duration-300">
                  Services
                </Link>
                <Link href="/portfolio" className="text-white hover:text-white/80 transition duration-300">
                  Portfolio
                </Link>
                <Link href="/about" className="text-white hover:text-white/80 transition duration-300">
                  About
                </Link>
                <Link href="/contact" className="text-white hover:text-white/80 transition duration-300">
                  Contact
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
