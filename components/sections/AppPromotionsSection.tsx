'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FadeInSection } from '@/components/ui/FadeInSection';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

export function AppPromotionsSection() {
  const t = useTranslations('Index');

  return (
    <FadeInSection className="lg:flex items-center justify-center gap-16 mt-16 relative text-center lg:text-left">
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-live-red/5 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="flex-1 space-y-4 md:space-y-6 flex flex-col justify-center items-center lg:items-start mx-auto">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">{t('promo_app_title')}</h2>
        <h3 className="text-xl font-bold text-live-red">{t('promo_app_sub')}</h3>
        <p className="text-lg text-white/60 leading-relaxed max-w-xl">{t('promo_app_desc')}</p>
      </div>

      <motion.div 
        whileHover={{ scale: 1.05, rotateY: -4 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="flex-1 mt-12 lg:mt-0 w-full flex justify-center perspective-1000 z-10"
      >
        <img 
          src="/images/promotionimage.png" 
          alt="Bouncinn Promotions" 
          className="w-full max-w-[280px] md:max-w-[320px] object-contain rounded-[1.5rem] drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]" 
        />
      </motion.div>
    </FadeInSection>
  );
}
