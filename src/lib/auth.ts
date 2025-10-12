import bcrypt from 'bcryptjs';

import { cookies } from 'next/headers';

import { AdminUser, createSession, deleteSession, findAdminById, getSession } from './repository';

export const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createAdminSession(adminId: number): Promise<string> {
  const token = createSession(adminId, SESSION_TTL_SECONDS);
  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
  return token;
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (existing) {
    deleteSession(existing);
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  const session = getSession(token);
  if (!session) {
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }
  const admin = findAdminById(session.admin_id);
  if (!admin) {
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }
  return admin;
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error('Unauthorized');
  }
  return admin;
}
