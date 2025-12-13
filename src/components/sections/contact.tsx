'use client'

import { motion } from 'framer-motion'

import BookingForm from '@/components/BookingForm'

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-24 bg-white dark:bg-[#192129] transition-colors duration-500">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-mountain-gold/12 via-transparent to-transparent dark:from-mountain-gold/10" />
      <div className="pointer-events-none absolute -left-1/2 top-24 h-72 w-72 rounded-full bg-mountain-gold/15 blur-3xl dark:bg-mountain-gold/20" />
      <div className="pointer-events-none absolute -right-1/3 bottom-24 h-96 w-96 rounded-full bg-forest/12 blur-3xl dark:bg-forest/20" />

      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-5 text-4xl font-playfair font-bold text-forest dark:text-mountain-gold md:text-5xl">
            Book Your Event
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-charcoal/80 dark:text-white/70 md:text-xl">
            Share your vision and let us know the details. We{"'"}ll respond with availability, curated cocktail concepts,
            and the next steps to shape an unforgettable celebration.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="rounded-[32px] border border-white/40 bg-white/85 px-8 py-10 shadow-[0_26px_70px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-[0_30px_80px_rgba(2,6,23,0.55)]">
            <div className="mb-8 space-y-3 text-center">
              <h3 className="text-3xl font-playfair font-semibold text-charcoal dark:text-white">
                Submit a Booking Request
              </h3>
              <p className="text-base text-charcoal/70 dark:text-white/70">
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
