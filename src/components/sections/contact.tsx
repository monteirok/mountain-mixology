'use client'

import { motion } from 'framer-motion'

import BookingForm from '@/components/ui/BookingForm'

export default function Contact() {
  return (
    <section id="contact" className="py-16 bg-neutral-200 dark:bg-[#101519] transition-colors duration-500 relative overflow-hidden">
      {/* Liquid Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-mountain-gold/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
        <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] bg-forest/10 dark:bg-mountain-gold/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="h-px w-12 bg-mountain-gold" />
          <span className="text-sm font-bold tracking-widest text-mountain-gold uppercase">
            Book Event
          </span>
          <span className="h-px w-12 bg-mountain-gold" />
        </div>
        <motion.div
          className="mx-auto max-w-4xl relative"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute -inset-4 bg-white/30 dark:bg-white/5 rounded-[3rem] blur-2xl -z-10" />
          <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/20 bg-white/40 dark:bg-white/5 backdrop-blur-xl shadow-2xl">
            <div className="mb-10 space-y-3 text-center">
              <h3 className="text-3xl font-playfair font-semibold text-charcoal dark:text-white">
                Submit a Booking Request
              </h3>
              <p className="text-base text-charcoal/70 dark:text-white/70 font-light">
                Share your event details and we{"'"}ll follow up with availability, curated cocktail concepts, and next steps.
              </p>
            </div>

            <BookingForm />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
