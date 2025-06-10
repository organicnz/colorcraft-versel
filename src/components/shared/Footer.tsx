"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Phone, Mail, MapPin, ArrowRight, Heart, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl" />
      </div>

      {/* Modern Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative">
        {/* Newsletter Section */}
        <div className="border-b border-white/10">
          <div className="container mx-auto py-16 px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Sparkles className="w-8 h-8 text-violet-400" />
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                    Stay Inspired
                  </h3>
                  <Sparkles className="w-8 h-8 text-violet-400" />
                </div>

                <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                  Get the latest design trends, transformation tips, and exclusive offers delivered to your inbox.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-xl backdrop-blur-sm h-12"
                  />
                  <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 rounded-xl shadow-lg h-12">
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto py-16 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 p-3 shadow-lg">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                    Color & Craft
                  </h4>
                </div>

                <p className="text-slate-300 leading-relaxed max-w-md">
                  Transforming furniture with expert craftsmanship and artistic vision. We breathe new life into treasured pieces through premium painting, restoration, and custom finishes.
                </p>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span>+1 747 755 7695</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span>hello@colorcraft.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span>Creative District, CA</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h5 className="text-white font-semibold mb-6 text-lg">Services</h5>
              <ul className="space-y-3">
                {[
                  { label: "Custom Painting", href: "/services/custom-painting" },
                  { label: "Furniture Restoration", href: "/services/restoration" },
                  { label: "Creative Upcycling", href: "/services/upcycling" },
                  { label: "Color Consultation", href: "/services/consultation" },
                  { label: "Antique Revival", href: "/services/antique" },
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-slate-300 hover:text-white transition-colors duration-300 group flex items-center gap-2"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h5 className="text-white font-semibold mb-6 text-lg">Company</h5>
              <ul className="space-y-3">
                {[
                  { label: "Our Story", href: "/about" },
                  { label: "Our Team", href: "/about#team" },
                  { label: "Portfolio", href: "/portfolio" },
                  { label: "Process", href: "/services#process" },
                  { label: "Contact Us", href: "/contact" },
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-slate-300 hover:text-white transition-colors duration-300 group flex items-center gap-2"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center">
                <p className="text-slate-300 mb-4">Follow our journey and get inspired</p>
                <div className="flex space-x-4">
                  {[
                    {
                      name: "Facebook",
                      href: "https://www.facebook.com/profile.php?id=61557012322783",
                      icon: (
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                      ),
                      gradient: "from-blue-600 to-blue-800"
                    },
                    {
                      name: "Instagram",
                      href: "#",
                      icon: (
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      ),
                      gradient: "from-pink-600 to-purple-600"
                    },
                    {
                      name: "LinkedIn",
                      href: "#",
                      icon: (
                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                      ),
                      gradient: "from-blue-700 to-blue-900"
                    },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative w-12 h-12 rounded-2xl bg-gradient-to-br ${social.gradient} p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110`}
                      aria-label={`Follow us on ${social.name}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {social.icon}
                      </svg>
                      <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10">
          <div className="container mx-auto py-8 px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
            >
              <div className="flex items-center gap-2 text-slate-400">
                <span>&copy; {new Date().getFullYear()} Color & Craft.</span>
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-400 fill-current" />
                <span>in California</span>
              </div>

              <div className="flex space-x-6">
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Cookie Policy", href: "/cookies" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-6 pt-6 border-t border-white/5"
            >
              <p className="text-xs text-slate-500 text-center max-w-4xl mx-auto leading-relaxed">
                Color & Craft is committed to providing high-quality furniture painting and restoration services.
                Our expert craftspeople use premium materials and time-tested techniques to transform your cherished
                furniture pieces into stunning works of art. Every project is a testament to our dedication to
                excellence and artistic vision.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}