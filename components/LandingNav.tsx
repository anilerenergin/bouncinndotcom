'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe2, Menu, X } from 'lucide-react';
import { getSiteCopy } from '@/lib/siteCopy';

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
  const copy = getSiteCopy(locale);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navLabels = {
    app: copy.nav.app,
    business: copy.nav.business,
    contact: copy.nav.contact,
  };

  return (
    <header className="absolute left-0 top-0 z-50 w-full px-4 py-5 sm:px-6 lg:px-8 2xl:py-7">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 2xl:max-w-[1500px]">
        <Link
          href={active === 'business' ? `${base}/business` : base}
          className="flex items-center gap-3 justify-self-start"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[#111111] shadow-[0_16px_35px_rgba(0,0,0,0.18)] 2xl:h-13 2xl:w-13 2xl:rounded-[20px]">
            <Image src="/images/icon.png" alt="Bouncinn" width={28} height={18} className="h-5 w-auto 2xl:h-6" />
          </span>
          <span className="hidden text-lg font-black tracking-[-0.03em] text-white sm:block 2xl:text-xl">{brandLabel}</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full bg-white/90 px-2 py-2 text-sm font-extrabold text-[#202020] shadow-[0_20px_50px_rgba(19,24,31,0.12)] ring-1 ring-black/5 backdrop-blur-xl md:flex 2xl:text-base">
          {navItems.map(([label, path]) => {
            const isActive = active === path;

            return (
              <Link key={path} href={`${base}/${path}`} className="relative rounded-full px-5 py-3 transition 2xl:px-6 2xl:py-3.5">
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
                  {navLabels[path]}
                </motion.span>
              </Link>
            );
          })}
        </nav>

        <div className="relative flex items-center justify-self-end gap-2">
          <div className="relative flex items-center rounded-full bg-white/65 p-1.5 shadow-[0_18px_38px_rgba(19,24,31,0.10)] ring-1 ring-black/5 backdrop-blur-xl">
          <button
            type="button"
            aria-label={copy.nav.selectLanguage}
            onClick={() => setLanguageOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#1d1d1d] transition hover:bg-white 2xl:h-12 2xl:w-12"
          >
            <Globe2 className="h-5 w-5 2xl:h-6 2xl:w-6" />
          </button>

          {showBusinessSignup && (
            <Link
              href={`${base}/business/sign-up`}
              className="rounded-full bg-[#ff3234] px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(255,50,52,0.28)] transition hover:-translate-y-0.5 hover:bg-[#e62c2e]"
            >
              {copy.nav.signUp}
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

          <div className="relative md:hidden">
            <button
            type="button"
              aria-label={copy.nav.openMenu}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white/85 text-[#111111] shadow-[0_18px_38px_rgba(19,24,31,0.14)] ring-1 ring-black/5 backdrop-blur-xl transition hover:bg-white"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-6 w-6" />}
            </button>

            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.nav
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 10, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full z-30 w-48 overflow-hidden rounded-[24px] bg-white p-2 text-[#111111] shadow-[0_22px_50px_rgba(0,0,0,0.24)] ring-1 ring-black/5"
                >
                  {navItems.map(([label, path]) => {
                    const isActive = active === path;

                    return (
                      <Link
                        key={path}
                        href={`${base}/${path}`}
                        className={`block rounded-[18px] px-4 py-3 text-sm font-black transition ${
                          isActive ? 'bg-[#ff3234] text-white' : 'hover:bg-[#f2f2f2]'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {navLabels[path]}
                      </Link>
                    );
                  })}

                  {showBusinessSignup && (
                    <Link
                      href={`${base}/business/sign-up`}
                      className="mt-1 block rounded-[18px] bg-[#111111] px-4 py-3 text-sm font-black text-white transition hover:bg-[#ff3234]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {copy.nav.signUp}
                    </Link>
                  )}
                </motion.nav>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
