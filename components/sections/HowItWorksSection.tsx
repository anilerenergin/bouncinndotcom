'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { FadeInSection } from '@/components/ui/FadeInSection';
import { motion } from 'framer-motion';

export function HowItWorksSection() {
  const t = useTranslations('Index');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.children[0]?.clientWidth || scrollRef.current.clientWidth;
    // Guess active index based on scroll position
    const index = Math.round(scrollRef.current.scrollLeft / cardWidth);
    if (index !== activeIndex && index >= 0 && index <= 2) {
      setActiveIndex(index);
    }
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.children[index] as HTMLElement;
    if (card) {
      scrollRef.current.scrollTo({
        left: card.offsetLeft - scrollRef.current.offsetLeft - (scrollRef.current.clientWidth - card.clientWidth) / 2,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  return (
    <FadeInSection id="solutions" className="text-center relative !py-16 md:!py-24 mt-8">
      {/* Background glow for glass effect contrast */}
      <div className="absolute inset-0 bg-live-red/5 blur-[120px] rounded-full -z-10" />
      
      <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] py-16 px-6 lg:px-12 relative overflow-hidden">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-12 md:mb-16">{t('how_title')}</h2>
        
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-3 gap-6 md:gap-12 overflow-x-auto snap-x snap-mandatory pt-4 pb-8 md:pb-0 px-6 md:px-0 -mx-6 md:mx-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10 w-[calc(100%+3rem)] md:w-full"
        >
          {[t('how_step1'), t('how_step2'), t('how_step3')].map((step, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center flex flex-col items-center gap-6 md:gap-8 bg-transparent md:bg-white/[0.03] p-2 md:p-6 lg:p-8 rounded-none md:rounded-[2.5rem] border-transparent md:border-white/[0.05] border md:shadow-xl md:hover:bg-white/[0.06] md:hover:border-white/20 transition-colors"
            >
              <img 
                src={`/images/${idx + 1}.png`} 
                alt={step} 
                className="w-full max-w-[280px] object-cover rounded-[1.5rem] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]" 
              />
              <h3 className="text-xl md:text-xl font-bold text-white/90">{step}</h3>
            </motion.div>
          ))}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center justify-center gap-6 mt-4 relative z-20">
           <button 
             onClick={() => scrollTo(Math.max(0, activeIndex - 1))} 
             className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all ${activeIndex === 0 ? 'opacity-30 pointer-events-none' : 'text-white/50 hover:text-white hover:bg-white/10 active:scale-95'}`}
           >
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
           </button>
           
           <div className="flex items-center gap-2">
             {[0, 1, 2].map(idx => (
               <button 
                 key={idx} 
                 onClick={() => scrollTo(idx)}
                 className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === idx ? 'bg-live-red w-6' : 'bg-white/20'}`} 
               />
             ))}
           </div>
           
           <button 
             onClick={() => scrollTo(Math.min(2, activeIndex + 1))} 
             className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all ${activeIndex === 2 ? 'opacity-30 pointer-events-none' : 'text-white/50 hover:text-white hover:bg-white/10 active:scale-95'}`}
           >
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
           </button>
        </div>
      </div>
    </FadeInSection>
  );
}
