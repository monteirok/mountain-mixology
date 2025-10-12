import nodemailer from 'nodemailer'

type BookingEmailPayload = {
  id?: string | number
  firstName: string
  lastName: string
  email: string
  phone?: string
  eventType?: string
  guestCount?: string
  eventDate?: string
  budget?: string
  location?: string
  message: string
}

const DEFAULT_TARGET = 'reservations@mountainmixology.ca'

type TransportBundle = {
  transporter: nodemailer.Transporter
  from: string
  to: string
}

let cachedTransport: TransportBundle | null | undefined

function resolveTransport(): TransportBundle | null {
  if (cachedTransport !== undefined) {
    return cachedTransport
  }

  const user = process.env.EMAIL_USER ?? process.env.GMAIL_USER
  const pass = process.env.EMAIL_PASSWORD ?? process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    console.warn(
      'Email transport not configured: set EMAIL_USER/EMAIL_PASSWORD or GMAIL_USER/GMAIL_APP_PASSWORD in the environment.'
    )
    cachedTransport = null
    return cachedTransport
  }

  const host = process.env.EMAIL_HOST
  const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined
  const secureEnv = process.env.EMAIL_SECURE?.toLowerCase()
  const secure = secureEnv ? secureEnv === 'true' : port === 465
  const service = process.env.EMAIL_SERVICE

  const transporter = host
    ? nodemailer.createTransport({
        host,
        port: port ?? 587,
        secure,
        auth: { user, pass },
      })
    : nodemailer.createTransport({
        service: service ?? 'gmail',
        auth: { user, pass },
      })

  cachedTransport = {
    transporter,
    from: process.env.BOOKINGS_FROM_EMAIL ?? process.env.EMAIL_FROM ?? user,
    to: process.env.RESERVATIONS_EMAIL ?? DEFAULT_TARGET,
  }

  return cachedTransport
}

function formatLine(label: string, value?: string) {
  return value
    ? `<tr><td style="padding:6px 12px;font-weight:600;">${escapeHtml(label)}</td><td style="padding:6px 12px;">${escapeHtml(
        value
      )}</td></tr>`
    : ''
}

function buildEmailBody(payload: BookingEmailPayload) {
  const lines = [
    `<p style="margin:0 0 16px;">A new booking request has been submitted on the Mountain Mixology website.</p>`,
    `<table style="border-collapse:collapse;width:100%;background:#f9fafb;">`,
    formatLine('Booking ID', payload.id ? String(payload.id) : undefined),
    formatLine('First Name', payload.firstName),
    formatLine('Last Name', payload.lastName),
    formatLine('Email', payload.email),
    formatLine('Phone', payload.phone),
    formatLine('Event Type', payload.eventType),
    formatLine('Guest Count', payload.guestCount),
    formatLine('Preferred Date', payload.eventDate),
    formatLine('Estimated Budget', payload.budget),
    formatLine('Location / Venue', payload.location),
    '</table>',
    `<div style="margin-top:16px;padding:16px;border-left:4px solid #d8b252;background:#fff;line-height:1.6;">
      <p style="margin:0 0 8px;font-weight:600;">Event Vision</p>
      <p style="margin:0;white-space:pre-wrap;">${escapeHtml(payload.message)}</p>
    </div>`,
  ]

  return lines.join('')
}

function buildTextBody(payload: BookingEmailPayload) {
  const parts = [
    'A new booking request has been submitted on the Mountain Mixology website.',
    payload.id ? `Booking ID: ${payload.id}` : undefined,
    `First Name: ${payload.firstName}`,
    `Last Name: ${payload.lastName}`,
    `Email: ${payload.email}`,
    payload.phone ? `Phone: ${payload.phone}` : undefined,
    payload.eventType ? `Event Type: ${payload.eventType}` : undefined,
    payload.guestCount ? `Guest Count: ${payload.guestCount}` : undefined,
    payload.eventDate ? `Preferred Date: ${payload.eventDate}` : undefined,
    payload.budget ? `Estimated Budget: ${payload.budget}` : undefined,
    payload.location ? `Location / Venue: ${payload.location}` : undefined,
    '',
    'Event Vision:',
    payload.message,
  ]

  return parts.filter(Boolean).join('\n')
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

export async function sendBookingNotification(payload: BookingEmailPayload) {
  const bundle = resolveTransport()
  if (!bundle) {
    throw new Error('Email transport is not configured')
  }

  const subject = `New booking request from ${payload.firstName} ${payload.lastName}`

  await bundle.transporter.sendMail({
    to: bundle.to,
    from: bundle.from,
    replyTo: payload.email,
    subject,
    text: buildTextBody(payload),
    html: buildEmailBody(payload),
  })
}
