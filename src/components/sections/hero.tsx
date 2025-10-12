'use client';

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
      id="hero"
      className="relative flex min-h-screen items-center bg-black/20 bg-fixed bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
        backgroundPosition: "center top",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-6 py-32 text-white md:px-12 lg:px-16">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="tracking-[0.4em] text-xs uppercase text-slate-100 md:text-sm"
        >
          Mountain Mixology
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-playfair text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl"
        >
          Elevated Cocktails,
          <br />
          <span className="text-mountain-gold">Mountain Views</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="max-w-2xl text-base leading-relaxed text-slate-200 md:text-lg lg:text-xl"
        >
          Premium craft cocktail catering in the heart of the Canadian Rockies.
          Transform your event with our signature mixology experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col gap-4 sm:flex-row"
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

      {/* Floating Elements */}
      {/* <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-10 hidden lg:block"
      >
        <div className="glass-card p-6">
          <Wine className="text-mountain-gold text-2xl" size={32} />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-40 right-20 hidden lg:block"
      >
        <div className="glass-card p-6">
          <Sparkles className="text-mountain-gold text-2xl" size={32} />
        </div>
      </motion.div> */}
    </section>
  );
}
