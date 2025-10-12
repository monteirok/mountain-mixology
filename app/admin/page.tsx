import { redirect } from 'next/navigation';

import { getCurrentAdmin } from '@/lib/auth';
import { listBookings } from '@/lib/repository';

import AdminDashboard, { type DashboardBooking } from './_components/admin-dashboard';

export default async function AdminPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/login');
  }

  const bookings: DashboardBooking[] = listBookings().map(booking => ({
    id: booking.id,
    firstName: booking.first_name,
    lastName: booking.last_name,
    email: booking.email,
    phone: booking.phone,
    eventType: booking.event_type,
    guestCount: booking.guest_count,
    eventDate: booking.event_date,
    budget: booking.budget,
    location: booking.location,
    message: booking.message,
    status: booking.status as 'pending' | 'in_progress' | 'resolved' | 'archived',
    adminNotes: booking.admin_notes,
    respondedAt: booking.responded_at,
    createdAt: booking.created_at,
    updatedAt: booking.updated_at,
  }));

  return <AdminDashboard adminEmail={admin.email} initialBookings={bookings} />;
}
