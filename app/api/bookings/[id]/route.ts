import { NextResponse, type NextRequest } from 'next/server';

import { getCurrentAdmin } from '@/lib/auth';
import { updateBookingStatus, type Booking } from '@/lib/repository';

export const dynamic = 'force-dynamic';

const ALLOWED_STATUSES = new Set<Booking['status']>(['pending', 'in_progress', 'resolved', 'archived']);

function isBookingStatus(value: unknown): value is Booking['status'] {
  return typeof value === 'string' && ALLOWED_STATUSES.has(value);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bookingId = Number(params.id);
  if (Number.isNaN(bookingId)) {
    return NextResponse.json({ error: 'Invalid booking id' }, { status: 400 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const status = body.status;
    const adminNotesRaw = body.adminNotes;
    const adminNotes =
      typeof adminNotesRaw === 'string'
        ? adminNotesRaw || null
        : adminNotesRaw === null || adminNotesRaw === undefined
          ? null
          : String(adminNotesRaw);
    const responded = Boolean(body.responded);

    if (!isBookingStatus(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const respondedAt = responded ? Math.floor(Date.now() / 1000) : null;
    const updated = updateBookingStatus(
      bookingId,
      status,
      adminNotes,
      respondedAt,
      !responded
    );

    if (!updated) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({
      booking: {
        id: updated.id,
        firstName: updated.first_name,
        lastName: updated.last_name,
        email: updated.email,
        phone: updated.phone,
        eventType: updated.event_type,
        guestCount: updated.guest_count,
        eventDate: updated.event_date,
        budget: updated.budget,
        location: updated.location,
        message: updated.message,
        status: updated.status,
        adminNotes: updated.admin_notes,
        respondedAt: updated.responded_at,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
      },
    });
  } catch (error) {
    console.error('Failed to update booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
