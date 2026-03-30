'use client';

import { useTranslations } from 'next-intl';
import { FadeInSection } from '@/components/ui/FadeInSection';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

import { motion } from 'framer-motion';

export function HeroSection() {
  const t = useTranslations('Index');

  return (
    <FadeInSection className="pt-40 md:pt-48 lg:pt-56 lg:flex items-center justify-between gap-12 relative">
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-live-red/10 blur-[200px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="flex-1 space-y-4 md:space-y-6 max-w-2xl relative z-10 text-left">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[0.9]">
          {t('hero_title').split(' ').map((word, i) => (
            <span key={i} className={i % 2 !== 0 ? "text-white block" : "text-white/90 block"}>{word}</span>
          ))}
        </h1>
        <p className="text-lg md:text-xl text-white/60 leading-relaxed font-medium">
          {t('hero_subtitle')}
        </p>
      </div>
      <motion.div 
        whileHover={{ scale: 1.03, rotateY: -2, y: -5 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="flex-1 mt-12 lg:mt-0 w-full flex justify-center lg:justify-end relative z-10 perspective-1000"
      >
        <img 
          src="/images/first.png" 
          alt="Bouncinn Interface" 
          className="w-full max-w-[550px] max-h-[450px] object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        />
      </motion.div>
    </FadeInSection>
  );
}
