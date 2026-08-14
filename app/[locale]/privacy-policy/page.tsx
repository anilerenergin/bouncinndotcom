'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const t = useTranslations('Index');

  const content = t('privacy_content');

  return (
    <main className="min-h-screen bg-[#09090B] text-white selection:bg-live-red/30 pt-24 pb-16">

      {/* Simple Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#09090B]/80 backdrop-blur-[20px] border-b border-white/5">
        <div className="w-full max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="text-[16px] font-bold tracking-tight text-white">{t('legal_title')}</div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 mt-12">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10">
          <h1 className="text-2xl font-bold mb-8">{t('privacy_title')}</h1>
          <div className="prose prose-invert max-w-none">
            {content.split('\n').map((paragraph, idx) =>
              paragraph
                ? <p key={idx} className="text-white/70 leading-relaxed mb-4">{paragraph}</p>
                : <br key={idx} />
            )}
          </div>
        </div>
      </div>

    </main>
  );
}
