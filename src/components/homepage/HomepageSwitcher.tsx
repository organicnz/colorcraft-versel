"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RotateCcw, Eye, EyeOff } from "lucide-react";

interface HomepageSwitcherProps {
  classicHomepage: React.ReactNode;
  modernHomepage: React.ReactNode;
}

export default function HomepageSwitcher({
  classicHomepage,
  modernHomepage
}: HomepageSwitcherProps) {
  const [isModern, setIsModern] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem('colorcraft-homepage-modern');
    if (saved === 'true') {
      setIsModern(true);
    }
  }, []);

  // Save preference
  useEffect(() => {
    localStorage.setItem('colorcraft-homepage-modern', isModern.toString());
  }, [isModern]);

  const toggleHomepage = () => {
    setIsModern(!isModern);
  };

  const toggleSwitcherVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="relative">
      {/* Floating Switcher */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed top-24 right-6 z-50 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 p-4 space-y-3 max-w-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-600" />
                <span className="font-semibold text-slate-900 text-sm">Homepage Style</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSwitcherVisibility}
                className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
              >
                <EyeOff className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs text-slate-600">
                Choose your preferred homepage design
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={!isModern ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsModern(false)}
                  className={`text-xs h-8 ${!isModern ? 'bg-primary-600 text-white' : 'text-slate-700'}`}
                >
                  Classic
                </Button>
                <Button
                  variant={isModern ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsModern(true)}
                  className={`text-xs h-8 ${isModern ? 'bg-primary-600 text-white' : 'text-slate-700'}`}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Modern
                </Button>
              </div>
            </div>
            
            <div className="pt-2 border-t border-slate-200">
              <div className="text-xs text-slate-500 leading-relaxed">
                {isModern ? (
                  <>
                    <Badge variant="secondary" className="text-xs mb-1">NEW</Badge>
                    <br />
                    Clean, modern design inspired by premium brands
                  </>
                ) : (
                  "Rich, detailed design with advanced animations"
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Toggle Button */}
      <AnimatePresence>
        {!isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-24 right-6 z-50"
          >
            <Button
              onClick={toggleSwitcherVisibility}
              size="sm"
              className="bg-white/95 backdrop-blur-lg text-slate-700 border border-slate-200 shadow-lg hover:bg-white rounded-full h-12 w-12 p-0"
            >
              <Eye className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Toggle Floating Action Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-40"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <Button
          onClick={toggleHomepage}
          size="lg"
          className={`rounded-full h-14 w-14 p-0 shadow-xl border-2 transition-all duration-300 ${
            isModern 
              ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white border-white/20 hover:scale-110' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:scale-105'
          }`}
        >
          <motion.div
            animate={{ rotate: isModern ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
        </Button>
      </motion.div>

      {/* Homepage Content with Smooth Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isModern ? 'modern' : 'classic'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {isModern ? modernHomepage : classicHomepage}
        </motion.div>
      </AnimatePresence>

      {/* Announcement Banner for New Design */}
      <AnimatePresence>
        {isModern && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-center py-2 text-sm"
          >
            <div className="container mx-auto px-4 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>You're viewing our new modern homepage design!</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModern(false)}
                className="text-white hover:bg-white/20 text-xs ml-2"
              >
                Switch Back
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 