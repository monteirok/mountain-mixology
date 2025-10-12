'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Clock, Instagram, Mail, MapPin } from 'lucide-react'

const highlights = [
  'Licensed & insured cocktail professionals',
  'Locally sourced, seasonal ingredients',
  'Bespoke menu design and event consultation',
  'Premium bar setup and equipment included',
  'Flexible packages tailored to every celebration',
]

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-24">
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

        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
          <motion.div
            className="space-y-10"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-[30px] border border-white/50 bg-white/90 shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all duration-500 dark:border-white/10 dark:bg-slate-900/80 dark:shadow-[0_30px_80px_rgba(2,6,23,0.55)]">
              <div className="border-b border-white/60 px-10 py-8 dark:border-white/10">
                <h3 className="text-2xl font-playfair font-semibold text-charcoal dark:text-white">
                  Booking Requests
                </h3>
                <p className="mt-3 max-w-xl text-sm text-charcoal/70 dark:text-white/60">
                  We{"'"}re currently taking reservations exclusively through email. Reach out with your event vision and we{"'"}ll follow up with availability, curated menus, and next steps tailored to your celebration.
                </p>
              </div>

              <div className="px-10 pb-10 pt-8">
                <div className="space-y-6 text-charcoal/80 dark:text-white/80">
                  <p className="text-base leading-relaxed">
                    Please email us at{' '}
                    <a
                      className="font-semibold text-mountain-gold transition-colors hover:text-copper"
                      href="mailto:reservations@mountainmixology.ca"
                    >
                      reservations@mountainmixology.ca
                    </a>{' '}
                    with your event details, preferred dates, and any special requests. Our team will personally respond within 24 hours.
                  </p>
                  <div className="rounded-2xl bg-mountain-gold/15 p-6 text-sm font-medium text-charcoal dark:bg-white/10 dark:text-white/80">
                    <p className="mb-2 font-semibold text-forest dark:text-mountain-gold">Helpful details to include:</p>
                    <ul className="space-y-2">
                      <li>• Event date, venue, and guest count</li>
                      <li>• Desired cocktail style or theme</li>
                      <li>• Service needs (full bar, signature menu, tastings)</li>
                      <li>• Any special requests or inspirations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-forest/15 bg-forest/90 p-8 shadow-[0_30px_65px_rgba(15,23,42,0.25)] dark:border-forest/20 dark:bg-forest/85">
              <h3 className="mb-6 text-xl font-playfair font-semibold text-white">Why Hosts Choose Us</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {highlights.map((highlight) => (
                  <div key={highlight} className="flex items-start gap-3 rounded-xl bg-white/5 p-4 text-white/90 backdrop-blur-sm">
                    <CheckCircle className="mt-1 flex-shrink-0 text-mountain-gold" size={20} />
                    <span className="leading-relaxed">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-[30px] border border-white/35 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.14)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:text-white">
              <h3 className="text-2xl font-playfair font-semibold text-charcoal dark:text-white">
                Prefer to reach out directly?
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/70 dark:text-white/70">
                We love hearing about new celebrations. Share the essentials and our lead mixologist will respond with availability,
                curated ideas, and next steps tailored to your event.
              </p>

              <div className="mt-8 space-y-6 text-sm text-charcoal/80 dark:text-white/70">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-mountain-gold/20">
                    <MapPin className="text-mountain-gold" size={20} />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold text-charcoal dark:text-white">Service Area</h4>
                    <p>Canmore · Banff · Calgary · Rocky Mountain region</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-mountain-gold/20">
                    <Mail className="text-mountain-gold" size={20} />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold text-charcoal dark:text-white">Email</h4>
                    <a
                      className="text-mountain-gold transition-colors hover:text-copper"
                      href="mailto:reservations@mountainmixology.ca"
                    >
                      reservations@mountainmixology.ca
                    </a>
                    <p className="mt-1 text-xs text-charcoal/60 dark:text-white/60">
                      We aim to reply within 24 hours (same day for urgent requests).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-mountain-gold/20">
                    <Clock className="text-mountain-gold" size={20} />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold text-charcoal dark:text-white">Best Time to Meet</h4>
                    <p>Weekdays 10am – 6pm MT · Weekend tastings by appointment</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/35 bg-white/80 p-8 text-center shadow-[0_15px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
              <h3 className="text-xl font-playfair font-semibold text-charcoal dark:text-white">Follow Our Craft</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70 dark:text-white/70">
                Sneak peeks, new menus, and our favourite pours from recent mountain soirées.
              </p>
              <div className="mt-7 flex justify-center">
                <a
                  className="group flex h-12 w-12 items-center justify-center rounded-full bg-mountain-gold/20 text-mountain-gold transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-mountain-gold hover:text-white dark:bg-white/10"
                  href="https://instagram.com/mountain.mixology"
                  rel="noreferrer"
                  target="_blank"
                >
                  <Instagram
                    size={20}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
