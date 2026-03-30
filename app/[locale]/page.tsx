'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { HeroSection } from '@/components/sections/HeroSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { RealTimeContextSection } from '@/components/sections/RealTimeContextSection';
import { AppPromotionsSection } from '@/components/sections/AppPromotionsSection';
import { ManifestoSection } from '@/components/sections/ManifestoSection';
import { FeatureHighlightsSection } from '@/components/sections/FeatureHighlightsSection';
import { SecuritySection } from '@/components/sections/SecuritySection';
import { CtaFooterSection } from '@/components/sections/CtaFooterSection';

export default function HomePage() {
  const t = useTranslations('Index');
  
  return (
    <main className="min-h-screen bg-[#09090B] text-white selection:bg-live-red/30 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#09090B]/80 backdrop-blur-[20px] border-b border-white/5 transition-all">
        <div className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 -ml-2">
            <img src="/images/icon.png" alt="Bouncinn Icon" className="h-[28px] w-auto" />
            <div className="text-[22px] font-bold tracking-tight text-white mt-0.5">BOUNCINN</div>
          </div>
          
          <div className="flex items-center gap-6 md:gap-10">
            <div className="hidden md:flex items-center gap-6 md:gap-8 text-[12px] md:text-[13px] font-bold tracking-widest text-muted-foreground uppercase">
              <Link href="#app" className="hover:text-white transition-colors pb-1 border-b-2 border-transparent hover:border-white/20">{(t('nav_app') || "APP")}</Link>
              <Link href="#crm" className="hover:text-white transition-colors pb-1 border-b-2 border-transparent hover:border-white/20">{(t('nav_crm') || "CRM")}</Link>
              <Link href="#contact" className="hover:text-white transition-colors pb-1 border-b-2 border-transparent hover:border-white/20">{(t('nav_contact') || "CONTACT")}</Link>
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

      {/* Page Sections */}
      <HeroSection />

      <div id="app">
        <HowItWorksSection />
        <RealTimeContextSection />
        <AppPromotionsSection />
      </div>

      <ManifestoSection />

      <div id="crm">
        <FeatureHighlightsSection />
        <SecuritySection />
      </div>

      <CtaFooterSection />

    </main>
  );
}
