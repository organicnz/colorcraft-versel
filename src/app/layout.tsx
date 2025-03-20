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
    template: "%s | Color & Craft Furniture Painting",
    default: "Color & Craft Furniture Painting",
  },
  description:
    "Professional furniture painting and restoration services. Transform your beloved furniture with expert craftsmanship and premium finishes.",
  openGraph: {
    title: "Color & Craft Furniture Painting",
    description:
      "Transform your furniture with expert painting services",
    url: "https://color-craft.vercel.app",
    siteName: "Color & Craft",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Color & Craft Furniture Painting",
    description:
      "Transform your furniture with expert painting services",
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
          {/* Main header - Color & Craft style */}
          <header className="bg-white dark:bg-gray-900 shadow-sm py-3 sticky top-0 z-40">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                  <span className="text-xl font-semibold text-primary">Color & Craft</span>
                </Link>

                {/* Main Navigation - Desktop */}
                <nav className="hidden md:flex space-x-8">
                  <Link
                    href="/"
                    className="nav-link py-2"
                  >
                    Home
                  </Link>
                  <Link
                    href="/services"
                    className="nav-link py-2"
                  >
                    Services
                  </Link>
                  <Link
                    href="/portfolio"
                    className="nav-link py-2"
                  >
                    Portfolio
                  </Link>
                  <Link
                    href="/about"
                    className="nav-link py-2"
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className="nav-link py-2"
                  >
                    Contact
                  </Link>
                </nav>

                {/* Action Buttons */}
                <div className="flex items-center space-x-5">
                  <ThemeSwitcher />
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-primary transition-colors text-sm font-medium dark:text-gray-300"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/contact"
                    className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded transition-colors"
                  >
                    Free Consultation
                  </Link>

                  {/* Mobile Menu Button */}
                  <button
                    type="button"
                    className="md:hidden text-gray-800 hover:text-primary dark:text-gray-100 ml-4"
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
