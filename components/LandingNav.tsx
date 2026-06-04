'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe2 } from 'lucide-react';

const navItems = [
  ['App', 'app'],
  ['Business', 'business'],
  ['Contact', 'contact'],
] as const;

const languages = [
  ['en', 'GB', 'English'],
  ['tr', 'TR', 'Turkce'],
  ['de', 'DE', 'Deutsch'],
] as const;

export function LandingNav({
  active,
  showBusinessSignup = false,
  brandLabel = 'BOUNCINN',
}: {
  active?: 'app' | 'business' | 'contact';
  showBusinessSignup?: boolean;
  brandLabel?: string;
}) {
  const locale = useLocale();
  const base = `/${locale}`;
  const [languageOpen, setLanguageOpen] = useState(false);

  return (
    <header className="absolute left-0 top-0 z-50 w-full px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Link
          href={active === 'business' ? `${base}/business` : base}
          className="flex items-center gap-3 justify-self-start"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[#111111] shadow-[0_16px_35px_rgba(0,0,0,0.18)]">
            <Image src="/images/icon.png" alt="Bouncinn" width={28} height={18} className="h-5 w-auto" />
          </span>
          <span className="hidden text-lg font-black tracking-[-0.03em] text-white sm:block">{brandLabel}</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full bg-white/90 px-2 py-2 text-sm font-extrabold text-[#202020] shadow-[0_20px_50px_rgba(19,24,31,0.12)] ring-1 ring-black/5 backdrop-blur-xl md:flex">
          {navItems.map(([label, path]) => {
            const isActive = active === path;

            return (
              <Link key={path} href={`${base}/${path}`} className="relative rounded-full px-5 py-3 transition">
                {isActive && (
                  <motion.span
                    layoutId="landing-nav-pill"
                    className="absolute inset-0 rounded-full bg-[#ff3234]"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <motion.span
                  className={`relative z-10 ${isActive ? 'text-white' : 'text-[#202020]'}`}
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.18 }}
                >
                  {label}
                </motion.span>
              </Link>
            );
          })}
        </nav>

        <div className="relative flex items-center justify-self-end rounded-full bg-white/65 p-1.5 shadow-[0_18px_38px_rgba(19,24,31,0.10)] ring-1 ring-black/5 backdrop-blur-xl">
          <button
            type="button"
            aria-label="Select language"
            onClick={() => setLanguageOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#1d1d1d] transition hover:bg-white"
          >
            <Globe2 className="h-5 w-5" />
          </button>

          {showBusinessSignup && (
            <Link
              href={`${base}/business/sign-up`}
              className="rounded-full bg-[#ff3234] px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(255,50,52,0.28)] transition hover:-translate-y-0.5 hover:bg-[#e62c2e]"
            >
              Sign up
            </Link>
          )}

          <AnimatePresence>
            {languageOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 10, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-full w-44 overflow-hidden rounded-[22px] bg-white p-2 text-[#111111] shadow-[0_22px_50px_rgba(0,0,0,0.24)] ring-1 ring-black/5"
              >
                {languages.map(([code, flag, label]) => (
                  <Link
                    key={code}
                    href={`/${code}/${active ?? 'app'}`}
                    className="flex items-center gap-3 rounded-[16px] px-3 py-2.5 text-sm font-extrabold transition hover:bg-[#f2f2f2]"
                    onClick={() => setLanguageOpen(false)}
                  >
                    <span className="flex h-7 w-8 items-center justify-center rounded-md bg-[#111111] text-[11px] font-black text-white">
                      {flag}
                    </span>
                    <span>{label}</span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
