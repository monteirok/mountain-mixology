import { NextResponse } from 'next/server';

import { createAdminSession, destroyAdminSession, hashPassword, verifyPassword } from '@/lib/auth';
import { createAdminUser, findAdminByEmail } from '@/lib/repository';

export const dynamic = 'force-dynamic';

const ensureDefaultAdmin = async (email: string, password: string) => {
  const existing = findAdminByEmail(email);
  if (!existing) {
    const hashed = await hashPassword(password);
    createAdminUser(email, hashed);
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email ?? '').trim().toLowerCase();
    const password = String(body?.password ?? '');

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Developer convenience: automatically create an admin account when the provided credentials
    // do not match an existing user. This eases first-run setup and can be removed in production.
    if (process.env.NODE_ENV !== 'production') {
      const bootstrapEmail = process.env.ADMIN_BOOTSTRAP_EMAIL ?? 'admin@mountainmixology.com';
      const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD ?? 'ChangeMe123!';
      await ensureDefaultAdmin(bootstrapEmail, bootstrapPassword);
    }

    const admin = findAdminByEmail(email);
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, admin.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await destroyAdminSession();
    await createAdminSession(admin.id);

    return NextResponse.json({ success: true, admin: { id: admin.id, email: admin.email } });
  } catch (error) {
    console.error('Login failed:', error);
    return NextResponse.json({ error: 'Unable to login' }, { status: 500 });
  }
}
