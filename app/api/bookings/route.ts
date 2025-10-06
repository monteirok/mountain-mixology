import { NextResponse } from 'next/server';
import { createBooking, listBookings } from '@/lib/repository';
import { getCurrentAdmin } from '@/lib/auth';

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
    phone: value.phone ? String(value.phone).trim() : undefined,
    eventType: value.eventType ? String(value.eventType).trim() : undefined,
    guestCount: value.guestCount ? String(value.guestCount).trim() : undefined,
    eventDate: value.eventDate ? String(value.eventDate).trim() : undefined,
    budget: value.budget ? String(value.budget).trim() : undefined,
    location: value.location ? String(value.location).trim() : undefined,
    message: String(value.message ?? '').trim(),
  };

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

    const bookingId = createBooking(value);

    return NextResponse.json({ success: true, id: bookingId });
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

  const bookings = listBookings().map(mapBookingRow);
  return NextResponse.json({ bookings, admin: { id: admin.id, email: admin.email } });
}
