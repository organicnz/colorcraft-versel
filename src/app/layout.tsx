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
        {/* CRITICAL: Ultra-aggressive anti-flash - runs immediately */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // NUCLEAR ANTI-FLASH - Execute immediately, no delays
              console.log('🚀 [NUCLEAR] Anti-flash script starting...');
              (function() {
                try {
                  console.log('🔍 [NUCLEAR] Document ready state:', document.readyState);
                  console.log('🔍 [NUCLEAR] HTML classes before:', document.documentElement.className);
                  
                  // Get theme immediately
                  var theme = 'light';
                  try {
                    var stored = localStorage.getItem('theme');
                    console.log('🔍 [NUCLEAR] Stored theme:', stored);
                    if (stored === 'dark' || stored === 'light') {
                      theme = stored;
                      console.log('✅ [NUCLEAR] Using stored theme:', theme);
                    } else if (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      theme = 'dark';
                      console.log('✅ [NUCLEAR] Using system dark theme');
                    } else {
                      console.log('✅ [NUCLEAR] Using default light theme');
                    }
                  } catch(e) {
                    console.warn('⚠️ [NUCLEAR] Error reading localStorage:', e);
                  }
                  
                  // Apply theme class RIGHT NOW
                  var html = document.documentElement;
                  console.log('🎨 [NUCLEAR] Applying theme:', theme);
                  if (theme === 'dark') {
                    html.classList.add('dark');
                    html.style.colorScheme = 'dark';
                    console.log('🌙 [NUCLEAR] Dark theme applied to HTML');
                  } else {
                    html.classList.remove('dark');
                    html.style.colorScheme = 'light';
                    console.log('☀️ [NUCLEAR] Light theme applied to HTML');
                  }
                  console.log('🔍 [NUCLEAR] HTML classes after theme:', html.className);
                  
                  // NUCLEAR LOCKDOWN - Hide everything immediately
                  console.log('🔒 [NUCLEAR] Injecting lockdown styles...');
                  var style = document.createElement('style');
                  style.id = 'nuclear-lockdown';
                  var bg = theme === 'dark' ? '#0f172a' : '#ffffff';
                  style.textContent = 
                    'html{visibility:hidden!important;opacity:0!important;background:' + bg + '!important}' +
                    'body{visibility:hidden!important;opacity:0!important}' +
                    '*,*::before,*::after{transition:none!important;animation:none!important;transform:none!important;' +
                    '-webkit-transition:none!important;-webkit-animation:none!important;-webkit-transform:none!important}' +
                    '[class*="animate-"],[class*="transition-"]{animation:none!important;transition:none!important}';
                  
                  document.head.appendChild(style);
                  console.log('✅ [NUCLEAR] Lockdown styles injected with background:', bg);
                  
                  // REVEAL FUNCTION - only once
                  var revealed = false;
                  var revealAttempt = 0;
                  function reveal(source) {
                    revealAttempt++;
                    console.log('🎯 [NUCLEAR] Reveal attempt #' + revealAttempt + ' from:', source);
                    if (revealed) {
                      console.log('⚠️ [NUCLEAR] Already revealed, ignoring attempt from:', source);
                      return;
                    }
                    revealed = true;
                    console.log('🚀 [NUCLEAR] Starting reveal process...');
                    
                    try {
                      var lockdown = document.getElementById('nuclear-lockdown');
                      if (lockdown) {
                        lockdown.remove();
                        console.log('✅ [NUCLEAR] Lockdown styles removed');
                      } else {
                        console.warn('⚠️ [NUCLEAR] Lockdown styles not found');
                      }
                      
                      console.log('👁️ [NUCLEAR] Making page visible...');
                      html.style.visibility = 'visible';
                      html.style.opacity = '1';
                      document.body.style.visibility = 'visible';
                      document.body.style.opacity = '1';
                      
                      console.log('🏷️ [NUCLEAR] Adding ready classes...');
                      html.classList.add('ready');
                      document.body.classList.add('loaded', 'transitions-enabled');
                      
                      console.log('✅ [NUCLEAR] Nuclear anti-flash complete!');
                      console.log('🔍 [NUCLEAR] Final HTML classes:', html.className);
                      console.log('🔍 [NUCLEAR] Final body classes:', document.body.className);
                    } catch(e) {
                      console.error('❌ [NUCLEAR] Error during reveal:', e);
                      html.style.cssText = 'visibility:visible!important;opacity:1!important';
                      document.body.style.cssText = 'visibility:visible!important;opacity:1!important';
                      console.log('🚨 [NUCLEAR] Emergency fallback activated');
                    }
                  }
                  
                  // Multiple reveal triggers
                  console.log('⏰ [NUCLEAR] Setting up reveal timers...');
                  setTimeout(function() { reveal('50ms timer'); }, 50);   // Very fast
                  setTimeout(function() { reveal('200ms timer'); }, 200);  // Fast fallback
                  setTimeout(function() { reveal('500ms timer'); }, 500);  // Medium fallback
                  setTimeout(function() { reveal('1000ms timer'); }, 1000); // Slow fallback
                  
                  // DOM ready reveal
                  console.log('📄 [NUCLEAR] Setting up DOM ready listener...');
                  if (document.readyState === 'loading') {
                    console.log('⏳ [NUCLEAR] Document still loading, adding event listener');
                    document.addEventListener('DOMContentLoaded', function() {
                      console.log('📄 [NUCLEAR] DOMContentLoaded fired');
                      reveal('DOMContentLoaded');
                    });
                  } else {
                    console.log('✅ [NUCLEAR] Document already ready, revealing immediately');
                    reveal('immediate - doc ready');
                  }
                  
                  console.log('🎯 [NUCLEAR] All reveal triggers set up');
                  
                } catch(e) {
                  console.error('💥 [NUCLEAR] Fatal error in anti-flash script:', e);
                  // Emergency: show everything
                  document.documentElement.style.cssText = 'visibility:visible!important;opacity:1!important';
                  document.body.style.cssText = 'visibility:visible!important;opacity:1!important';
                  console.log('🚨 [NUCLEAR] Emergency reveal executed due to error');
                }
              })();
              console.log('🏁 [NUCLEAR] Anti-flash script setup complete');
            `,
          }}
        />
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
