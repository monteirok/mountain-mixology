'use client'

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);


  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-all duration-300">
      <div className="container flex mx-auto items-center justify-between px-6 py-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button className="text-[1.4rem] font-playfair font-bold text-mountain-gold" onClick={() => scrollToSection("hero")}>
            Mountain Mixology
          </button>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-8 md:flex">
          <button
            onClick={() => scrollToSection("about")}
            className="text-white/80 transition-colors duration-300 hover:text-white"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("services")}
            className="text-white/80 transition-colors duration-300 hover:text-white"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection("cocktails")}
            className="text-white/80 transition-colors duration-300 hover:text-white"
          >
            Cocktails
          </button>
          <button
            onClick={() => scrollToSection("gallery")}
            className="text-white/80 transition-colors duration-300 hover:text-white"
          >
            Gallery
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="hover-lift rounded-full bg-mountain-gold px-6 py-2 text-sm font-semibold text-charcoal transition-all duration-300 hover:bg-copper"
          >
            Book Event
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center md:hidden">
          <button
            className="text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute left-0 right-0 top-full origin-top transform md:hidden"
            >
              <div className="mx-6 mt-4 rounded-lg bg-black/90 px-6 py-4 backdrop-blur">
                <button
                  onClick={() => scrollToSection("hero")}
                  className="block w-full text-left text-white/80 transition-colors duration-300 hover:text-white"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="block w-full text-left text-white/80 transition-colors duration-300 hover:text-white"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="block w-full text-left text-white/80 transition-colors duration-300 hover:text-white"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection("cocktails")}
                  className="block w-full text-left text-white/80 transition-colors duration-300 hover:text-white"
                >
                  Cocktails
                </button>
                <button
                  onClick={() => scrollToSection("gallery")}
                  className="block w-full text-left text-white/80 transition-colors duration-300 hover:text-white"
                >
                  Gallery
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="mt-4 w-full rounded-full bg-mountain-gold px-6 py-2 text-center font-semibold text-charcoal transition-all duration-300 hover:bg-copper"
                >
                  Book Event
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
