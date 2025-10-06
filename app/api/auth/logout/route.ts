import { NextResponse } from 'next/server';
import { destroyAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  await destroyAdminSession();
  return NextResponse.json({ success: true });
}
