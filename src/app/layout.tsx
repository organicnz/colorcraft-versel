import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/shared/Footer";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import ThemeSwitcher from "@/components/shared/ThemeSwitcher";
import { Providers } from "./providers";

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {/* Main header */}
          <header className="bg-transparent absolute w-full z-10">
            <div className="container mx-auto py-4 px-4">
              <div className="flex items-center justify-between">
                {/* Main Navigation - Desktop */}
                <nav className="flex justify-center flex-1">
                  <ul className="flex space-x-8">
                    <li>
                      <Link
                        href="/"
                        className="text-gray-800 hover:text-primary py-2 transition-colors font-medium dark:text-gray-100"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/services"
                        className="text-gray-800 hover:text-primary py-2 transition-colors font-medium dark:text-gray-100"
                      >
                        Services
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/portfolio"
                        className="text-gray-800 hover:text-primary py-2 transition-colors font-medium dark:text-gray-100"
                      >
                        Portfolio
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about"
                        className="text-gray-800 hover:text-primary py-2 transition-colors font-medium dark:text-gray-100"
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contact"
                        className="text-gray-800 hover:text-primary py-2 transition-colors font-medium dark:text-gray-100"
                      >
                        Contact
                      </Link>
                    </li>
                  </ul>
                </nav>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-800 text-sm dark:text-gray-100">+1 747 755 7695</span>
                  </div>
                  <Link
                    href="/login"
                    className="hidden md:block text-gray-800 hover:text-primary transition-colors font-medium dark:text-gray-100"
                  >
                    Sign In
                  </Link>
                  <ThemeSwitcher />
                  <Link
                    href="/contact"
                    className="btn-primary hidden md:block"
                  >
                    Get Quote
                  </Link>

                  {/* Mobile Menu Button */}
                  <button
                    type="button"
                    className="md:hidden text-gray-800 hover:text-primary dark:text-gray-100"
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
        </Providers>
      </body>
    </html>
  );
}
