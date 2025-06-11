import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { Providers } from './providers'
import { Analytics } from "@vercel/analytics/react"
import ChatWidget from "@/components/chat/ChatWidget"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ThemeSwitcher from "@/components/shared/ThemeSwitcher"
import { NavbarAuth } from "@/components/shared/NavbarAuth"
import { GlassNavbar } from "@/components/ui/glass-card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Phone } from "lucide-react"
import Footer from "@/components/shared/Footer"
import PhoneDisplay from "@/components/ui/phone-display"
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Color & Craft - Professional Furniture Painting & Restoration',
    template: '%s | Color & Craft'
  },
  description: 'Transform your furniture with our professional painting and restoration services. Custom finishes, vintage restoration, and modern makeovers in Chatsworth, CA.',
  keywords: ['furniture painting', 'furniture restoration', 'custom furniture', 'Chatsworth', 'furniture refinishing'],
  authors: [{ name: 'Color & Craft' }],
  creator: 'Color & Craft',
  publisher: 'Color & Craft',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://colorandcraft.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://colorandcraft.com',
    title: 'Color & Craft - Professional Furniture Painting & Restoration',
    description: 'Transform your furniture with our professional painting and restoration services.',
    siteName: 'Color & Craft',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Color & Craft - Professional Furniture Painting & Restoration',
    description: 'Transform your furniture with our professional painting and restoration services.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// AuthSection component to handle authentication UI
function AuthSection() {
  return <NavbarAuth />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ENHANCED ANTI-FLASH SYSTEM - Reliable theme application */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // ENHANCED ANTI-FLASH - Prevents color flickering
              (function() {
                try {
                  // 1. IMMEDIATE THEME APPLICATION
                  var theme = 'light';
                  try {
                    var stored = localStorage.getItem('theme');
                    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                    
                    if (stored === 'dark') {
                      theme = 'dark';
                    } else if (stored === 'system' && prefersDark) {
                      theme = 'dark';
                    } else if (!stored && prefersDark) {
                      theme = 'dark';
                    }
                  } catch(e) {
                    try {
                      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        theme = 'dark';
                      }
                    } catch(e2) {}
                  }

                  // Apply theme immediately
                  var html = document.documentElement;
                  if (theme === 'dark') {
                    html.classList.add('dark');
                    html.style.colorScheme = 'dark';
                  } else {
                    html.classList.remove('dark');
                    html.style.colorScheme = 'light';
                  }

                  // 2. COMPREHENSIVE FLASH PREVENTION
                  var antiFlashStyle = document.createElement('style');
                  antiFlashStyle.id = 'anti-flash-style';
                  antiFlashStyle.textContent =
                    '*, *::before, *::after { transition: none !important; animation-duration: 0.01ms !important; animation-delay: -1ms !important; }' +
                    'html { background-color: ' + (theme === 'dark' ? '#0f172a' : '#ffffff') + ' !important; }' +
                    'body { background-color: ' + (theme === 'dark' ? '#0f172a' : '#ffffff') + ' !important; }' +
                    '.bg-white { background-color: ' + (theme === 'dark' ? '#0f172a' : '#ffffff') + ' !important; }' +
                    '.dark\\\\:bg-slate-900 { background-color: ' + (theme === 'dark' ? '#0f172a' : '#ffffff') + ' !important; }';

                  document.head.appendChild(antiFlashStyle);

                  // 3. STABLE TRANSITIONS ENABLEMENT
                  var enableTransitions = function() {
                    try {
                      var style = document.getElementById('anti-flash-style');
                      if (style) {
                        style.remove();
                      }

                      // Add ready classes
                      html.classList.add('ready');
                      if (document.body) {
                        document.body.classList.add('loaded', 'transitions-enabled');
                      }

                      // Mark as complete
                      window.__antiFlashComplete = true;
                    } catch(e) {
                      try {
                        var style = document.getElementById('anti-flash-style');
                        if (style) style.remove();
                      } catch(e2) {}
                    }
                  };

                  // 4. MULTIPLE ACTIVATION POINTS
                  if (document.readyState !== 'loading') {
                    setTimeout(enableTransitions, 32); // Two frames delay
                  }

                  document.addEventListener('DOMContentLoaded', function() {
                    setTimeout(enableTransitions, 16);
                  });

                  // Failsafe timer
                  setTimeout(enableTransitions, 150);

                } catch(e) {
                  try {
                    var style = document.getElementById('anti-flash-style');
                    if (style) style.remove();
                  } catch(e2) {}
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`min-h-screen bg-background font-sans antialiased ${inter.className}`}
      >
        <Providers>
          {/* RealVantage-inspired Navbar */}
          <GlassNavbar>
            <div className="container mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    Color & Craft
                  </span>
                </Link>

                {/* Desktop Navigation - Center */}
                <nav className="hidden md:flex items-center space-x-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-slate-700 hover:text-[#3ECF8E] transition-colors duration-300 font-medium text-base"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Right Side - Phone Display */}
                <div className="hidden md:flex items-center space-x-4">
                  <PhoneDisplay
                    phoneNumber="(747) 755-7695"
                    variant="header"
                    showIcons={true}
                    className="hidden lg:flex"
                  />

                  {/* CTA Button */}
                  <Button
                    size="sm"
                    className="bg-[#3ECF8E] hover:bg-[#38BC81] text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:shadow-lg"
                    asChild
                  >
                    <Link href="/contact">Free Quote</Link>
                  </Button>

                  <ThemeSwitcher />
                  <AuthSection />
                </div>

                {/* Mobile Menu Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden border-slate-300 hover:border-[#3ECF8E]">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle Menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px]">
                    <div className="mt-6 space-y-6">
                      {/* Mobile Logo */}
                      <Link
                        href="/"
                        className="flex items-center space-x-2 text-xl font-bold text-slate-900"
                      >
                        Color & Craft
                      </Link>

                      {/* Mobile Navigation */}
                      <nav className="flex flex-col space-y-4">
                        {navLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="text-slate-700 hover:text-[#3ECF8E] text-base font-medium transition-colors"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </nav>

                      {/* Mobile Phone Display */}
                      <div className="pt-4 border-t border-slate-200">
                        <PhoneDisplay
                          phoneNumber="(747) 755-7695"
                          variant="contact"
                          showIcons={true}
                          className="mb-4"
                        />

                        {/* Mobile CTA */}
                        <Button
                          size="sm"
                          className="w-full bg-[#3ECF8E] hover:bg-[#38BC81] text-white font-semibold py-2 rounded-full"
                          asChild
                        >
                          <Link href="/contact">Get Free Quote</Link>
                        </Button>
                      </div>

                      {/* Mobile Theme Switcher */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <span className="text-sm text-slate-600">Theme</span>
                        <ThemeSwitcher />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </GlassNavbar>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <Footer />

          {/* Chat Widget */}
          <ChatWidget />

          {/* Analytics */}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
