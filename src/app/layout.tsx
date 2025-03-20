import type { Metadata } from "next";
import { Raleway, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import SupabaseProvider from "@/components/providers/SupabaseProvider";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Furniture Painter",
  description: "Transform your furniture with our professional painting and restoration services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${raleway.variable} ${playfair.variable} antialiased`}
      >
        <SupabaseProvider>
          {children}
          <Analytics />
        </SupabaseProvider>
      </body>
    </html>
  );
}
