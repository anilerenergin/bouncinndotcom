'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

function localizedPath(locale: string, path: string) {
  if (locale === 'en') {
    return path;
  }

  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

export function SiteFooter() {
  const locale = useLocale();
  const t = useTranslations('Index');

  return (
    <footer className="relative z-10 w-full border-t border-white/5 bg-[#09090B] py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-center text-xs text-white/20 sm:flex-row sm:text-left">
        <div>© {new Date().getFullYear()} BOUNCINN Technologies. The Pulse of the Night.</div>
        <Link href={localizedPath(locale, '/legal')} className="transition-colors hover:text-white">
          {t('nav_legal') || 'Privacy & Legal'}
        </Link>
      </div>
    </footer>
  );
}
