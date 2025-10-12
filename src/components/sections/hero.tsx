'use client'

import { motion } from "framer-motion";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      className="relative flex min-h-screen items-center bg-black/20 bg-fixed bg-cover bg-center"
      id="hero"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
        backgroundPosition: "center top",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20" />

      {/* HEADING */}
      <div className="flex flex-col items-center gap-12 relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 lg:px-16 py-32 text-white">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-playfair text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl"
        >
          Elevated Cocktails,
          <br />
          <span className="text-mountain-gold">Memorable Events</span>
        </motion.h1>

        {/* SUBHEADING */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="max-w-2xl text-base leading-relaxed text-slate-200 md:text-lg lg:text-xl"
        >
          Premium craft cocktail catering in the heart of the Canadian Rockies.
          Transform your event with our signature mixology experience.
        </motion.p>

        {/* BUTTONS (x2) */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <button
            onClick={() => scrollToSection("contact")}
            className="hover-lift rounded-full bg-mountain-gold px-8 py-4 text-lg font-semibold text-charcoal transition-all duration-300 hover:bg-copper"
          >
            Book Your Event
          </button>
          <button
            onClick={() => scrollToSection("services")}
            className="rounded-full bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur transition-colors duration-300 hover:bg-white/20"
          >
            View Services
          </button>
        </motion.div>
      </div>
    </section>
  );
}
