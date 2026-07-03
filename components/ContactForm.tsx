'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { getSiteCopy } from '@/lib/siteCopy';

export default function ContactForm() {
  const locale = useLocale();
  const t = getSiteCopy(locale).form;
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name || !formData.message) return;
    
    setStatus('loading');
    setErrorMessage('');
    try {
      const { error } = await supabase
        .from('contact_forms')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: formData.message,
          }
        ]);

      if (error) throw error;
      setStatus('success');
    } catch (error: unknown) {
      console.error('Error submitting form:', error);
      setErrorMessage(error instanceof Error ? error.message : t.error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full max-w-md mx-auto text-center transform transition-all duration-500 ease-out scale-100 opacity-100 p-8 border-y border-white/10">
        <h4 className="text-xl font-bold text-white mb-2">{t.successTitle}</h4>
        <p className="text-white/70">{t.successDescription}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto border-y border-white/10 py-8 text-left md:py-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/80 uppercase tracking-wider ml-1">{t.name}</label>
            <Input
              type="text"
              placeholder={t.namePlaceholder}
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-14 rounded-2xl border-white/10 bg-white/[0.03] px-5 text-base text-white transition-all placeholder:text-white/20 focus-visible:border-white/28 focus-visible:ring-white/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/80 uppercase tracking-wider ml-1">{t.email}</label>
            <Input
              type="email"
              placeholder={t.emailPlaceholder}
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-14 rounded-2xl border-white/10 bg-white/[0.03] px-5 text-base text-white transition-all placeholder:text-white/20 focus-visible:border-white/28 focus-visible:ring-white/20"
            />
          </div>
        </div>
        <div className="space-y-2">
           <label className="text-xs font-bold text-white/80 uppercase tracking-wider ml-1">{t.message}</label>
           <textarea
             required
             placeholder={t.messagePlaceholder}
             value={formData.message}
             onChange={(e) => setFormData({ ...formData, message: e.target.value })}
             className="min-h-[140px] w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-base text-white transition-all placeholder:text-white/20 focus-visible:border-white/28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
           />
        </div>
        
        {status === 'error' && (
          <div className="text-live-red text-sm font-medium mt-2">{errorMessage}</div>
        )}

        <Button 
          type="submit" 
          disabled={status === 'loading'}
          className="w-full h-14 bg-white hover:bg-white/90 text-black font-black uppercase tracking-widest text-sm rounded-2xl mt-4 transition-all shadow-xl hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
        >
          {status === 'loading' ? t.sending : t.submit}
        </Button>
      </form>
    </div>
  );
}
