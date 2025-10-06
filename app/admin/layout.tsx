import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/login');
  }

  return (
    <section className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
        {children}
      </div>
    </section>
  );
}
