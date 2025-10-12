'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

type BookingStatus = 'pending' | 'in_progress' | 'resolved' | 'archived';

export interface DashboardBooking {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  eventType: string | null;
  guestCount: string | null;
  eventDate: string | null;
  budget: string | null;
  location: string | null;
  message: string;
  status: BookingStatus;
  adminNotes: string | null;
  respondedAt: number | null;
  createdAt: number;
  updatedAt: number;
}

interface AdminDashboardProps {
  adminEmail: string;
  initialBookings: DashboardBooking[];
}

interface BookingView extends DashboardBooking {
  notesDraft: string;
  statusDraft: BookingStatus;
  respondedDraft: boolean;
}

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  archived: 'Archived',
};

const statusOptions = Object.entries(STATUS_LABELS);

function formatTimestamp(timestamp: number | null): string {
  if (!timestamp) {
    return '—';
  }
  return new Date(timestamp * 1000).toLocaleString();
}

export default function AdminDashboard({ adminEmail, initialBookings }: AdminDashboardProps) {
  const router = useRouter();
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isRefreshing, setRefreshing] = useState(false);
  const [savingBookingId, setSavingBookingId] = useState<number | null>(null);

  const [bookings, setBookings] = useState<BookingView[]>(() =>
    initialBookings.map(booking => ({
      ...booking,
      notesDraft: booking.adminNotes ?? '',
      statusDraft: booking.status,
      respondedDraft: booking.respondedAt !== null,
    }))
  );

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => b.createdAt - a.createdAt),
    [bookings]
  );

  const refreshBookings = async () => {
    setRefreshing(true);
    setBanner(null);
    try {
      const response = await fetch('/api/bookings', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Failed to load bookings');
      }
      const data = await response.json();
      const refreshed: BookingView[] = data.bookings.map((booking: DashboardBooking) => ({
        ...booking,
        notesDraft: booking.adminNotes ?? '',
        statusDraft: booking.status,
        respondedDraft: booking.respondedAt !== null,
      }));
      setBookings(refreshed);
      setBanner({ type: 'success', message: 'Bookings updated' });
    } catch (error) {
      console.error(error);
      setBanner({ type: 'error', message: 'Unable to refresh bookings' });
    } finally {
      setRefreshing(false);
    }
  };

  const updateBooking = (id: number, updates: Partial<BookingView>) => {
    setBookings(prev => prev.map(booking => (booking.id === id ? { ...booking, ...updates } : booking)));
  };

  const saveBooking = async (booking: BookingView) => {
    setSavingBookingId(booking.id);
    setBanner(null);
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: booking.statusDraft,
          adminNotes: booking.notesDraft.trim() || null,
          responded: booking.respondedDraft,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to update booking' }));
        throw new Error(error.error ?? 'Failed to update booking');
      }

      const data = await response.json();
      const updated: DashboardBooking = data.booking;
      updateBooking(booking.id, {
        ...updated,
        notesDraft: updated.adminNotes ?? '',
        statusDraft: updated.status,
        respondedDraft: updated.respondedAt !== null,
      });
      setBanner({ type: 'success', message: 'Booking updated' });
    } catch (error) {
      console.error(error);
      setBanner({ type: 'error', message: error instanceof Error ? error.message : 'Failed to update booking' });
    } finally {
      setSavingBookingId(null);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="flex flex-1 flex-col gap-8 pb-12">
      <header className="flex flex-col gap-4 rounded-2xl bg-slate-900/60 p-6 shadow-lg ring-1 ring-white/10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Booking Requests</h1>
          <p className="text-sm text-white/60">Signed in as {adminEmail}</p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={refreshBookings}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Refreshing…' : 'Refresh'}
          </Button>
          <Button type="button" variant="secondary" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </header>

      {banner && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            banner.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-100'
              : 'bg-red-500/10 text-red-100'
          }`}
        >
          {banner.message}
        </div>
      )}

      <div className="grid gap-6">
        {sortedBookings.length === 0 ? (
          <Card className="border border-white/10 bg-slate-900/50">
            <CardContent className="p-10 text-center text-white/70">
              No booking requests yet. When a client submits the contact form, it will appear here.
            </CardContent>
          </Card>
        ) : (
          sortedBookings.map(booking => (
            <Card key={booking.id} className="border border-white/10 bg-slate-900/60">
              <CardHeader className="flex flex-col gap-2">
                <CardTitle className="text-xl font-semibold text-white">
                  {booking.firstName} {booking.lastName}
                </CardTitle>
                <div className="text-sm text-white/60">
                  Submitted {formatTimestamp(booking.createdAt)} · {booking.email}
                  {booking.phone ? ` · ${booking.phone}` : ''}
                </div>
              </CardHeader>
              <CardContent className="space-y-6 text-white/80">
                <div className="grid gap-4 md:grid-cols-2">
                  <Detail label="Event Type" value={booking.eventType ?? '—'} />
                  <Detail label="Guest Count" value={booking.guestCount ?? '—'} />
                  <Detail label="Event Date" value={booking.eventDate ?? '—'} />
                  <Detail label="Budget" value={booking.budget ?? '—'} />
                  <Detail label="Location" value={booking.location ?? '—'} className="md:col-span-2" />
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/60">Message</h3>
                  <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-white/90">
                    {booking.message}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-white/60">Status</label>
                    <select
                      value={booking.statusDraft}
                      onChange={event =>
                        updateBooking(booking.id, {
                          statusDraft: event.target.value as BookingStatus,
                        })
                      }
                      className="h-11 w-full rounded-md border border-white/20 bg-slate-900/70 px-3 text-sm text-white"
                    >
                      {statusOptions.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-white/50">
                      Last updated {formatTimestamp(booking.updatedAt)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-white/60">Responded</label>
                    <label className="flex items-center gap-2 text-sm text-white/80">
                      <input
                        type="checkbox"
                        checked={booking.respondedDraft}
                        onChange={event =>
                          updateBooking(booking.id, {
                            respondedDraft: event.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border border-white/30 bg-transparent"
                      />
                      Mark client as contacted
                    </label>
                    <p className="text-xs text-white/50">
                      {booking.respondedAt ? `Responded ${formatTimestamp(booking.respondedAt)}` : 'Awaiting response'}
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2 lg:col-span-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-white/60">Internal notes</label>
                    <Textarea
                      value={booking.notesDraft}
                      onChange={event => updateBooking(booking.id, { notesDraft: event.target.value })}
                      rows={4}
                      className="min-h-[120px] border-white/20 bg-slate-900/70 text-white"
                      placeholder="Reminders, follow-up actions, timelines…"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    onClick={() => saveBooking(booking)}
                    disabled={savingBookingId === booking.id}
                  >
                    {savingBookingId === booking.id ? 'Saving…' : 'Save changes'}
                  </Button>
                  <span className="text-xs text-white/50">
                    Booking #{booking.id}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function Detail({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <div className="text-xs font-semibold uppercase tracking-wide text-white/60">{label}</div>
      <div className="mt-1 text-sm text-white/90">{value}</div>
    </div>
  );
}
