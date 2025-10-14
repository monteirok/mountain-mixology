// 'use client'

// import { MouseEvent, useEffect, useRef, useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { Menu, X } from "lucide-react";

// export default function Navigation() {
//   const [isGlassActive, setIsGlassActive] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navRef = useRef<HTMLElement | null>(null);
//   const navBarRef = useRef<HTMLDivElement | null>(null);

//   // Measures the height of the fixed nav bar without the expanded mobile menu.
//   const getVisibleNavHeight = () => {
//     const navElement = navRef.current;
//     const headerElement = navBarRef.current;

//     if (!navElement || !headerElement) {
//       return navElement?.offsetHeight ?? 80; // Fallback height
//     }

//     const containerElement = navElement.firstElementChild as HTMLElement | null;

//     if (!containerElement) {
//       return headerElement.offsetHeight;
//     }

//     const styles = window.getComputedStyle(containerElement);
//     const paddingTop = Number.parseFloat(styles.paddingTop) || 0;
//     const paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;

//     // Return the total height including padding
//     return headerElement.offsetHeight + paddingTop + paddingBottom;
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       const navHeight = getVisibleNavHeight();
//       const buffer = 24;
//       const shouldActivate = window.scrollY > navHeight + buffer;

//       setIsGlassActive((prev) =>
//         prev === shouldActivate ? prev : shouldActivate
//       );
//     };

