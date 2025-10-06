import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { updateBookingStatus } from '@/lib/repository';

export const dynamic = 'force-dynamic';

const ALLOWED_STATUSES = new Set(['pending', 'in_progress', 'resolved', 'archived']);

export async function PATCH(
  request: Request,
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
    const body = await request.json();
    const status: string | undefined = body?.status;
    const adminNotes: string | null = body?.adminNotes ? String(body.adminNotes) : null;
    const responded: boolean = Boolean(body?.responded);

    if (!status || !ALLOWED_STATUSES.has(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const respondedAt = responded ? Math.floor(Date.now() / 1000) : null;
    const updated = updateBookingStatus(
      bookingId,
      status as any,
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
