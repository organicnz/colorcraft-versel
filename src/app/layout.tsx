import type { Metadata } from "next";
import { DM_Sans, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Link from "next/link";
import Image from "next/image";

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
    template: "%s | Color Craft",
    default: "Color Craft - Professional Furniture Transformation",
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
          {/* Pre-header contact strip */}
          <div className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-2 px-4">
            <div className="container mx-auto flex justify-end">
              <a href="tel:+17477557695" className="flex items-center text-sm font-light">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +1 747 755 7695
              </a>
            </div>
          </div>
          
          <header className="absolute top-0 left-0 w-full z-50 mt-8">
            <nav className="bg-transparent">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                      <Image
                        src="/images/logo.png"
                        alt="Color Craft Logo"
                        width={42}
                        height={42}
                        className="mr-3"
                      />
                      <span className="text-xl font-medium text-white">
                        Color Craft
                      </span>
                    </Link>
                  </div>
                  <div className="hidden md:flex items-center space-x-10">
                    <ul className="flex space-x-8 font-light text-sm">
                      <li>
                        <Link href="/" className="text-white hover:text-white/80 transition-colors">
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link href="/portfolio" className="text-white hover:text-white/80 transition-colors">
                          Portfolio
                        </Link>
                      </li>
                      <li>
                        <Link href="/services" className="text-white hover:text-white/80 transition-colors">
                          Services
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact" className="text-white hover:text-white/80 transition-colors">
                          Contact
                        </Link>
                      </li>
                    </ul>
                    
                    <Link 
                      href="/contact" 
                      className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-5 py-2 rounded text-sm hover:bg-white/20 transition-colors"
                    >
                      Request Quote
                    </Link>
                  </div>
                  
                  {/* Mobile menu button - hidden on desktop */}
                  <div className="md:hidden">
                    <button className="text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
