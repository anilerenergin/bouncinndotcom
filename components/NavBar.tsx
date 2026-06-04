"use client";

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function NavBar() {
  const t = useTranslations('Index');
  const locale = useLocale();
  const base = `/${locale}`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#09090B]/80 backdrop-blur-[20px] border-b border-white/5 transition-all">
      <div className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 -ml-2">
          <Image src="/images/icon.png" alt="Bouncinn Icon" width={38} height={28} className="h-[28px] w-auto" />
          <div className="text-[22px] font-bold tracking-tight text-white mt-0.5">BOUNCINN</div>
        </div>

        <div className="flex items-center gap-6 md:gap-10">
          <div className="hidden md:flex items-center gap-6 md:gap-8 text-[12px] md:text-[13px] font-bold tracking-widest text-muted-foreground uppercase">
            <Link href={`${base}/app`} className="hover:text-white transition-colors pb-1 border-b-2 border-transparent hover:border-white/20">{(t('nav_app') || "APP")}</Link>
            <Link href={`${base}/business`} className="hover:text-white transition-colors pb-1 border-b-2 border-transparent hover:border-white/20">{(t('nav_crm') || "BUSINESS")}</Link>
            <Link href={`${base}/contact`} className="hover:text-white transition-colors pb-1 border-b-2 border-transparent hover:border-white/20">{(t('nav_contact') || "CONTACT")}</Link>
          </div>

          <div className="hidden md:block w-px h-5 bg-white/10" />

          <div className="flex items-center gap-3 md:gap-4 text-xs font-medium text-white/50">
            <Link href="/tr" className="hover:text-white transition-colors">TR</Link>
            <span>|</span>
            <Link href="/en" className="hover:text-white transition-colors">EN</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
