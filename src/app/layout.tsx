import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });

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
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen bg-background font-sans antialiased ${inter.className}`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
