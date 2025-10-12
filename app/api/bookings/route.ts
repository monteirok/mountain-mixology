import { NextResponse } from 'next/server';

import { getCurrentAdmin } from '@/lib/auth';
import { sendBookingNotification } from '@/lib/email';
import { createBooking, listBookings } from '@/lib/repository';

export const dynamic = 'force-dynamic';

const REQUIRED_FIELDS: Array<keyof BookingPayload> = ['firstName', 'lastName', 'email', 'message'];

interface BookingPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  eventType?: string;
  guestCount?: string;
  eventDate?: string;
  budget?: string;
  location?: string;
  message: string;
}

function validateBookingPayload(body: unknown): { value?: BookingPayload; error?: string } {
  if (typeof body !== 'object' || body === null) {
    return { error: 'Invalid request body' };
  }

  const value = body as Record<string, unknown>;
  const payload: BookingPayload = {
    firstName: String(value.firstName ?? '').trim(),
    lastName: String(value.lastName ?? '').trim(),
    email: String(value.email ?? '').trim(),
    message: String(value.message ?? '').trim(),
  };

  if (value.phone) {
    payload.phone = String(value.phone).trim();
  }
  if (value.eventType) {
    payload.eventType = String(value.eventType).trim();
  }
  if (value.guestCount) {
    payload.guestCount = String(value.guestCount).trim();
  }
  if (value.eventDate) {
    payload.eventDate = String(value.eventDate).trim();
  }
  if (value.budget) {
    payload.budget = String(value.budget).trim();
  }
  if (value.location) {
    payload.location = String(value.location).trim();
  }

  for (const field of REQUIRED_FIELDS) {
    if (!payload[field]) {
      return { error: `${field} is required` };
    }
  }

  if (!payload.email.includes('@')) {
    return { error: 'A valid email address is required' };
  }

  if (payload.message.length < 10) {
    return { error: 'Message should be at least 10 characters long' };
  }

  return { value: payload };
}

function mapBookingRow(row: ReturnType<typeof listBookings>[number]) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    eventType: row.event_type,
    guestCount: row.guest_count,
    eventDate: row.event_date,
    budget: row.budget,
    location: row.location,
    message: row.message,
    status: row.status,
    adminNotes: row.admin_notes,
    respondedAt: row.responded_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { value, error } = validateBookingPayload(body);

    if (error || !value) {
      return NextResponse.json({ error }, { status: 400 });
    }

    let bookingId: string | number | undefined;

    try {
      bookingId = createBooking(value);
    } catch (dbError) {
      console.warn('Booking persistence failed, continuing with email only:', dbError);
    }

    try {
      await sendBookingNotification({ id: bookingId, ...value });
    } catch (emailError) {
      console.error('Booking email notification failed:', emailError);
      return NextResponse.json({ error: 'Unable to submit booking request' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: bookingId ?? null, persisted: Boolean(bookingId) });
  } catch (error) {
    console.error('Booking submission failed:', error);
    return NextResponse.json({ error: 'Unable to submit booking request' }, { status: 500 });
  }
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let bookings: ReturnType<typeof mapBookingRow>[] = [];

  try {
    bookings = listBookings().map(mapBookingRow);
  } catch (dbError) {
    console.warn('Unable to read bookings from database:', dbError);
  }

  return NextResponse.json({ bookings, admin: { id: admin.id, email: admin.email } });
}
