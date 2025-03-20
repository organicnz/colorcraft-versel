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
          <header className="absolute top-0 left-0 w-full z-50">
            <nav className="bg-transparent">
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex items-center mb-4 md:mb-0">
                    <Link href="/" className="flex items-center">
                      <Image
                        src="/images/logo.png"
                        alt="ColorCraft Logo"
                        width={48}
                        height={48}
                        className="mr-3"
                      />
                      <span className="text-xl font-semibold text-white">
                        ColorCraft
                      </span>
                    </Link>
                  </div>
                  <div className="flex items-center justify-center space-x-8">
                    <ul className="flex space-x-8 font-medium">
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
                    
                    <a 
                      href="tel:+17477557695" 
                      className="flex items-center bg-white text-primary px-4 py-2 rounded-full text-sm hover:bg-white/90 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      +1 747 755 7695
                    </a>
                    
                    <Link 
                      href="/signin" 
                      className="flex items-center bg-white/20 backdrop-blur-sm border border-white/30 text-white px-5 py-2 rounded-full text-sm hover:bg-white/30 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Sign In
                    </Link>
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
