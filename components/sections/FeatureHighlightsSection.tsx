'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FadeInSection } from '@/components/ui/FadeInSection';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

export function FeatureHighlightsSection() {
  const t = useTranslations('Index');

  return (
    <>
      <div className="w-full py-20 mt-12 flex flex-col items-center justify-center">
        <h2 className="text-sm md:text-base font-bold tracking-[0.3em] text-white/40 uppercase mb-8">Venue & Organization Tools</h2>
        
        <div className="flex flex-col items-start leading-[0.85] select-none">
          <h1 className="text-7xl md:text-[6rem] lg:text-[7.5rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#f2f2f2] to-[#444] pb-2">
            Bouncinn
          </h1>
          <div className="text-3xl md:text-[2.5rem] lg:text-[3.2rem] font-black text-[#cc3333] uppercase tracking-[0.08em] mt-1 ml-1" style={{ WebkitTextStroke: "1px rgba(255,100,100,0.2)" }}>
            BUSINESS
          </div>
        </div>
      </div>

      <div className="space-y-24 md:space-y-32">
        {/* Layout 1: Left/Right Standard for Promoter Management */}
        <FadeInSection className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative">
          <div className="flex-1 space-y-4 md:space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left mx-auto">
            <div className="inline-flex w-14 h-14 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl items-center justify-center mb-2 md:mb-4 shadow-[0_4px_24px_rgba(255,72,72,0.15)]">
               <svg className="w-7 h-7 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">{t('feat_promoter_title')}</h2>
            <h3 className="text-xl md:text-2xl font-bold text-live-red">{t('feat_promoter_sub')}</h3>
            <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-xl">{t('feat_promoter_desc')}</p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.02, rotateY: -2, z: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex-1 w-full perspective-1000 flex justify-center lg:justify-end"
          >
            <img 
              src="/images/promoters.png" 
              alt={t('feat_promoter_title')}
              className="max-w-full w-auto max-h-[350px] md:max-h-[450px] object-contain border border-white/10 rounded-[2rem] shadow-2xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]" 
            />
          </motion.div>
        </FadeInSection>

        {/* Layout 2: Wide Full Card for Promotion Engine */}
        <FadeInSection className="max-w-6xl mx-auto !py-0">
          <motion.div 
            whileHover={{ y: -5, boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 80px rgba(255,72,72,0.18)" }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 lg:p-20 border border-white/[0.08] relative overflow-hidden text-center group shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]"
          >
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 relative z-10">{t('feat_promo_title')}</h2>
            <h3 className="text-xl font-bold text-live-red mb-6 md:mb-8 relative z-10">{t('feat_promo_sub')}</h3>
            <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-2xl mx-auto mb-12 md:mb-16 relative z-10">{t('feat_promo_desc')}</p>
            
            <div className="relative z-10 perspective-1000">
              <img 
                src="/images/promotionsengine.png" 
                alt={t('feat_promo_title')}
                className="max-w-full w-auto max-h-[450px] mx-auto rounded-t-3xl border-t border-x border-white/10 shadow-[0_-10px_60px_rgba(0,0,0,0.8)] translate-y-8 group-hover:translate-y-4 group-hover:rotate-x-2 transition-transform duration-500"
              />
            </div>
          </motion.div>
        </FadeInSection>

        {/* Layout 3: Wide Full Card for Precision Targeting */}
        <FadeInSection className="max-w-6xl mx-auto !py-0">
          <motion.div 
            whileHover={{ y: -5, boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 80px rgba(255,72,72,0.15)" }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] p-12 lg:p-20 border border-white/[0.08] relative overflow-hidden text-center group shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]"
          >
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 relative z-10">{t('feat_target_title')}</h2>
            <h3 className="text-xl font-bold text-live-red mb-8 relative z-10">{t('feat_target_sub')}</h3>
            <p className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto mb-16 relative z-10">{t('feat_target_desc')}</p>
            
            <div className="relative z-10 perspective-1000">
              <img 
                src="/images/campaign.png" 
                alt={t('feat_target_title')}
                className="max-w-full w-auto max-h-[450px] mx-auto rounded-t-3xl border-t border-x border-white/10 shadow-[0_-10px_60px_rgba(0,0,0,0.8)] translate-y-8 group-hover:translate-y-4 group-hover:rotate-x-2 transition-transform duration-500"
              />
            </div>
          </motion.div>
        </FadeInSection>

        {/* Layout 4: Dark Glass Panel for Analytics Dashboard */}
        <FadeInSection className="relative w-full overflow-hidden !py-16 md:!py-24 border-y border-white/5 bg-[#09090B] mt-24 md:mt-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(242,253,10,0.03),transparent_50%)] mix-blend-screen pointer-events-none" />
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10 max-w-7xl mx-auto px-6">
            <motion.div 
              whileHover={{ rotateY: 5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex-1 w-full flex justify-center order-last lg:order-first perspective-1000"
            >
              <img 
                src="/images/analytics.png" 
                alt={t('feat_analytics_title')}
                className="max-w-full w-auto max-h-[350px] md:max-h-[500px] rounded-[2rem] border border-white/5 drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)]" 
              />
            </motion.div>
            <div className="flex-1 space-y-4 md:space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left order-first lg:order-last">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-2 md:mb-6">{t('feat_analytics_title')}</h2>
              <div className="space-y-4 border-l-0 lg:border-l-2 border-live-red/60 pl-0 lg:pl-6 py-2 my-4 md:my-8 relative">
                <div className="hidden lg:block absolute top-0 -left-px w-0.5 h-1/2 bg-live-red shadow-[0_0_10px_rgba(255,72,72,0.8)]" />
                <h3 className="text-xl font-bold text-white">{t('feat_analytics_sub')}</h3>
                <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-xl mx-auto lg:mx-0">{t('feat_analytics_desc')}</p>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* Layout 5: Feature Steps style for Guest Management */}
        <FadeInSection className="max-w-6xl mx-auto text-center !py-0 mb-32">
          <div className="mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">{t('feat_guest_title')}</h2>
            <h3 className="text-xl font-bold text-live-red">{t('feat_guest_sub')}</h3>
          </div>
          
          <div className="grid lg:grid-cols-12 gap-8 md:gap-12 text-center lg:text-left items-center">
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              className="lg:col-span-5 bg-white/[0.02] backdrop-blur-2xl rounded-[2rem] p-8 md:p-10 h-full min-h-[300px] border border-white/[0.08] shadow-2xl relative overflow-hidden group flex flex-col justify-center items-center lg:items-start"
            >
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-live-red/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <svg className="w-12 h-12 text-white/30 mb-6 md:mb-8 group-hover:text-live-red/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
               <p className="text-lg md:text-xl lg:text-2xl text-white/80 font-medium leading-relaxed relative z-10">{t('feat_guest_desc')}</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="lg:col-span-7 w-full flex justify-center lg:justify-end relative perspective-1000 mt-4 lg:mt-0"
            >
               <img 
                 src="/images/guestmanage.png" 
                 alt={t('feat_guest_title')}
                 className="w-full max-w-[280px] md:max-w-md lg:max-w-2xl max-h-[400px] lg:max-h-[550px] xl:max-h-[650px] object-contain rounded-[2rem] border border-white/5 drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)] xl:scale-105" 
               />
            </motion.div>
          </div>
        </FadeInSection>
        
      </div>
    </>
  );
}
