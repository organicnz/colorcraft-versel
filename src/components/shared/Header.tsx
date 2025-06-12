"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, Menu, X } from "lucide-react";
import NavbarAuth from "./NavbarAuth";
import ThemeSwitcher from "./ThemeSwitcher";
import { User } from "@supabase/supabase-js";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const { scrollY } = useScroll();
  const [homepageStyle, setHomepageStyle] = useState("modern");
  const [isMounted, setIsMounted] = useState(false);

  // Advanced scroll-based transforms
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 0.98]);
  const headerScale = useTransform(scrollY, [0, 100], [1, 0.98]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const getInitialUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getInitialUser();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    const savedStyle = localStorage.getItem("colorcraft-homepage-modern");
    setHomepageStyle(savedStyle === "false" ? "classic" : "modern");
    setIsMounted(true);

    const handleStorageChange = () => {
      const updatedStyle = localStorage.getItem("colorcraft-homepage-modern");
      setHomepageStyle(updatedStyle === "false" ? "classic" : "modern");
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [supabase.auth]);

  const navigationItems = [
    {
      href: "/",
      label: "Home",
      description: "Welcome to Color & Craft",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      href: "/portfolio",
      label: "Portfolio",
      description: "Our stunning transformations",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      href: "/services",
      label: "Services",
      description: "What we offer",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      href: "/contact",
      label: "Contact",
      description: "Get in touch",
      gradient: "from-amber-500 to-orange-600",
    },
  ];

  if (!isMounted) {
    return <header className="sticky top-0 z-50 w-full border-b h-24 bg-transparent" />;
  }
  
  if (homepageStyle === "classic") {
    return (
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between py-4">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/logo-abstract-small.jpg"
                alt="Color&Craft Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="hidden font-bold sm:inline-block font-display text-lg">
                Color & Craft
              </span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center text-lg font-medium text-foreground/60 transition-colors hover:text-foreground/80 sm:text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-2">
             <ThemeSwitcher />
             <NavbarAuth user={user} />
             {/* Mobile Menu can be added here if needed */}
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Floating cursor effect */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 bg-gradient-to-r from-primary-400/30 to-primary-600/30 rounded-full pointer-events-none z-[60] mix-blend-multiply"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{ type: "spring", mass: 0.1, stiffness: 1000, damping: 28 }}
      />

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          opacity: headerOpacity,
          scale: headerScale,
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-white/20 dark:border-slate-800 shadow-md"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        {/* Premium gradient overlay - only show when scrolled */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 transition-opacity duration-300 ${
            isScrolled ? "opacity-50" : "opacity-0"
          }`}
        />

        {/* Animated border */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500"
          initial={{ width: "0%" }}
          animate={{ width: isScrolled ? "100%" : "0%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="flex justify-between items-center h-24">
            {/* Enhanced Logo */}
            <Link href="/" className="flex items-center group relative">
              <motion.div
                className="relative"
                style={{ scale: logoScale }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <Image
                  src="/images/logo-abstract-small.jpg"
                  alt="Color&Craft Logo"
                  width={56}
                  height={56}
                  className="mr-4 rounded-2xl object-cover transition-all duration-500 group-hover:shadow-2xl shadow-primary/25 relative z-10"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 via-transparent to-accent/30 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </motion.div>

              <div className="flex flex-col">
                <motion.span
                  className="text-2xl lg:text-3xl font-display font-bold bg-gradient-to-r from-slate-900 via-primary-700 to-accent-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  Color & Craft
                </motion.span>
                <span className="text-xs font-body text-slate-500 -mt-1 tracking-wider uppercase opacity-80">
                  Premium Furniture Artistry
                </span>
              </div>

              {/* Sparkle effect */}
              <motion.div
                className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-primary-500" />
              </motion.div>
            </Link>

            {/* Enhanced Desktop Menu */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Link
                    href={item.href}
                    className="relative px-6 py-3 font-body font-medium text-slate-700 hover:text-slate-900 transition-all duration-300 group rounded-2xl"
                  >
                    {/* Magnetic hover effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm border border-white/30 opacity-0 group-hover:opacity-100 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />

                    {/* Gradient underline */}
                    <span
                      className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r ${item.gradient} transition-all duration-300 group-hover:w-8 rounded-full`}
                    />

                    <span className="relative z-10">{item.label}</span>

                    {/* Tooltip */}
                    <motion.div
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap"
                      initial={{ y: -10, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.description}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Enhanced Auth Buttons (Desktop) */}
            <div className="hidden lg:flex items-center space-x-4">
              <ThemeSwitcher />
              <NavbarAuth user={user} />
            </div>

            {/* Enhanced Mobile menu button */}
            <motion.button
              type="button"
              className="lg:hidden p-3 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-white/60 backdrop-blur-sm border border-white/30 transition-all duration-300 relative group"
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">Toggle menu</span>
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Enhanced Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="lg:hidden overflow-hidden"
              >
                <motion.div
                  className="py-8 space-y-2 bg-white/90 backdrop-blur-2xl rounded-3xl mt-6 mb-6 border border-white/40 shadow-2xl shadow-black/10 mx-2"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  {/* Mobile navigation items */}
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
                    >
                      <Link
                        href={item.href}
                        className="group block px-6 py-4 font-body font-medium text-slate-700 hover:text-slate-900 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent rounded-2xl mx-3 transition-all duration-300 relative"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{item.label}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                          </div>
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                        </div>
                        <div
                          className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full`}
                        />
                      </Link>
                    </motion.div>
                  ))}

                  {/* Mobile auth buttons */}
                  <motion.div
                    className="pt-6 mt-6 border-t border-slate-200/50 flex items-center justify-center space-y-0 space-x-4 px-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    <ThemeSwitcher />
                    <NavbarAuth user={user} />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}
