'use client';

import { FormEvent, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          cache: 'no-store',
          credentials: 'include',
        });
        if (response.ok) {
          router.replace('/admin');
        }
      } catch (error) {
        console.error('Unable to check authentication state', error);
      }
    };
    checkSession().catch(() => undefined);
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Login failed' }));
        throw new Error(data.error ?? 'Login failed');
      }

      router.replace('/admin');
    } catch (error) {
      console.error('Login failed', error);
      setError(error instanceof Error ? error.message : 'Unable to login');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16">
      <Card className="w-full max-w-md border border-white/10 bg-slate-900/70 text-white shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-semibold">Admin Sign In</CardTitle>
          <p className="text-sm text-white/60">Enter your credentials to manage booking requests.</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="border-white/20 bg-slate-950/60 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                className="border-white/20 bg-slate-950/60 text-white"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            )}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
