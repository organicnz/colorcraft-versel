"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
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
  const supabase = createClient();
  const { scrollY } = useScroll();

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

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
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
            ? "bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border-b border-white/20 dark:border-slate-800 shadow-lg"
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
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-full px-4 py-2 shadow-inner dark:shadow-slate-800/50">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-300 transition-all duration-300 group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                </Link>
              ))}
            </nav>

            {/* Right-side controls */}
            <div className="flex items-center space-x-4">
              <div className="hidden lg:block">
                <ThemeSwitcher />
              </div>

              <div className="hidden lg:flex items-center space-x-2">
                <NavbarAuth user={user} />
              </div>

              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="sr-only">Open menu</span>
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-xl"
            >
              <nav className="flex flex-col p-4 space-y-2">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: index * 0.05 },
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between w-full px-4 py-3 text-lg font-semibold text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {item.label}
                      <ArrowRight size={16} />
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="border-t border-slate-200 dark:border-slate-800 p-4">
                <div className="flex items-center justify-between">
                  <NavbarAuth user={user} />
                  <ThemeSwitcher />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
