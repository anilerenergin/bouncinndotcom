'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import { FadeInSection } from '@/components/ui/FadeInSection';
import { Mail, Check } from 'lucide-react';

export function CtaFooterSection() {
  const t = useTranslations('Index');
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hello@bouncinn.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="relative w-full overflow-hidden border-t border-white/5 bg-gradient-to-b from-[#09090B] to-[#141415] mt-12">
      <FadeInSection className="!py-16 md:!py-32 relative z-10 px-4 md:px-0">
         <div className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
            <h2 className="text-4xl md:text-7xl font-black mb-4 md:mb-6">{t('cta_lets')}</h2>
            <p className="text-lg md:text-xl text-white/50 mb-10 md:mb-12 max-w-lg">
              {t('cta_desc')}
            </p>
            
            <div className="w-full">
              <ContactForm />
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-12 md:mt-16 w-full px-4 sm:px-0">
              <a 
                href="https://instagram.com/bouncinnapp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 flex items-center justify-center gap-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-live-red/10 hover:border-live-red/50 transition-all shadow-xl hover:shadow-[0_0_30px_rgba(255,72,72,0.4)] hover:-translate-y-1 active:scale-95 group"
              >
                <svg className="w-6 h-6 text-white/50 group-hover:text-live-red transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>

              <button 
                onClick={handleCopyEmail}
                className="px-8 py-4 flex items-center justify-center gap-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-live-red/10 hover:border-live-red/50 transition-all shadow-xl hover:shadow-[0_0_30px_rgba(255,72,72,0.4)] hover:-translate-y-1 active:scale-95 group"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors" />
                    <span className="font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 text-white/50 group-hover:text-live-red transition-colors" />
                    <span className="font-medium">hello@bouncinn.com</span>
                  </>
                )}
              </button>
            </div>
         </div>
      </FadeInSection>

      <div className="w-full text-center py-6 text-xs text-white/20 border-t border-white/5 relative z-10 bg-[#09090B]">
        © {new Date().getFullYear()} BOUNCINN Technologies. The Pulse of the Night.
      </div>
    </section>
  );
}
