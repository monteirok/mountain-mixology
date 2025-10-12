import { NextResponse } from 'next/server';

import { getCurrentAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({ authenticated: true, admin: { id: admin.id, email: admin.email } });
}
