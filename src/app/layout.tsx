import type { Metadata } from "next";
import { Inter, Playfair_Display, Poppins, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

// Modern font combinations for a sophisticated look
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ColorCraft - Furniture Painting & Restoration",
  description:
    "Transform your furniture with professional painting and restoration services. Custom finishes, vintage restoration, and creative upcycling.",
  keywords: "furniture painting, restoration, chalk paint, vintage furniture, upcycling",
  authors: [{ name: "ColorCraft" }],
  openGraph: {
    title: "ColorCraft - Furniture Painting & Restoration",
    description: "Transform your furniture with professional painting and restoration services.",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ColorCraft - Furniture Painting & Restoration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ColorCraft - Furniture Painting & Restoration",
    description: "Transform your furniture with professional painting and restoration services.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${poppins.variable} ${manrope.variable}`}
    >
      <head />
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 font-sans antialiased selection:bg-primary/20 selection:text-primary-900">
        <Providers>
          <div className="flex min-h-screen flex-col relative">
            {/* Subtle background pattern */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:20px_20px] pointer-events-none opacity-30 dark:opacity-10" />

            {/* Main content */}
            <div className="relative z-10 flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 pt-24">{children}</main>
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
