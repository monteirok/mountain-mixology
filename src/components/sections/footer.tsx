import { useState, MouseEvent } from "react";
import { Instagram, Check, MapPin, Mail } from "lucide-react";

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
    // Check if mobile (using 768px as breakpoint, same as navigation)
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (!isMobile) {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText("bookings@mountainmixology.ca");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy email:", err);
        // Fallback to mailto if copy fails
        window.location.href = "mailto:bookings@mountainmixology.ca";
      }
    }
  };



  return (
    <footer className="bg-charcoal dark:bg-[#161616] text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 mb-12">
          {/* Company Info */}
          <div>
            <button onClick={() => scrollToSection("hero")}>
              <h3 className="text-2xl font-playfair font-bold mb-4 text-mountain-gold">Mountain Mixology</h3>
            </button>
            <p className="mb-4 text-sm font-light opacity-80 leading-relaxed">
              Premium craft cocktail catering in the heart of the Canadian Rockies.
              Elevating your celebrations with exceptional service and unforgettable drinks.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-2 text-lg font-bold">Quick Links</h4>
            <ul className="space-y-2 opacity-80">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-sm font-light hover:text-mountain-gold transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-2 text-lg font-bold">Services</h4>
            <ul className="space-y-2 opacity-80">
              <li>
                <span className="text-sm font-light">
                  Wedding Cocktails
                </span>
              </li>
              <li>
                <span className="text-sm font-light">
                  Corporate Events
                </span>
              </li>
              <li>
                <span className="text-sm font-light">
                  Private Parties
                </span>
              </li>
              {/* <li>
                <span className="text-sm font-light">
                  Cocktail Classes
                </span>
              </li> */}
              <li>
                <span className="text-sm font-light">
                  Full Bar Service
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-2 text-lg font-bold">Contact</h4>
            <div className="space-y-3 opacity-80 ml-1">
              <div className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-mountain-gold shrink-0" />
                <a href="https://instagram.com/mountain.mixology" className="text-sm font-light hover:text-mountain-gold transition-colors" rel="noreferrer" target="_blank">@mountain.mixology</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-mountain-gold shrink-0" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <a 
                      href="mailto:bookings@mountainmixology.ca" 
                      onClick={handleEmailClick}
                      className="text-sm font-light hover:text-mountain-gold transition-colors"
                    >
                      bookings@mountainmixology.ca
                    </a>
                    {copied && (
                      <span className="text-xs text-green-500 flex items-center animate-in fade-in slide-in-from-left-1 duration-300">
                        <Check size={12} className="mr-1" />
                        Copied!
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-mountain-gold shrink-0" />
                <p className="text-sm font-light leading-relaxed">Canmore, Banff, Calgary & surrounding areas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0 opacity-80">
            <p>&copy; 2025 Mountain Mixology. All rights reserved.</p>
          </div>
          <div className="flex space-x-6 text-sm opacity-80">
            <a href="#" className="hover:text-mountain-gold transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-mountain-gold transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-mountain-gold transition-colors">
              Liquor License
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
