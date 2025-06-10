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
import { AuthButton } from "@/components/shared/AuthButton"
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
        <Script id="prevent-flash" strategy="beforeInteractive">
          {`
            // ENHANCED ANTI-FLASH PREVENTION SYSTEM FOR NEXT-THEMES
            (function() {
              try {
                // 1. Use the correct localStorage key that next-themes uses
                const STORAGE_KEY = 'theme'; // next-themes default key

                // 2. Get the theme from localStorage or use default
                const storedTheme = localStorage.getItem(STORAGE_KEY);
                const defaultTheme = 'light'; // matches ThemeProvider defaultTheme

                // 3. Determine the theme to apply
                let themeToApply = defaultTheme;

                if (storedTheme) {
                  // If system theme is stored, check system preference
                  if (storedTheme === 'system') {
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      themeToApply = 'dark';
                    } else {
                      themeToApply = 'light';
                    }
                  } else {
                    themeToApply = storedTheme;
                  }
                }

                // 4. Apply the theme to the document immediately
                if (themeToApply === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                }

                // 5. AGGRESSIVE anti-flash: Hide everything until fully loaded
                const style = document.createElement('style');
                style.id = 'anti-flash-style';
                style.innerHTML = \`
                  /* Ultra-aggressive flash Prevention */
                  html, body {
                    visibility: hidden !important;
                    opacity: 0 !important;
                  }
                  *, *::before, *::after {
                    transition: none !important;
                    animation: none !important;
                    animation-duration: 0s !important;
                    animation-delay: 0s !important;
                    -webkit-transition: none !important;
                    -moz-transition: none !important;
                    -o-transition: none !important;
                  }
                  /* Block all possible sources of animation */
                  [data-framer-motion-initial],
                  [data-framer-motion] {
                    transform: none !important;
                    opacity: 1 !important;
                  }
                  .animate-*, .transition-* {
                    animation: none !important;
                    transition: none !important;
                  }
                \`;
                document.head.appendChild(style);

                // 6. Function to reveal the page - only once
                let hasRevealed = false;
                function revealPage() {
                  if (hasRevealed) return;
                  hasRevealed = true;

                  try {
                    const antiFlashStyle = document.getElementById('anti-flash-style');
                    if (antiFlashStyle) {
                      antiFlashStyle.remove();
                    }

                    // Add classes to enable transitions and show page
                    document.documentElement.style.visibility = 'visible';
                    document.documentElement.style.opacity = '1';
                    document.body.style.visibility = 'visible';
                    document.body.style.opacity = '1';
                    document.body.classList.add('loaded', 'transitions-enabled');

                    console.log('✅ Anti-flash complete - page revealed');
                  } catch (error) {
                    console.error('Error revealing page:', error);
                    // Emergency fallback
                    document.documentElement.style.visibility = 'visible';
                    document.documentElement.style.opacity = '1';
                    document.body.style.visibility = 'visible';
                    document.body.style.opacity = '1';
                  }
                }

                // 7. Wait for React hydration to complete before revealing
                let hydrationComplete = false;
                let domReady = false;

                function checkReveal() {
                  // Only reveal after both DOM is ready AND a delay for hydration
                  if (domReady && !hasRevealed) {
                    setTimeout(revealPage, 150); // Small delay to ensure hydration is complete
                  }
                }

                // Wait for DOM to be ready
                if (document.readyState === 'complete') {
                  domReady = true;
                  checkReveal();
                } else if (document.readyState === 'interactive') {
                  domReady = true;
                  checkReveal();
                } else {
                  document.addEventListener('DOMContentLoaded', () => {
                    domReady = true;
                    checkReveal();
                  });
                }

                // Additional safety nets
                window.addEventListener('load', () => {
                  setTimeout(() => {
                    if (!hasRevealed) revealPage();
                  }, 100);
                });

                // Progressive fallbacks with longer delays to prevent multiple flashes
                setTimeout(() => {
                  if (!hasRevealed) revealPage();
                }, 800);  // 0.8s fallback

                setTimeout(() => {
                  if (!hasRevealed) revealPage();
                }, 1500); // 1.5s fallback

                // Emergency fallback
                setTimeout(() => {
                  if (!hasRevealed) {
                    document.documentElement.style.visibility = 'visible';
                    document.documentElement.style.opacity = '1';
                    document.body.style.visibility = 'visible';
                    document.body.style.opacity = '1';
                    document.body.classList.add('loaded', 'transitions-enabled');
                    console.log('🚨 Emergency fallback activated');
                  }
                }, 3000);

              } catch (error) {
                console.error('Anti-flash script error:', error);
                // Emergency fallback
                document.documentElement.style.visibility = 'visible';
                document.documentElement.style.opacity = '1';
                document.body.style.visibility = 'visible';
                document.body.style.opacity = '1';
              }
            })();
          `}
        </Script>
        <Script id="remove-extension-attributes" strategy="afterInteractive">
          {`
            // Remove browser extension attributes like bis_skin_checked
            function removeExtensionAttributes() {
              const attributes = [
                'bis_skin_checked',
                'bis_id',
                'bis_size',
                'data-adblock-key',
                'data-abp',
                'data-extension-id'
              ];

              attributes.forEach(attr => {
                const elements = document.querySelectorAll('[' + attr + ']');
                elements.forEach(el => {
                  el.removeAttribute(attr);
                  // Also remove any related class names
                  if (el.className) {
                    el.className = el.className
                      .replace(/\\bbis_[^\\s]+/g, '')
                      .replace(/\\s+/g, ' ')
                      .trim();
                  }
                });
              });
            }

            // Run immediately and repeatedly
            removeExtensionAttributes();

            // Run every second for the first 10 seconds
            let counter = 0;
            const interval = setInterval(() => {
              removeExtensionAttributes();
              counter++;
              if (counter >= 10) clearInterval(interval);
            }, 1000);

            // Run after DOM changes
            const observer = new MutationObserver(() => {
              removeExtensionAttributes();
            });

            observer.observe(document.documentElement, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: attributes
            });
          `}
        </Script>
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
                  <AuthButton />
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
