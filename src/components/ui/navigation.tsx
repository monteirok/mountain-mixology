'use client'

import { MouseEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import BookEventButton from "./BookEventButton";

export default function Navigation() {
  const [isGlassActive, setIsGlassActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const navBarRef = useRef<HTMLDivElement | null>(null);

  // Measures the height of the fixed nav bar without the expanded mobile menu.
  const getVisibleNavHeight = () => {
    const navElement = navRef.current;
    const headerElement = navBarRef.current;

    if (!navElement || !headerElement) {
      return navElement?.offsetHeight ?? 80; // Fallback height
    }

    const containerElement = navElement.firstElementChild as HTMLElement | null;

    if (!containerElement) {
      return headerElement.offsetHeight;
    }

    const styles = window.getComputedStyle(containerElement);
    const paddingTop = Number.parseFloat(styles.paddingTop) || 0;
    const paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;

    // Return the total height including padding
    return headerElement.offsetHeight + paddingTop + paddingBottom;
  };

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById("hero");
      const navHeight = getVisibleNavHeight();

      if (!hero) {
        const pastFallback = window.scrollY > 120;
        setIsGlassActive((prev) =>
          prev === pastFallback ? prev : pastFallback
        );
        return;
      }

      const heroRect = hero.getBoundingClientRect();
      const heroHeight = heroRect.height || hero.offsetHeight;

      if (!heroHeight) {
        const pastFallback = window.scrollY > 120;
        setIsGlassActive((prev) =>
          prev === pastFallback ? prev : pastFallback
        );
        return;
      }

      const heroTop = heroRect.top + window.scrollY;
      const activationPoint = heroTop + heroHeight * 0.25;
      const viewportTop = window.scrollY + navHeight;
      const shouldActivate = viewportTop >= activationPoint;

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
      if (window.innerWidth >= 1024) {
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

    const handleClickOutside = (event: Event) => {
      const target = event.target as HTMLElement;
      const navElement = navRef.current;
      
      // Check if click is outside the navigation element
      if (navElement && !navElement.contains(target)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const navLinks = [
    { id: "about", label: "Our Story" },
    { id: "services", label: "Services" },
  ] as const;

  const navigateToSection = (
    sectionId: string,
    event?: MouseEvent<HTMLElement>
  ) => {
    event?.preventDefault();
    
    const targetHash = `#${sectionId}`;
    const targetUrl = `/${targetHash}`;
    const onHome = window.location.pathname === "/";
    const element = document.getElementById(sectionId);

    // Close mobile menu immediately
    setIsMenuOpen(false);

    // Small delay to ensure menu closes before scrolling on mobile
    const scrollDelay = window.innerWidth < 1024 ? 100 : 0;

    setTimeout(() => {
      if (element && onHome) {
        // Calculate offset more reliably
        const navHeight = getVisibleNavHeight();
        const offset = navHeight + 32; // Increased buffer for better spacing
        
        const elementTop = element.getBoundingClientRect().top + window.scrollY;
        const targetPosition = elementTop - offset;

        // Update URL hash
        window.history.replaceState(null, "", targetHash);
        
        // Smooth scroll to target position
        window.scrollTo({
          top: Math.max(targetPosition, 0),
          behavior: "smooth",
        });
        return;
      }

      // If not on home page or element not found, navigate to home with hash
      if (!onHome) {
        window.location.href = targetUrl;
        return;
      }

      // Fallback: just set hash
      window.location.hash = targetHash;
    }, scrollDelay);
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 z-50 w-full bg-transparent px-4 transition-all duration-300 ease-out"
    >
      <div
        className={`container mx-auto px-6 transition-all duration-200 ${
          isGlassActive || isMenuOpen
            ? "liquid-glass-nav mt-3 rounded-3xl px-6 py-3 md:mt-4"
            : "rounded-3xl border-0 bg-transparent py-6 md:py-7 shadow-none"
        }`}
      >
        <div
          ref={navBarRef}
          className="flex w-full items-center justify-between"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button
              className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              onClick={(event) => navigateToSection("hero", event)}
              aria-label="Go to top of page"
            >
              <span className="font-playfair text-2xl md:text-3xl font-black tracking-wide text-mountain-gold">
                Mountain Mixology
              </span>
            </button>
          </motion.div>

          <div className="flex items-center gap-6">
            <div className="hidden items-center gap-6 lg:flex">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={(event) => navigateToSection(link.id, event)}
                  className="appearance-none rounded-full bg-transparent px-3 py-1 text-lg font-medium text-[#161616] transition-colors duration-300 hover:text-[#161616] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:text-white/80 dark:hover:text-white"
                >
                  {link.label}
                </button>
              ))}
              <BookEventButton
                onClick={(event) => navigateToSection("contact", event)}
              >
                Book Event
              </BookEventButton>
            </div>

            <motion.button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label="Toggle navigation menu"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800/5 dark:bg-white/5 text-charcoal dark:text-white transition-colors duration-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent lg:hidden"
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

        {/* MOBILE NAVBAR */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              key="mobile-menu"
              id="mobile-navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="lg:hidden"
            >
              <div className="flex flex-col gap-8 px-2 pb-6 pt-8">
                <div className="flex flex-col gap-5">
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={link.id}
                      href={`#${link.id}`}
                      onClick={(event) => navigateToSection(link.id, event)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.1, duration: 0.4, ease: "easeOut" }}
                      className="text-2xl font-semibold tracking-tight text-neutral-900 indent-3 dark:text-white hover:text-mountain-gold transition-colors"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <BookEventButton
                    onClick={(event) => navigateToSection("contact", event)}
                    className="self-start rounded-full px-6 py-3 text-xl font-semibold shadow-sm"
                  >
                    Book Event
                  </BookEventButton>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
