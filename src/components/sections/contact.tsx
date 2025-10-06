'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, Instagram, Mail, MapPin } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
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
    <section id="contact" className="bg-ice-blue/20 py-20 dark:bg-ice-blue/10">
      <div className="container mx-auto px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-6 text-4xl font-playfair font-bold text-forest dark:text-mountain-gold md:text-5xl">
            Book Your Event
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-charcoal/90 dark:text-white/80">
            Share your vision and tell us about your celebration. Our team will follow up with availability,
            curated cocktail ideas, and next steps tailored to your event.
          </p>
        </motion.div>

        <div className="grid gap-16 lg:grid-cols-2">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="rounded-2xl border border-white/10 bg-white/95 shadow-xl backdrop-blur-sm transition-all duration-500 hover:shadow-[0_24px_48px_rgba(15,23,42,0.18)] dark:border-white/5 dark:bg-charcoal/95">
              <CardContent className="p-8">
                <h3 className="mb-6 text-2xl font-playfair font-semibold text-charcoal dark:text-white">
                  Tell Us About Your Event
                </h3>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-charcoal dark:text-white" htmlFor="firstName">
                        First Name *
                      </label>
                      <Input
                        id="firstName"
                        name="firstName"
                        required
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
                      value={form.phone}
                      onChange={handleChange('phone')}
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-charcoal dark:text-white" htmlFor="eventType">
                        Event Type
                      </label>
                      <select
                        id="eventType"
                        name="eventType"
                        value={form.eventType}
                        onChange={handleChange('eventType')}
                        className="h-11 w-full rounded-md border border-input bg-white px-3 text-sm dark:bg-charcoal dark:text-white"
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
                        className="h-11 w-full rounded-md border border-input bg-white px-3 text-sm dark:bg-charcoal dark:text-white"
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

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-charcoal dark:text-white" htmlFor="eventDate">
                        Preferred Date
                      </label>
                      <Input
                        id="eventDate"
                        name="eventDate"
                        type="date"
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
                        className="h-11 w-full rounded-md border border-input bg-white px-3 text-sm dark:bg-charcoal dark:text-white"
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
                      value={form.message}
                      onChange={handleChange('message')}
                    />
                  </div>

                  {feedback && (
                    <div
                      className={`rounded-lg px-4 py-3 text-sm ${
                        feedback.type === 'success'
                          ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100'
                          : 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-100'
                      }`}
                    >
                      {feedback.message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-mountain-gold text-white hover:bg-copper"
                  >
                    {submitting ? 'Sending…' : 'Submit Booking Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-2xl bg-forest text-white">
              <CardContent className="space-y-4 p-8">
                {highlights.map((highlight) => (
                  <div key={highlight} className="flex items-start">
                    <CheckCircle className="mr-3 flex-shrink-0 text-mountain-gold" size={20} />
                    <span className="leading-relaxed text-white/90">{highlight}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="rounded-2xl bg-white shadow-lg dark:bg-charcoal">
              <CardContent className="space-y-6 p-8">
                <h3 className="text-2xl font-playfair font-semibold text-charcoal dark:text-white">
                  Prefer to reach out directly?
                </h3>
                <p className="text-charcoal/80 dark:text-white/70">
                  We love hearing about new celebrations. Email us the details and our lead mixologist will
                  respond with availability, curated ideas, and next steps tailored to your event.
                </p>
                <div className="space-y-6 text-charcoal/80 dark:text-white/70">
                  <div className="flex items-start">
                    <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-mountain-gold/20">
                      <MapPin className="text-mountain-gold" size={20} />
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-charcoal dark:text-white">Service Area</h4>
                      <p>Canmore · Banff · Calgary · Rocky Mountain region</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-mountain-gold/20">
                      <Mail className="text-mountain-gold" size={20} />
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-charcoal dark:text-white">Email</h4>
                      <a
                        className="transition-colors hover:text-mountain-gold"
                        href="mailto:mountainmixologyca@gmail.com"
                      >
                        mountainmixologyca@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-mountain-gold/20">
                      <Clock className="text-mountain-gold" size={20} />
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-charcoal dark:text-white">Response Time</h4>
                      <p>Within 24 hours (same day for urgent requests)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl bg-white text-center shadow-lg dark:bg-charcoal">
              <CardContent className="p-8">
                <h3 className="mb-4 text-xl font-playfair font-semibold text-charcoal dark:text-white">
                  Follow Our Craft
                </h3>
                <p className="mb-6 text-charcoal/70 dark:text-white/70">
                  Sneak peeks, new menus, and favourite pours from recent events.
                </p>
                <div className="flex justify-center">
                  <a
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-mountain-gold/20 transition-all duration-300 hover:bg-mountain-gold hover:text-white"
                    href="https://instagram.com/mountain.mixology"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Instagram size={20} />
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
