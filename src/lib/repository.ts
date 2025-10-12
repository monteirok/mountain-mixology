import crypto from 'crypto';

import db from './db';

export interface AdminUser {
  id: number;
  email: string;
  password_hash: string;
  created_at: number;
}

export interface Booking {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  event_type: string | null;
  guest_count: string | null;
  event_date: string | null;
  budget: string | null;
  location: string | null;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'archived';
  admin_notes: string | null;
  responded_at: number | null;
  created_at: number;
  updated_at: number;
}

const insertAdmin = db.prepare(
  `INSERT INTO admin_users (email, password_hash) VALUES (?, ?)
   ON CONFLICT(email) DO NOTHING`
);

const selectAdminByEmail = db.prepare<[
  string
], AdminUser>('SELECT * FROM admin_users WHERE email = ?');

const selectAdminById = db.prepare<[
  number
], AdminUser>('SELECT * FROM admin_users WHERE id = ?');

const insertSessionStmt = db.prepare(
  `INSERT INTO admin_sessions (token, admin_id, expires_at) VALUES (?, ?, ?)`
);

const deleteSessionStmt = db.prepare('DELETE FROM admin_sessions WHERE token = ?');

const selectSession = db.prepare<[
  string
], { token: string; admin_id: number; expires_at: number; created_at: number }>(
  'SELECT token, admin_id, expires_at, created_at FROM admin_sessions WHERE token = ?'
);

const cleanupSessionsStmt = db.prepare('DELETE FROM admin_sessions WHERE expires_at < ?');

const insertBookingStmt = db.prepare(
  `INSERT INTO bookings (
    first_name,
    last_name,
    email,
    phone,
    event_type,
    guest_count,
    event_date,
    budget,
    location,
    message
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

const selectBookingsStmt = db.prepare<[], Booking[]>(
  `SELECT * FROM bookings ORDER BY created_at DESC`
);

const updateBookingStatusStmt = db.prepare(
  `UPDATE bookings
   SET status = ?,
       admin_notes = ?,
       responded_at = CASE
         WHEN ? = 1 THEN NULL
         WHEN ? IS NOT NULL THEN ?
         ELSE responded_at
       END
   WHERE id = ?`
);

const selectBookingByIdStmt = db.prepare<[
  number
], Booking>('SELECT * FROM bookings WHERE id = ?');

export function createAdminUser(email: string, passwordHash: string): AdminUser | null {
  insertAdmin.run(email.toLowerCase(), passwordHash);
  return findAdminByEmail(email);
}

export function findAdminByEmail(email: string): AdminUser | null {
  const result = selectAdminByEmail.get(email.toLowerCase());
  return result ?? null;
}

export function findAdminById(id: number): AdminUser | null {
  const result = selectAdminById.get(id);
  return result ?? null;
}

export function createSession(adminId: number, ttlSeconds: number): string {
  cleanupSessionsStmt.run(Math.floor(Date.now() / 1000));
  const token = crypto.randomUUID();
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  insertSessionStmt.run(token, adminId, expiresAt);
  return token;
}

export function deleteSession(token: string): void {
  deleteSessionStmt.run(token);
}

export function getSession(token: string): { token: string; admin_id: number; expires_at: number } | null {
  const session = selectSession.get(token);
  if (!session) {
    return null;
  }
  if (session.expires_at < Math.floor(Date.now() / 1000)) {
    deleteSessionStmt.run(token);
    return null;
  }
  return session;
}

export function createBooking(payload: {
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
}): number {
  const info = insertBookingStmt.run(
    payload.firstName,
    payload.lastName,
    payload.email,
    payload.phone ?? null,
    payload.eventType ?? null,
    payload.guestCount ?? null,
    payload.eventDate ?? null,
    payload.budget ?? null,
    payload.location ?? null,
    payload.message
  );
  return Number(info.lastInsertRowid);
}

export function listBookings(): Booking[] {
  return selectBookingsStmt.all();
}

export function updateBookingStatus(
  id: number,
  status: Booking['status'],
  adminNotes: string | null,
  respondedAt: number | null,
  clearResponded: boolean
): Booking | null {
  updateBookingStatusStmt.run(
    status,
    adminNotes ?? null,
    clearResponded ? 1 : 0,
    respondedAt,
    respondedAt,
    id
  );
  return selectBookingByIdStmt.get(id) ?? null;
}
