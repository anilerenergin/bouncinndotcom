'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { AlertTriangle, Loader2, ShieldCheck, DoorOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminLogin() {
  const router = useRouter();
  const params = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Authentication failed.');
      }

      // 2. Fetch user's role from the public.users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (userError) {
        await supabase.auth.signOut();
        throw new Error('Could not verify admin privileges.');
      }

      // 3. Check if role is 'su'
      if (userData?.role !== 'su') {
        await supabase.auth.signOut();
        throw new Error('Access Denied. You do not have superuser (su) privileges.');
      }

      // If everything is correct, redirect to admin dashboard
      // Note: We use window.location to ensure locale routing works correctly and state is refreshed.
      const currentLocale = (params.locale as string) || 'en';
      window.location.href = `/${currentLocale}/admin`;
    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-dvh bg-[#050506] px-4 py-5 text-white selection:bg-live-red/30 sm:px-5 sm:py-6">
      <div className="mx-auto flex min-h-[calc(100dvh-2.5rem)] w-full max-w-md flex-col justify-center">
        <div className="mb-6 flex items-center gap-3">
          <Image src="/images/icon.png" alt="Bouncinn" width={32} height={32} className="h-8 w-auto" priority />
          <div>
            <p className="text-lg font-black tracking-tight">BOUNCINN</p>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/45">Admin Portal</p>
          </div>
        </div>

        <section className="rounded-lg border border-white/10 bg-[#111114]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <div className="mb-6 flex size-12 items-center justify-center rounded-lg border border-live-red/35 bg-live-red/10 text-live-red shadow-[0_0_30px_rgba(255,72,72,0.18)]">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Superuser Login</h1>
          <p className="mt-2 text-sm leading-6 text-white/55">Secure access for system administrators.</p>

          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="admin@bouncinn.com"
                className="h-14 rounded-lg border-white/10 bg-black/45 px-4 text-lg font-medium text-white placeholder:text-white/20 focus-visible:border-live-red/60 focus-visible:ring-live-red/70"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-14 rounded-lg border-white/10 bg-black/45 px-4 text-lg font-medium text-white placeholder:text-white/20 focus-visible:border-live-red/60 focus-visible:ring-live-red/70"
              />
            </div>

            {error ? (
              <div className="flex gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <Button
              type="submit"
              disabled={isLoading}
              className="h-14 w-full rounded-lg bg-live-red text-sm font-black tracking-[0.16em] text-white shadow-[0_14px_34px_rgba(255,72,72,0.22)] hover:bg-live-red/90 active:scale-[0.99]"
            >
              {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <DoorOpen className="mr-2 size-4" />}
              LOG IN
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
