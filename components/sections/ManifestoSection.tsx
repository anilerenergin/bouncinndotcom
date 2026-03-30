'use client';

import { useTranslations } from 'next-intl';
import { FadeInSection } from '@/components/ui/FadeInSection';

export function ManifestoSection() {
  const t = useTranslations('Index');

  return (
    <FadeInSection className="text-center !py-24 mt-8">
      <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight max-w-4xl mx-auto mb-8">
        {t('quote_text')}
      </h2>
      <p className="text-xl md:text-2xl font-bold text-live-red">
        {t('quote_sub')}
      </p>
    </FadeInSection>
  );
}
