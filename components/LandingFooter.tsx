'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';

const footerLinks = [
  ['App', 'app'],
  ['Business', 'business'],
  ['Contact', 'contact'],
  ['Privacy & legal', 'legal'],
] as const;

export function LandingFooter() {
  const locale = useLocale();
  const base = `/${locale}`;

  return (
    <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <Link href={base} className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-white shadow-[0_16px_35px_rgba(0,0,0,0.18)]">
            <Image src="/images/iconBlack.png" alt="Bouncinn" width={28} height={18} className="h-5 w-auto" />
          </span>
          <span className="text-lg font-black tracking-[-0.03em] text-white">BOUNCINN</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-bold text-white/55">
          {footerLinks.map(([label, path]) => (
            <Link key={label} href={`${base}/${path}`} className="transition hover:text-white">
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://instagram.com/bouncinnapp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5A4.25 4.25 0 0020.5 16.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5z" />
              <path d="M12 7.25a4.75 4.75 0 110 9.5 4.75 4.75 0 010-9.5zm0 1.5a3.25 3.25 0 100 6.5 3.25 3.25 0 000-6.5z" />
              <circle cx="17.5" cy="6.5" r="1.25" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/company/bouncinn"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M4.98 3.5a2.5 2.5 0 11-.001 5.001A2.5 2.5 0 014.98 3.5zM3 8.75h3.96V21H3V8.75z" />
              <path d="M8.97 8.75h3.8v1.63h.05c.53-1 1.82-2.05 3.75-2.05 4.01 0 4.75 2.64 4.75 6.07V21h-3.96v-5.92c0-1.41-.03-3.22-1.96-3.22-1.97 0-2.27 1.54-2.27 3.12V21h-3.96V8.75z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
