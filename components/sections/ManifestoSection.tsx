'use client';

import { useTranslations } from 'next-intl';
import { FadeInSection } from '@/components/ui/FadeInSection';

export function ManifestoSection() {
  const t = useTranslations('Index');

  return (
    <FadeInSection className="text-center !pt-6 !pb-10 md:!pt-12 md:!pb-20 mt-0">
      <h2 className="text-lg sm:text-2xl md:text-5xl font-black tracking-normal md:tracking-tighter leading-snug md:leading-tight max-w-[18rem] sm:max-w-4xl mx-auto mb-5 md:mb-8">
        {t('quote_text')}
      </h2>
      <p className="text-lg md:text-2xl font-bold text-live-red">
        {t('quote_sub')}
      </p>
    </FadeInSection>
  );
}
