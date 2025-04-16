import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/shared/Footer";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import ThemeSwitcher from "@/components/shared/ThemeSwitcher";
import { Providers } from "./providers";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://colorcraft.live"),
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
    url: "https://colorcraft.live",
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
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-background font-sans antialiased ${inter.className}`}
      >
        <Providers>
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              {/* Logo */}
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <span className="font-bold text-primary sm:inline-block">
                  Color & Craft
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden flex-1 items-center space-x-6 text-sm font-medium md:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Right Side Actions */}
              <div className="flex flex-1 items-center justify-end space-x-4">
                <nav className="flex items-center space-x-2">
                  <ThemeSwitcher />
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/contact">Free Consultation</Link>
                  </Button>

                  {/* Mobile Menu */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <nav className="grid gap-6 text-lg font-medium mt-6">
                        <Link
                          href="/"
                          className="flex items-center space-x-2 text-lg font-semibold"
                        >
                          <span className="font-bold text-primary">Color & Craft</span>
                        </Link>
                        {navLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </nav>
                    </SheetContent>
                  </Sheet>
                </nav>
              </div>
            </div>
          </header>

          <main className="flex-grow">{children}</main>

          <Footer />
          <Analytics />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
