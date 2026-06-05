'use client';

import { ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check, ChevronDown, Languages } from 'lucide-react';

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'de', label: 'Deutsch' },
];

function pathForLocale(pathname: string, locale: string) {
  const pathWithoutLocale = pathname.replace(/^\/(en|tr|de)(?=\/|$)/, '') || '/';

  return pathWithoutLocale === '/' ? `/${locale}` : `/${locale}${pathWithoutLocale}`;
}

function localizedPath(locale: string, path: string) {
  if (locale === 'en') {
    return path;
  }

  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

function routeFromPathname(pathname: string) {
  return pathname.replace(/^\/(en|tr|de)(?=\/|$)/, '') || '/';
}

export function SiteShell({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('Index');
  const currentRoute = routeFromPathname(pathname);
  const navItems = [
    { href: '/', label: t('nav_home') || 'HOME' },
    { href: '/app', label: t('nav_app') || 'APP' },
    { href: '/business', label: t('nav_crm') || 'BUSINESS' },
    { href: '/contact', label: t('nav_contact') || 'CONTACT' },
  ];
  const navLinkClass = (route: string) => {
    const isActive = currentRoute === route;

    return [
      'px-3 py-2 rounded-full transition-colors border border-transparent',
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:text-white hover:border-white/20',
    ].join(' ');
  };

  return (
    <main className="min-h-screen bg-[#09090B] text-white selection:bg-live-red/30 overflow-x-hidden">
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#09090B]/80 backdrop-blur-[20px] border-b border-white/5 transition-all">
        <div className="w-full max-w-7xl mx-auto px-4 py-4 flex items-center justify-between md:px-6">
          <Link href={localizedPath(locale, '/')} className="flex items-center gap-3 -ml-2">
            <img src="/images/icon.png" alt="Bouncinn Icon" className="h-[28px] w-auto" />
            <div className="text-[18px] font-bold tracking-tight text-white mt-0.5 sm:text-[22px]">BOUNCINN</div>
          </Link>

          <div className="flex items-center gap-6 md:gap-10">
            <div className="hidden md:flex items-center gap-3 md:gap-4 text-[12px] md:text-[13px] font-bold tracking-widest uppercase">
              {navItems.map((item) => (
                <Link key={item.href} href={localizedPath(locale, item.href)} className={navLinkClass(item.href)}>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:block w-px h-5 bg-white/10" />

            <details className="group relative text-xs font-bold tracking-wide text-white/70">
              <summary className="flex h-10 cursor-pointer list-none items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 transition-colors hover:border-white/25 [&::-webkit-details-marker]:hidden">
                <Languages className="hidden h-4 w-4 text-white/45 sm:block" aria-hidden="true" />
                <span className="text-white sm:hidden">{locale.toUpperCase()}</span>
                <span className="hidden text-left sm:inline">
                  {LANGUAGE_OPTIONS.find((language) => language.code === locale)?.label || locale}
                </span>
                <ChevronDown className="h-4 w-4 text-white/45 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>

              <div className="absolute right-0 top-12 z-50 min-w-40 overflow-hidden rounded-2xl border border-white/10 bg-[#09090B]/95 p-1 shadow-2xl backdrop-blur-xl">
                {LANGUAGE_OPTIONS.map((language) => (
                  <Link
                    key={language.code}
                    href={pathForLocale(pathname, language.code)}
                    className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 transition-colors ${
                      language.code === locale
                        ? 'text-white'
                        : 'text-white/65 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{language.label}</span>
                    {language.code === locale && (
                      <Check className="h-4 w-4 text-live-red" aria-hidden="true" />
                    )}
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </div>

        <div className="md:hidden border-t border-white/5">
          <div className="mx-auto flex w-full max-w-7xl gap-2 overflow-x-auto px-4 py-3 text-[11px] font-bold uppercase tracking-widest [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={localizedPath(locale, item.href)}
                className={`shrink-0 rounded-full border px-3 py-2 transition-colors ${
                  currentRoute === item.href
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-white/10 bg-white/[0.03] text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {children}
    </main>
  );
}
