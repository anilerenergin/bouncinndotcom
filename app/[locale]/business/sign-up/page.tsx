'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Eye, Lock, Mail } from 'lucide-react';
import { LandingNav } from '@/components/LandingNav';

export default function BusinessSignUpPage() {
  const locale = useLocale();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#101011] text-white">
      <LandingNav active="business" brandLabel="Bouncinn Business" />

      <div className="grid min-h-screen lg:grid-cols-[1.03fr_1fr]">
        <section className="relative hidden overflow-hidden border-r border-white/10 bg-[radial-gradient(circle_at_0%_0%,rgba(255,50,52,0.22),transparent_34%),linear-gradient(135deg,#231312_0%,#151515_45%,#080809_100%)] p-8 pt-28 lg:flex lg:flex-col lg:justify-center xl:p-14 xl:pt-32">
          <div className="max-w-3xl pb-2">
            <blockquote className="text-[clamp(2.2rem,3.45vw,3.35rem)] font-black leading-[1.08] tracking-[-0.065em]">
              &quot;Experience the future of event management, streamlined, efficient, and built for professionals.&quot;
            </blockquote>
            <p className="mt-6 text-xl font-bold text-white/46">The Bouncinn Team</p>
          </div>
        </section>

        <section className="relative flex min-h-screen flex-col px-6 pt-28 pb-7 sm:px-10 lg:px-14 xl:pt-32">
          <div className="flex flex-1 items-center justify-center py-8">
            <div className="w-full max-w-[500px]">
              <div className="text-center">
                <h1 className="text-[clamp(2.5rem,4vw,3.4rem)] font-black leading-none tracking-[-0.07em]">
                  Welcome back.
                </h1>
                <p className="mt-5 text-xl font-bold text-white/52">Please enter your details.</p>
              </div>

              <form className="mt-8 space-y-5">
                <label className="block">
                  <span className="text-base font-black text-white/92">Email Address</span>
                  <span className="mt-3 flex h-[60px] items-center gap-4 rounded-[10px] bg-white/[0.045] px-5 ring-1 ring-white/10 transition focus-within:ring-[#ff3234]/70">
                    <Mail className="h-6 w-6 text-white/62" />
                    <input
                      type="email"
                      className="w-full bg-transparent text-lg font-bold text-white outline-none placeholder:text-white/45"
                      placeholder="name@venue.com"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="text-base font-black text-white/92">Password</span>
                  <span className="mt-3 flex h-[60px] items-center gap-4 rounded-[10px] bg-white/[0.045] px-5 ring-1 ring-white/10 transition focus-within:ring-[#ff3234]/70">
                    <Lock className="h-6 w-6 text-white/62" />
                    <input
                      type="password"
                      className="w-full bg-transparent text-lg font-bold text-white outline-none placeholder:text-white/45"
                      placeholder="********"
                    />
                    <Eye className="h-6 w-6 text-white/62" />
                  </span>
                </label>

                <div className="flex justify-end">
                  <Link href={`/${locale}/business/sign-up`} className="text-base font-black text-white/62 transition hover:text-white">
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="h-[60px] w-full rounded-[10px] bg-[#f5443d] text-xl font-black text-white shadow-[0_16px_34px_rgba(255,50,52,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ff3234]"
                >
                  Log In
                </button>
              </form>

              <p className="mx-auto mt-6 max-w-md text-center text-base font-bold leading-relaxed text-white/46">
                By clicking continue, you agree to our{' '}
                <Link href={`/${locale}/legal`} className="underline decoration-white/40 underline-offset-4 transition hover:text-white">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href={`/${locale}/legal`} className="underline decoration-white/40 underline-offset-4 transition hover:text-white">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
