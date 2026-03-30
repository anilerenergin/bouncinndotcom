'use client';

import { useTranslations } from 'next-intl';
import { FadeInSection } from '@/components/ui/FadeInSection';

import { motion } from 'framer-motion';

export function SecuritySection() {
  const t = useTranslations('Index');

  return (
    <FadeInSection className="text-center mt-16 md:mt-24 relative px-4 md:px-0">
      <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full -z-10" />

      <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3rem] border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] py-16 md:py-20 px-6 lg:px-12 overflow-hidden mx-auto">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight max-w-3xl mx-auto mb-12 md:mb-20 leading-tight">
          {t('security_title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
          {[t('security_1'), t('security_2'), t('security_3')].map((text, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center gap-6 p-8 bg-white/[0.01] rounded-[2rem] border border-white/[0.05] hover:bg-white/[0.04] hover:shadow-2xl transition-colors cursor-default group"
            >
              <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-live-red/50 group-hover:bg-live-red/10 transition-colors">
                {i === 0 && <svg className="w-8 h-8 text-white group-hover:text-live-red transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>}
                {i === 1 && <svg className="w-8 h-8 text-white group-hover:text-live-red transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>}
                {i === 2 && <svg className="w-8 h-8 text-white group-hover:text-live-red transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
              </div>
              <h4 className="text-lg font-bold text-white max-w-[200px]">{text}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
