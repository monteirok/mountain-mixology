'use client'

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Logo from "../components/ui/logo";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGlassActive, setIsGlassActive] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let heroElement = document.getElementById("hero");

    const ensureHero = () => {
      if (heroElement) {
        return heroElement;
      }
      heroElement = document.getElementById("hero");
      return heroElement;
    };

    const handleScroll = () => {
      const hero = ensureHero();
      const navHeight = navRef.current?.offsetHeight ?? 0;
      const buffer = 24;

      if (!hero) {
        const pastFallback = window.scrollY > 120;
        setIsGlassActive((prev) =>
          prev === pastFallback ? prev : pastFallback
        );
        return;
      }

      const heroBottom = hero.getBoundingClientRect().bottom;
      const shouldActivate = heroBottom <= navHeight + buffer;

      setIsGlassActive((prev) =>
        prev === shouldActivate ? prev : shouldActivate
      );
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 z-50 w-full bg-transparent px-4 transition-all duration-500 ease-out"
    >
      <div
        className={`container mx-auto flex items-center justify-between px-6 transition-all duration-500 ${
          isGlassActive
            ? "liquid-glass mt-3 rounded-3xl px-6 py-3 shadow-xl shadow-black/20 md:mt-4"
            : "py-6"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            onClick={() => scrollToSection("hero")}
            aria-label="Go to top of page"
          >
            {/* <Image
              src="/logo.png"
              alt="Mountain Mixology"
              width={180}
              height={60}
              priority
              className="h-12 w-auto"
            /> */}

            <Logo />
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
          {/* <button
            onClick={() => scrollToSection("gallery")}
            className="text-white/80 transition-colors duration-300 hover:text-white"
          >
            Gallery
          </button> */}
          <button
            onClick={() => scrollToSection("contact")}
            className="rounded-full bg-mountain-gold px-6 py-2 text-sm font-semibold text-charcoal transition-all duration-300 hover:bg-copper"
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
                {/* <button
                  onClick={() => scrollToSection("gallery")}
                  className="block w-full text-left text-white/80 transition-colors duration-300 hover:text-white"
                >
                  Gallery
                </button> */}
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
