'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, Instagram, Mail, MapPin } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const highlights = [
  'Licensed & insured cocktail professionals',
  'Locally sourced, seasonal ingredients',
  'Bespoke menu design and event consultation',
  'Premium bar setup and equipment included',
  'Flexible packages tailored to every celebration',
]

const defaultFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  eventType: '',
  guestCount: '',
  eventDate: '',
  budget: '',
  location: '',
  message: '',
}

type FormState = typeof defaultFormState

export default function Contact() {
  const [form, setForm] = useState<FormState>(defaultFormState)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleChange = (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(prev => ({ ...prev, [field]: event.target.value }))
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setFeedback(null)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone || undefined,
          eventType: form.eventType || undefined,
          guestCount: form.guestCount || undefined,
          eventDate: form.eventDate || undefined,
          budget: form.budget || undefined,
          location: form.location || undefined,
          message: form.message,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unable to submit booking request' }))
        throw new Error(error.error ?? 'Unable to submit booking request')
      }

      setForm(defaultFormState)
      setFeedback({ type: 'success', message: "Thanks for reaching out! We'll be in touch within 24 hours." })
    } catch (error) {
      console.error('Booking submission failed', error)
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Unable to submit booking request' })
    } finally {
      setSubmitting(false)
    }
  }

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
                  Tell Us About Your Celebration
                </h3>
                <p className="mt-3 max-w-xl text-sm text-charcoal/70 dark:text-white/60">
                  Provide as much detail as you{"'"}d like—we{"'"}ll tailor a proposal, curated cocktail list,
                  and timeline that fits your event perfectly.
                </p>
              </div>

              <div className="px-10 pb-10 pt-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-charcoal dark:text-white" htmlFor="firstName">
                        First Name *
                      </label>
                      <Input
                        id="firstName"
                        name="firstName"
                        required
                        className="h-12 rounded-xl border border-slate-200/80 bg-white/90 px-4 text-base text-charcoal placeholder:text-charcoal/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] focus-visible:border-mountain-gold focus-visible:ring-mountain-gold/40 dark:border-white/10 dark:bg-slate-900/80 dark:text-white dark:placeholder-white/50"
                        value={form.firstName}
                        onChange={handleChange('firstName')}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-charcoal dark:text-white" htmlFor="lastName">
                        Last Name *
                      </label>
                      <Input
                        id="lastName"
                        name="lastName"
                        required
                        className="h-12 rounded-xl border border-slate-200/80 bg-white/90 px-4 text-base text-charcoal placeholder:text-charcoal/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] focus-visible:border-mountain-gold focus-visible:ring-mountain-gold/40 dark:border-white/10 dark:bg-slate-900/80 dark:text-white dark:placeholder-white/50"
                        value={form.lastName}
                        onChange={handleChange('lastName')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-charcoal dark:text-white" htmlFor="email">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="h-12 rounded-xl border border-slate-200/80 bg-white/90 px-4 text-base text-charcoal placeholder:text-charcoal/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] focus-visible:border-mountain-gold focus-visible:ring-mountain-gold/40 dark:border-white/10 dark:bg-slate-900/80 dark:text-white dark:placeholder-white/50"
                      value={form.email}
                      onChange={handleChange('email')}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-charcoal dark:text-white" htmlFor="phone">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      className="h-12 rounded-xl border border-slate-200/80 bg-white/90 px-4 text-base text-charcoal placeholder:text-charcoal/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] focus-visible:border-mountain-gold focus-visible:ring-mountain-gold/40 dark:border-white/10 dark:bg-slate-900/80 dark:text-white dark:placeholder-white/50"
                      value={form.phone}
                      onChange={handleChange('phone')}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-charcoal dark:text-white" htmlFor="eventType">
                        Event Type
                      </label>
                      <select
                        id="eventType"
                        name="eventType"
                        value={form.eventType}
                        onChange={handleChange('eventType')}
                        className="h-12 w-full rounded-xl border border-slate-200/80 bg-white/90 px-4 text-sm text-charcoal shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] focus:border-mountain-gold focus:outline-none focus:ring-2 focus:ring-mountain-gold/40 dark:border-white/10 dark:bg-slate-900/80 dark:text-white"
                      >
                        <option value="">Select an event</option>
                        <option value="wedding">Wedding</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="private">Private Celebration</option>
                        <option value="class">Cocktail Class</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-charcoal dark:text-white" htmlFor="guestCount">
                        Guest Count
                      </label>
                      <select
                        id="guestCount"
                        name="guestCount"
                        value={form.guestCount}
                        onChange={handleChange('guestCount')}
                        className="h-12 w-full rounded-xl border border-slate-200/80 bg-white/90 px-4 text-sm text-charcoal shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] focus:border-mountain-gold focus:outline-none focus:ring-2 focus:ring-mountain-gold/40 dark:border-white/10 dark:bg-slate-900/80 dark:text-white"
                      >
                        <option value="">Select guests</option>
                        <option value="1-25">1 - 25 guests</option>
                        <option value="26-50">26 - 50 guests</option>
                        <option value="51-100">51 - 100 guests</option>
                        <option value="101-200">101 - 200 guests</option>
                        <option value="200+">200+ guests</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-charcoal dark:text-white" htmlFor="eventDate">
                        Preferred Date
                      </label>
                      <Input
                        id="eventDate"
                        name="eventDate"
                        type="date"
                        className="h-12 rounded-xl border border-slate-200/80 bg-white/90 px-4 text-sm text-charcoal shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] focus-visible:border-mountain-gold focus-visible:ring-mountain-gold/40 dark:border-white/10 dark:bg-slate-900/80 dark:text-white"
                        value={form.eventDate}
                        onChange={handleChange('eventDate')}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-charcoal dark:text-white" htmlFor="budget">
                        Estimated Budget
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={form.budget}
                        onChange={handleChange('budget')}
                        className="h-12 w-full rounded-xl border border-slate-200/80 bg-white/90 px-4 text-sm text-charcoal shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] focus:border-mountain-gold focus:outline-none focus:ring-2 focus:ring-mountain-gold/40 dark:border-white/10 dark:bg-slate-900/80 dark:text-white"
                      >
                        <option value="">Select a range</option>
                        <option value="under-1000">Under $1,000</option>
                        <option value="1000-2500">$1,000 - $2,500</option>
                        <option value="2500-5000">$2,500 - $5,000</option>
                        <option value="5000-10000">$5,000 - $10,000</option>
                        <option value="over-10000">Over $10,000</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-charcoal dark:text-white" htmlFor="location">
                      Location / Venue
                    </label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g., Canmore, Banff, Calgary"
                      className="h-12 rounded-xl border border-slate-200/80 bg-white/90 px-4 text-base text-charcoal placeholder:text-charcoal/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] focus-visible:border-mountain-gold focus-visible:ring-mountain-gold/40 dark:border-white/10 dark:bg-slate-900/80 dark:text-white dark:placeholder-white/50"
                      value={form.location}
                      onChange={handleChange('location')}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-charcoal dark:text-white" htmlFor="message">
                      Tell us about your vision *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      minLength={10}
                      rows={4}
                      placeholder="Share event details, special requests, or the atmosphere you want to create."
                      className="rounded-xl border border-slate-200/80 bg-white/90 px-4 py-3 text-base text-charcoal placeholder:text-charcoal/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] focus-visible:border-mountain-gold focus-visible:ring-mountain-gold/40 dark:border-white/10 dark:bg-slate-900/80 dark:text-white dark:placeholder-white/50"
                      value={form.message}
                      onChange={handleChange('message')}
                    />
                  </div>

                  {feedback && (
                    <div
                      className={`rounded-xl px-4 py-3 text-sm font-medium ${
                        feedback.type === 'success'
                          ? 'bg-emerald-100/85 text-emerald-900 shadow-sm dark:bg-emerald-800/45 dark:text-emerald-50'
                          : 'bg-red-100/80 text-red-900 shadow-sm dark:bg-red-900/50 dark:text-red-100'
                      }`}
                    >
                      {feedback.message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="group w-full rounded-full bg-mountain-gold px-6 py-3 text-base font-semibold text-charcoal transition-all duration-300 hover:bg-copper hover:text-white disabled:opacity-70"
                  >
                    {submitting ? 'Sending…' : 'Submit Booking Request'}
                  </Button>
                </form>
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
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-mountain-gold/20 text-charcoal transition-all duration-300 hover:-translate-y-1 hover:bg-mountain-gold hover:text-white"
                  href="https://instagram.com/mountain.mixology"
                  rel="noreferrer"
                  target="_blank"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
