import type { Metadata } from "next";
import { DM_Sans, Poppins } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { FaPhone } from "react-icons/fa6";
import Footer from "@/components/shared/Footer";

// Define fonts
const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-dm-sans", 
  display: "swap"
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    template: "%s | Color & Craft Furniture Painter",
    default: "Color & Craft Furniture Painter",
  },
  description: "Professional Furniture Transformation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${poppins.variable}`}>
      <body className="font-sans">
        {/* Pre-header contact strip */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white text-sm py-2">
          <div className="container mx-auto flex justify-end items-center">
            <div className="flex items-center">
              <FaPhone className="mr-2 text-xs" />
              <span>+1 (800) 555-1234</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto">
            <div className="flex items-center justify-between py-4">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <div className="relative w-10 h-10 mr-2">
                  <Image
                    src="/logo.svg"
                    alt="Color & Craft Furniture Painter Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-gray-800 font-heading font-medium text-xl">Color & Craft</span>
              </Link>

              {/* Main Navigation - Desktop */}
              <div className="hidden md:flex justify-center flex-1">
                <ul className="flex items-center space-x-8 font-light text-sm">
                  <li>
                    <Link href="/" className="text-gray-700 hover:text-primary py-2">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-gray-700 hover:text-primary py-2">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/services" className="text-gray-700 hover:text-primary py-2">
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link href="/portfolio" className="text-gray-700 hover:text-primary py-2">
                      Portfolio
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-gray-700 hover:text-primary py-2">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Auth/CTA links */}
              <div className="flex items-center space-x-3">
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-primary text-sm font-medium mr-6"
                >
                  Sign In
                </Link>
                <Link 
                  href="/contact" 
                  className="bg-primary text-white px-5 py-2 rounded text-sm hover:bg-primary-light transition-colors"
                >
                  Request Quote
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button className="md:hidden text-gray-700 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
