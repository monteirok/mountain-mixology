'use client'

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isGlassActive, setIsGlassActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const navLinks = [
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "cocktails", label: "Cocktails" },
  ] as const;

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 z-50 w-full bg-transparent px-4 transition-all duration-500 ease-out"
    >
      <div
        className={`container mx-auto px-6 transition-all duration-500 ${
          isGlassActive
            ? "liquid-glass mobile-liquid mt-3 rounded-3xl px-6 py-3 shadow-xl shadow-black/20 md:mt-4"
            : "py-6"
        }`}
      >
        <div className="flex w-full items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button
              className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              onClick={() => handleNavClick("hero")}
              aria-label="Go to top of page"
            >
              <span className="font-playfair text-2xl font-bold tracking-wide text-mountain-gold">
                Mountain Mixology
              </span>
            </button>
          </motion.div>

          <div className="flex items-center gap-6">
            <div className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className="appearance-none rounded-full bg-transparent px-3 py-1 text-base font-medium text-white/80 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleNavClick("contact")}
                className="rounded-full bg-mountain-gold px-6 py-2 text-base font-semibold text-charcoal transition-all duration-300 hover:bg-copper"
              >
                Book Event
              </button>
            </div>

            <motion.button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label="Toggle navigation menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors duration-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:hidden"
              initial={false}
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <span className="sr-only">Toggle navigation</span>
              {isMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </motion.button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isMenuOpen ? (
            <motion.div
              key="mobile-menu"
              id="mobile-navigation"
              initial={{ opacity: 0, height: 0, y: -12 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mt-3 md:hidden"
            >
              <div className="flex flex-col gap-1 overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-3 shadow-xl shadow-black/20 backdrop-blur-2xl">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavClick(link.id);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-white/90 transition-colors duration-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                    whileTap={{ scale: 0.97 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.a
                  href="#contact"
                  onClick={(event) => {
                    event.preventDefault();
                    handleNavClick("contact");
                  }}
                  className="mt-2 rounded-xl bg-mountain-gold px-4 py-3 text-sm font-semibold text-charcoal transition-all duration-300 hover:bg-copper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  whileTap={{ scale: 0.97 }}
                >
                  Book Event
                </motion.a>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </nav>
  );
}
