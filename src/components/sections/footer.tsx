import { useState, MouseEvent } from "react";
import { Instagram, MapPin, Mail, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const quickLinks = [
  { id: "about", label: "Our Story" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Book Event" },
] as const;

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    if (typeof window === "undefined") {
      return;
    }

    const targetHash = `#${sectionId}`;
    const targetUrl = `/${targetHash}`;
    const onHome = window.location.pathname === "/";

    if (!onHome) {
      window.location.href = targetUrl;
      return;
    }

    const element = document.getElementById(sectionId);

    if (element) {
      const navElement = document.querySelector("nav");
      const navHeight =
        navElement instanceof HTMLElement ? navElement.offsetHeight : 0;
      const offset = navHeight + 24;
      const top =
        element.getBoundingClientRect().top + window.scrollY - offset;

      window.history.replaceState(null, "", targetHash);
      window.scrollTo({
        top: Math.max(top, 0),
        behavior: "smooth",
      });
      return;
    }

    window.location.hash = targetHash;
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
    <footer className="relative bg-stone-200 dark:bg-[#0a0a0a] text-charcoal dark:text-white overflow-hidden py-8 transition-colors duration-500">
      {/* Liquid Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-mountain-gold/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-forest/5 dark:bg-forest/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 mb-4">
          
          {/* 1. Brand Card (Left) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-charcoal/5 dark:border-white/10 rounded-[2rem] p-6 flex flex-col justify-center gap-4 items-center text-center group hover:bg-white/60 dark:hover:bg-white/10 transition-colors duration-500 shadow-sm dark:shadow-none"
          >
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-playfair font-bold text-mountain-gold mb-2">Mountain Mixology</h2>
              <p className="text-charcoal/60 dark:text-white/60 font-light text-sm leading-relaxed max-w-2xl">
                Premium craft cocktail catering in the heart of the Canadian Rockies. Elevating your celebrations with exceptional service.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 w-full items-center justify-center border-t border-charcoal/5 dark:border-white/5 pt-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-mountain-gold/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-mountain-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-widest uppercase text-mountain-gold mb-0.5">Locate Us</h4>
                  <p className="text-charcoal/80 dark:text-white/80 font-light text-sm">Canmore, Banff, Calgary, & Surrounding Areas</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. Quick Links Card (Right) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-charcoal/5 dark:border-white/10 rounded-[2rem] p-6 flex flex-col justify-between gap-4 group hover:bg-white/60 dark:hover:bg-white/10 transition-colors duration-500 shadow-sm dark:shadow-none"
          >
            <div>
              <h4 className="text-sm font-bold tracking-widest uppercase text-mountain-gold mb-3">Quick Links</h4>
              <ul className="space-y-1.5">
                {quickLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="group/link flex items-center justify-between w-full text-sm font-light text-charcoal/80 dark:text-white/80 hover:text-charcoal dark:hover:text-white transition-colors py-1 border-b border-charcoal/5 dark:border-white/10"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center gap-3 border-t border-charcoal/5 dark:border-white/5 pt-4">
              <a 
                href="https://instagram.com/mountain.mixology" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-charcoal/5 dark:bg-white/10 flex items-center justify-center hover:bg-charcoal hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a 
                href="mailto:bookings@mountainmixology.ca"
                onClick={handleEmailClick}
                className="w-8 h-8 rounded-full bg-charcoal/5 dark:bg-white/10 flex items-center justify-center hover:bg-charcoal hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 relative"
              >
                <Mail className="w-3.5 h-3.5" />
                {copied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] bg-charcoal dark:bg-white text-white dark:text-black px-2 py-0.5 rounded whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </a>
            </div>
          </motion.div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center px-2 text-[10px] text-charcoal/30 dark:text-white/30 font-light uppercase tracking-wider">
          <p>&copy; 2025 Mountain Mixology.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-charcoal dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-charcoal dark:hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-charcoal dark:hover:text-white transition-colors">License</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
