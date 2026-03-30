'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FadeInSection } from '@/components/ui/FadeInSection';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

export function RealTimeContextSection() {
  const t = useTranslations('Index');

  return (
    <FadeInSection className="lg:flex items-center justify-between gap-12 mt-8">
      <div className="flex-1 space-y-4">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-white">
          {t('realtime_title').split(' ').map((w,i) => <span key={i} className="block">{w}</span>)}
        </h2>
        <p className="text-lg md:text-xl text-white/60 max-w-xl">
          {t('realtime_desc')}
        </p>
      </div>
      <motion.div 
        whileHover={{ scale: 1.05, rotateY: 5 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="flex-1 mt-16 lg:mt-0 w-full flex justify-center lg:justify-end relative perspective-1000 z-10"
      >
        <img 
          src="/images/realtime.png" 
          alt="Real-Time Context" 
          className="w-full max-w-[280px] md:max-w-[320px] object-contain rounded-[1.5rem] drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] lg:mr-10" 
        />
      </motion.div>
    </FadeInSection>
  );
}
