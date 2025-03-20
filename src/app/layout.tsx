import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Analytics } from "@vercel/analytics/react";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://color-craft.vercel.app"),
  title: {
    template: "%s | Color&Craft Furniture Painter",
    default: "Color&Craft Furniture Painter",
  },
  description:
    "Expert furniture painting and restoration services in Los Angeles, transforming ordinary pieces into extraordinary statements.",
  openGraph: {
    title: "Color&Craft Furniture Painter",
    description:
      "Expert furniture painting and restoration services in Los Angeles",
    url: "https://color-craft.vercel.app",
    siteName: "Color&Craft",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Color&Craft Furniture Painter",
    description:
      "Expert furniture painting and restoration services in Los Angeles",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Pre-header Contact Strip */}
        <div className="bg-gray-100 text-gray-700 py-1 text-sm">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+1 747 755 7695</span>
            </div>
            <div className="hidden md:flex space-x-4">
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact Us
              </Link>
              <Link href="/faq" className="hover:text-primary transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>

        {/* Main header */}
        <header className="bg-white shadow-md">
          <div className="container mx-auto py-4 px-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/assets/cc-logo.png"
                  alt="Color&Craft Furniture Painter Logo"
                  width={50}
                  height={50}
                  className="w-auto h-10"
                />
                <span className="text-xl font-medium text-gray-800">Color&Craft</span>
              </Link>

              {/* Main Navigation - Desktop */}
              <nav className="hidden md:flex justify-center flex-1">
                <ul className="flex space-x-8">
                  <li>
                    <Link
                      href="/"
                      className="text-gray-700 hover:text-primary py-2 transition-colors font-medium"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/services"
                      className="text-gray-700 hover:text-primary py-2 transition-colors font-medium"
                    >
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/portfolio"
                      className="text-gray-700 hover:text-primary py-2 transition-colors font-medium"
                    >
                      Portfolio
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-gray-700 hover:text-primary py-2 transition-colors font-medium"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-gray-700 hover:text-primary py-2 transition-colors font-medium"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="hidden md:block text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/contact"
                  className="btn-primary hidden md:block"
                >
                  Get Quote
                </Link>

                {/* Mobile Menu Button */}
                <button
                  type="button"
                  className="md:hidden text-gray-700 hover:text-primary"
                  aria-label="Toggle mobile menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