//     handleScroll();

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     window.addEventListener("resize", handleScroll);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       window.removeEventListener("resize", handleScroll);
//     };
//   }, []);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) {
//         setIsMenuOpen(false);
//       }
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   useEffect(() => {
//     if (!isMenuOpen) {
//       return;
//     }

//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         setIsMenuOpen(false);
//       }
//     };

//     const handleClickOutside = (event: Event) => {
//       const target = event.target as HTMLElement;
//       const navElement = navRef.current;
      
//       // Check if click is outside the navigation element
//       if (navElement && !navElement.contains(target)) {
//         setIsMenuOpen(false);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isMenuOpen]);

//   const navLinks = [
//     { id: "about", label: "About" },
//     { id: "services", label: "Services" },
//     { id: "cocktails", label: "Cocktails" },
//   ] as const;

//   const navigateToSection = (
//     sectionId: string,
//     event?: MouseEvent<HTMLElement>
//   ) => {
//     event?.preventDefault();
    
//     const targetHash = `#${sectionId}`;
//     const targetUrl = `/${targetHash}`;
//     const onHome = window.location.pathname === "/";
//     const element = document.getElementById(sectionId);

//     // Close mobile menu immediately
//     setIsMenuOpen(false);

//     // Small delay to ensure menu closes before scrolling on mobile
//     const scrollDelay = window.innerWidth < 768 ? 100 : 0;

//     setTimeout(() => {
//       if (element && onHome) {
//         // Calculate offset more reliably
//         const navHeight = getVisibleNavHeight();
//         const offset = navHeight + 32; // Increased buffer for better spacing
        
//         const elementTop = element.getBoundingClientRect().top + window.scrollY;
//         const targetPosition = elementTop - offset;

//         // Update URL hash
//         window.history.replaceState(null, "", targetHash);
        
//         // Smooth scroll to target position
//         window.scrollTo({
//           top: Math.max(targetPosition, 0),
//           behavior: "smooth",
//         });
//         return;
//       }

//       // If not on home page or element not found, navigate to home with hash
//       if (!onHome) {
//         window.location.href = targetUrl;
//         return;
//       }

//       // Fallback: just set hash
//       window.location.hash = targetHash;
//     }, scrollDelay);
//   };

//   return (
//     <nav
//       ref={navRef}
//       className="fixed top-0 z-50 w-full bg-transparent px-4 transition-all duration-300 ease-out"
//     >
//       <div
//         className={`container mx-auto px-6 transition-all duration-200 ${
//           isGlassActive
//             ? "liquid-glass-nav mt-3 rounded-3xl px-6 py-3 md:mt-4"
//             : "rounded-3xl border-0 bg-transparent py-6 md:py-7 shadow-none"
//         }`}
//       >
//         <div
//           ref={navBarRef}
//           className="flex w-full items-center justify-between"
//         >
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//           >
//             <button
//               className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
//               onClick={(event) => navigateToSection("hero", event)}
//               aria-label="Go to top of page"
//             >
//               <span className="font-playfair text-2xl font-bold tracking-wide text-mountain-gold">
//                 Mountain Mixology
//               </span>
//             </button>
//           </motion.div>

//           <div className="flex items-center gap-6">
//             <div className="hidden items-center gap-6 md:flex">
//               {navLinks.map((link) => (
//                 <button
//                   key={link.id}
//                   onClick={(event) => navigateToSection(link.id, event)}
//                   className="appearance-none rounded-full bg-transparent px-3 py-1 text-base font-medium text-slate-900/80 transition-colors duration-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:text-white/80 dark:hover:text-white"
//                 >
//                   {link.label}
//                 </button>
//               ))}
//               <button
//                 onClick={(event) => navigateToSection("contact", event)}
//                 className="rounded-full bg-mountain-gold px-6 py-2 text-base font-semibold text-charcoal transition-all duration-300 hover:bg-copper"
//               >
//                 Book Event
//               </button>
//             </div>

//             <motion.button
//               type="button"
//               onClick={() => setIsMenuOpen((prev) => !prev)}
//               aria-expanded={isMenuOpen}
//               aria-controls="mobile-navigation"
//               aria-label="Toggle navigation menu"
//               className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all duration-300 hover:border-white/30 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:hidden dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10"
//               initial={false}
//               animate={{ rotate: isMenuOpen ? 90 : 0 }}
//               transition={{ type: "spring", stiffness: 200, damping: 20 }}
//             >
//               <span className="sr-only">Toggle navigation</span>
//               {isMenuOpen ? (
//                 <X className="h-5 w-5" aria-hidden="true" />
//               ) : (
//                 <Menu className="h-5 w-5" aria-hidden="true" />
//               )}
//             </motion.button>
//           </div>
//         </div>

//         <AnimatePresence initial={false}>
//           {isMenuOpen ? (
//             <motion.div
//               key="mobile-menu"
//               id="mobile-navigation"
//               initial={{ opacity: 0, height: 0, y: -12 }}
//               animate={{ opacity: 1, height: "auto", y: 0 }}
//               exit={{ opacity: 0, height: 0, y: -12 }}
//               transition={{ duration: 0.2, ease: "easeOut" }}
//               className="mt-3 md:hidden"
//             >
//               <div className="liquid-glass-nav-panel flex flex-col gap-1 overflow-hidden rounded-2xl p-3">
//                 {navLinks.map((link) => (
//                   <motion.button
//                     key={link.id}
//                     type="button"
//                     onClick={(event) => navigateToSection(link.id, event)}
//                     className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-900/80 transition-colors duration-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:text-white/90"
//                     whileTap={{ scale: 0.97 }}
//                   >
//                     {link.label}
//                   </motion.button>
//                 ))}
//                 <motion.button
//                   type="button"
//                   onClick={(event) => navigateToSection("contact", event)}
//                   className="mt-2 rounded-xl bg-mountain-gold px-4 py-3 text-sm font-semibold text-charcoal transition-all duration-300 hover:bg-copper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
//                   whileTap={{ scale: 0.97 }}
//                 >
//                   Book Event
//                 </motion.button>
//               </div>
//             </motion.div>
//           ) : null}
//         </AnimatePresence>
//       </div>
//     </nav>
//   );
// }


'use client'

import { MouseEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

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
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "cocktails", label: "Cocktails" },
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
    const scrollDelay = window.innerWidth < 768 ? 100 : 0;

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
                  onClick={(event) => navigateToSection(link.id, event)}
                  className="appearance-none rounded-full bg-transparent px-3 py-1 text-base font-medium text-[#161616] transition-colors duration-300 hover:text-[#161616] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:text-white/80 dark:hover:text-white"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={(event) => navigateToSection("contact", event)}
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
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition-colors duration-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:hidden"
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
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-3 rounded-3xl md:hidden"
            >
              <div className="flex flex-col gap-1 overflow-hidden rounded-2xl p-3">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(event) => navigateToSection(link.id, event)}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-900/80 transition-colors duration-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:text-white/90"
                    whileTap={{ scale: 0.97 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.a
                  href="#contact"
                  onClick={(event) => navigateToSection("contact", event)}
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
