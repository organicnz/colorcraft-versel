import type { Metadata } from "next";
import { DM_Sans, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Link from "next/link";

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: {
    template: "%s | ColorCraft Furniture",
    default: "ColorCraft Furniture - Professional Furniture Painting",
  },
  description: "Transforming furniture with professional painting and restoration services.",
  icons: {
    icon: [
      {
        url: "/favicon/favicon.ico",
        sizes: "any",
      },
      {
        url: "/favicon/icon.svg",
        type: "image/svg+xml",
      }
    ],
    apple: {
      url: "/favicon/apple-touch-icon.png",
      sizes: "180x180",
    },
    shortcut: "/favicon/favicon.ico",
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${poppins.variable}`}>
      <body className="font-sans">
        <div className="flex min-h-screen flex-col">
          <div className="bg-gradient-to-r from-primary/90 to-primary h-10 hidden md:flex items-center justify-end px-6">
            <div className="flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+6494567890" className="text-sm font-medium">+64 9 456 7890</a>
            </div>
          </div>
          <header className="absolute top-0 left-0 w-full z-50 mt-10 md:mt-0">
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
              <div className="md:hidden">
                {/* Mobile menu button would go here */}
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
