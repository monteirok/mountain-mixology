import { useState, MouseEvent } from "react";
import { Instagram, Mail, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const navigateToSection = (
    sectionId: string,
    event?: MouseEvent<HTMLElement>
  ) => {
    event?.preventDefault();
    
    const targetHash = `#${sectionId}`;
    const targetUrl = `/${targetHash}`;
    const onHome = window.location.pathname === "/";
    const element = document.getElementById(sectionId);

    // Small delay to ensure menu closes before scrolling on mobile
    const scrollDelay = window.innerWidth < 1024 ? 100 : 0;

    setTimeout(() => {
      if (element && onHome) {
        // Calculate offset more reliably
        const navElement = document.querySelector("nav");
        const navHeight = navElement ? navElement.offsetHeight : 80;
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

  const [copied, setCopied] = useState(false);

  const handleEmailClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (!isMobile) {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText("bookings@mountainmixology.ca");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy email:", err);
        window.location.href = "mailto:bookings@mountainmixology.ca";
      }
    }
  };

  return (
    <footer className="bg-[#1c1917] text-white py-14">
      <div className="container mx-auto px-6">
        
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start text-center lg:text-left gap-8 md:gap-16">
          
          {/* Left: Description & Socials */}
          <div className="lg:w-1/3 space-y-8 flex flex-col items-center lg:items-start">
            <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button
              className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              onClick={(event) => navigateToSection("hero", event)}
              aria-label="Go to top of page"
            >
              <span className="font-playfair text-3xl font-black tracking-wide text-mountain-gold">
                Mountain Mixology
              </span>
            </button>
          </motion.div>
            
            <div className="space-y-6">
              <div className="flex gap-6 justify-center lg:justify-start">
                <a
                  href="https://instagram.com/mountain.mixology"
                  target="_blank"
                  rel="noreferrer"
                  className="group transition-transform hover:scale-110"
                >
                  <Instagram className="w-8 h-8 text-white hover:text-mountain-gold transition-colors" />
                </a>
                <a
                  href="mailto:bookings@mountainmixology.ca"
                  onClick={handleEmailClick}
                  className="group relative transition-transform hover:scale-110"
                >
                  <Mail className="w-8 h-8 text-white hover:text-mountain-gold transition-colors" />
                  <AnimatePresence>
                    {copied && (
                      <motion.span
                        initial={{ opacity: 0, y: 10, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 10, x: "-50%" }}
                        className="absolute -top-12 left-1/2 flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap text-xs font-medium border border-emerald-500/50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Copied!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Links Columns */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 lg:pl-24 w-full">
            
            {/* Column 1: Quick Links */}
            <div className="space-y-6 flex flex-col items-center lg:items-start">
              <h4 className="text-[1.1rem] font-bold text-white">Quick Links</h4>
              <ul className="space-y-4 text-sm text-white/60 flex flex-col items-center lg:items-start">
                <li>
                  <button onClick={(e) => navigateToSection('services', e)} className="hover:text-white transition-colors">Services</button>
                </li>
                <li>
                  <button onClick={(e) => navigateToSection('contact', e)} className="hover:text-white transition-colors">Book Event</button>
                </li>
              </ul>
            </div>

            <div className="space-y-6 flex flex-col items-center lg:items-start">
              <h4 className="text-[1.1rem] font-bold text-white">Service Area</h4>
              <div className="flex flex-col md:flex-row items-center lg:items-start gap-2 text-sm text-white/60">
                <p>Canmore, Banff, Calgary, and surrounding areas.</p>
              </div>
            </div>

          </div>
        </div>
        
        {/* Divider */}
        <div className="relative w-full h-px my-[3rem] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-center items-center text-xs text-white/40">
          <p>&copy; 2025 Mountain Mixology. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
