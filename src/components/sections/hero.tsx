'use client'

import { motion } from "framer-motion";

import BookEventButton from "../ui/BookEventButton";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      className="relative flex min-h-screen items-center bg-[#161616]/20 bg-cover bg-center md:bg-fixed"
      id="hero"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
        backgroundPosition: "center top",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#161616]/80 via-[#161616]/60 to-[#161616]/20" />

      {/* HEADING */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-5 py-20 text-center text-white sm:gap-12 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16 lg:py-32">
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
          className="max-w-3xl text-base leading-relaxed text-slate-200 sm:text-lg lg:text-xl"
        >
          Premium craft cocktail catering in the heart of the Canadian Rockies. Elevating your celebrations with exceptional service and unforgettable drinks.
        </motion.p>

        {/* BUTTONS (x2) */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <BookEventButton
            onClick={() => scrollToSection("contact")}
          >
            Book Event
          </BookEventButton>
          <BookEventButton
            onClick={() => scrollToSection("services")}
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-white border border-white/25 bg-white/10 backdrop-blur-xl hover:bg-white/15 transition"
          >
            View Services
          </BookEventButton>
        </motion.div>
      </div>
    </section>
  );
}
