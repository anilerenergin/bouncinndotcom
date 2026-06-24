'use client';

import { useTranslations } from 'next-intl';
import { FadeInSection } from '@/components/ui/FadeInSection';
import { motion } from 'framer-motion';

const APP_STORE_URL = 'https://apps.apple.com/us/app/bouncinn/id6759291367';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.bouncinn.app';

export function HeroSection() {
  const t = useTranslations('Index');

  return (
    <FadeInSection className="pt-40 sm:pt-40 md:pt-40 lg:pt-36 !pb-0 md:!pb-16 flex items-start justify-between gap-3 sm:gap-8 lg:gap-12 relative">
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-live-red/10 blur-[200px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="min-w-0 flex-[1_1_58%] space-y-3 sm:space-y-4 md:space-y-6 max-w-2xl relative z-10 text-left">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[0.9]">
          {t('hero_title').split(' ').map((word, i) => (
            <span key={i} className={i % 2 !== 0 ? "text-white block" : "text-white/90 block"}>{word}</span>
          ))}
        </h1>
        <p className="text-sm sm:text-lg md:text-xl text-white/60 leading-relaxed font-medium">
          {t('hero_subtitle')}
        </p>
        <div className="flex flex-row flex-wrap gap-3 pt-3">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('download_app_store')}
            className="group inline-flex h-[46px] items-center justify-center transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:h-[44px]"
          >
            <img
              src="/images/app-store-badge.svg"
              alt="Download on the App Store"
              className="h-full w-auto"
            />
          </a>

          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('download_play_store')}
            className="group inline-flex h-[43px] w-[136px] items-center justify-center transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:h-[41px] sm:w-[139px]"
          >
            <img
              src="/images/google-play-badge.svg"
              alt="Get it on Google Play"
              className="h-full w-full object-fill"
            />
          </a>
        </div>
      </div>
      <motion.div 
        whileHover={{ scale: 1.03, rotateY: -2, y: -5 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="flex-[0_0_38%] min-w-[112px] max-w-[210px] sm:max-w-[320px] lg:max-w-none lg:flex-1 mt-0 w-full flex justify-end relative z-10 perspective-1000"
      >
        <img 
          src="/images/first.png" 
          alt="Bouncinn Interface" 
          className="w-full max-w-[550px] max-h-[360px] sm:max-h-[420px] lg:max-h-[450px] object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        />
      </motion.div>
    </FadeInSection>
  );
}
