'use client'

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Navigation() {
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
            ? "liquid-glass mt-3 rounded-3xl px-6 py-3 shadow-xl shadow-black/20 md:mt-4"
            : "py-6"
        }`}
      >
        <div className="flex w-full flex-col items-center gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
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

              {/* <Logo /> */}
              <span className="font-playfair text-2xl font-bold text-mountain-gold tracking-wide">
                Mountain Mixology
              </span>
            </button>
          </motion.div>

          <div className="flex w-full flex-wrap items-center justify-center gap-2 md:flex-1 md:justify-end md:gap-6">
            <button
              onClick={() => scrollToSection("about")}
              className="appearance-none rounded-full bg-transparent px-3 py-1 text-sm font-medium text-white/80 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:px-0 md:py-0 md:text-base"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="appearance-none rounded-full bg-transparent px-3 py-1 text-sm font-medium text-white/80 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:px-0 md:py-0 md:text-base"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("cocktails")}
              className="appearance-none rounded-full bg-transparent px-3 py-1 text-sm font-medium text-white/80 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:px-0 md:py-0 md:text-base"
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
              className="rounded-full bg-mountain-gold px-5 py-2 text-sm font-semibold text-charcoal transition-all duration-300 hover:bg-copper md:px-6"
            >
              Book Event
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
