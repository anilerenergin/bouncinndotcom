'use client';

import { useTranslations } from 'next-intl';
import { FadeInSection } from '@/components/ui/FadeInSection';
import { motion } from 'framer-motion';

const APP_STORE_URL = 'https://apps.apple.com/search?term=bouncinn';
const PLAY_STORE_URL = 'https://play.google.com/store/search?q=bouncinn&c=apps';

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
            className="group inline-flex h-14 w-[154px] items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white px-3 text-black shadow-[0_12px_40px_rgba(255,255,255,0.12)] transition-all hover:-translate-y-0.5 hover:bg-white/90 active:translate-y-0 sm:h-[52px] sm:w-[174px] sm:gap-3 sm:px-4"
          >
            <svg className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16.365 1.43c0 1.14-.422 2.17-1.266 3.09-.908.986-1.998 1.554-3.17 1.464-.142-1.095.438-2.27 1.25-3.165.844-.93 2.278-1.64 3.186-1.39ZM20.7 17.12c-.518 1.19-.767 1.722-1.43 2.773-.93 1.43-2.238 3.212-3.858 3.227-1.438.014-1.806-.944-3.758-.932-1.952.012-2.358.95-3.796.936-1.62-.014-2.856-1.622-3.786-3.05-2.59-3.982-2.862-8.66-1.264-11.15 1.134-1.766 2.926-2.798 4.606-2.798 1.71 0 2.786.94 4.2.94 1.374 0 2.208-.942 4.188-.942 1.498 0 3.086.816 4.216 2.224-3.706 2.032-3.104 7.328.682 8.772Z" />
            </svg>
            <span className="flex min-w-0 flex-col items-start gap-1 leading-none sm:gap-0.5">
              <span className="whitespace-nowrap text-[8px] font-bold tracking-[0.08em] text-black/65 sm:text-[9px]">
                DOWNLOAD ON THE
              </span>
              <span className="whitespace-nowrap text-[15px] font-black tracking-tight sm:text-lg">
                {t('download_app_store')}
              </span>
            </span>
          </a>

          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('download_play_store')}
            className="group inline-flex h-14 w-[154px] items-center justify-center gap-2.5 rounded-2xl border border-white/12 bg-white/[0.06] px-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all hover:-translate-y-0.5 hover:border-live-red/50 hover:bg-live-red/10 active:translate-y-0 sm:h-[52px] sm:w-[174px] sm:gap-3 sm:px-4"
          >
            <svg className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#34A853" d="M3.34 2.7c-.22.24-.34.6-.34 1.06v16.48c0 .46.12.82.34 1.06l.06.06 9.24-9.24v-.24L3.4 2.64l-.06.06Z" />
              <path fill="#FBBC04" d="m15.72 15.2-3.08-3.08v-.24l3.08-3.08.07.04 3.65 2.07c1.04.58 1.04 1.54 0 2.13l-3.65 2.07-.07.09Z" />
              <path fill="#4285F4" d="m15.79 15.12-3.15-3.12-9.3 9.3c.34.36.9.4 1.52.05l10.93-6.23Z" />
              <path fill="#EA4335" d="M15.79 8.88 4.86 2.65c-.62-.35-1.18-.31-1.52.05l9.3 9.3 3.15-3.12Z" />
            </svg>
            <span className="flex min-w-0 flex-col items-start gap-1 leading-none sm:gap-0.5">
              <span className="whitespace-nowrap text-[8px] font-bold tracking-[0.08em] text-white/50 sm:text-[9px]">
                GET IT ON
              </span>
              <span className="whitespace-nowrap text-[15px] font-black tracking-tight sm:text-lg">
                {t('download_play_store')}
              </span>
            </span>
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
