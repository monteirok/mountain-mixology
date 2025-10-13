import { Instagram } from "lucide-react";

const quickLinks = [
  { id: "about", label: "About Us" },
  { id: "services", label: "Services" },
  { id: "cocktails", label: "Our Cocktails" },
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

  return (
    <footer className="bg-charcoal dark:bg-black text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
          <button
                  onClick={() => scrollToSection("hero")}
                >
                  <h3 className="text-2xl font-playfair font-bold mb-4 text-mountain-gold">Mountain Mixology</h3>
                </button>
            <p className="mb-4 opacity-80 leading-relaxed">
              Premium craft cocktail catering in the heart of the Canadian Rockies.
              Elevating your celebrations with exceptional service and unforgettable drinks.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/mountain.mixology" target="_blank" rel="noreferrer" className="text-mountain-gold hover:text-white transition-colors">
                <Instagram size={24} />
              </a>
              {/* <a href="#" className="text-mountain-gold hover:text-white transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-mountain-gold hover:text-white transition-colors">
                <Linkedin size={24} />
              </a> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 opacity-80">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="hover:text-mountain-gold transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 opacity-80">
              <li>
                <a href="#" className="hover:text-mountain-gold transition-colors">
                  Wedding Cocktails
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-mountain-gold transition-colors">
                  Corporate Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-mountain-gold transition-colors">
                  Private Parties
                </a>
              </li>
              {/* <li>
                <a href="#" className="hover:text-mountain-gold transition-colors">
                  Cocktail Classes
                </a>
              </li> */}
              <li>
                <a href="#" className="hover:text-mountain-gold transition-colors">
                  Full Bar Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3 opacity-80">
              <div>
                <p className="font-medium">Service Area:</p>
                <p>Canmore, Banff, Calgary & Rockies</p>
              </div>
              {/* <div>
                <p className="font-medium">Phone:</p>
                <a
                  href="tel:+1-403-555-0123"
                  className="hover:text-mountain-gold transition-colors"
                >
                  (403) 555-0123
                </a>
              </div> */}
              <div>
                <p className="font-medium">Email:</p>
                <a
                  href="mailto:mountainmixologyca@gmail.com"
                  className="hover:text-mountain-gold transition-colors"
                >
                  mountainmixologyca@gmail.com
                </a>
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
