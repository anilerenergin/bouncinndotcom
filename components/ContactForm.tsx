'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';

export default function ContactForm() {
  const t = useTranslations('Index');
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
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full max-w-md mx-auto text-center transform transition-all duration-500 ease-out scale-100 opacity-100 p-8 rounded-3xl bg-live-red/10 border border-live-red/20 shadow-[0_0_40px_-10px_rgba(255,72,72,0.2)]">
        <h4 className="text-xl font-bold text-white mb-2">{t('contact_success_title') || "Message Sent!"}</h4>
        <p className="text-white/70">{t('contact_success_desc') || "We will get back to you shortly."}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-[#0d0d0f] p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl text-left">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/80 uppercase tracking-wider ml-1">{t('contact_name') || "Name"}</label>
            <Input
              type="text"
              placeholder="John Doe"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-14 bg-black/50 border-white/10 text-white placeholder:text-white/20 rounded-2xl focus-visible:ring-live-red/50 focus-visible:border-live-red/50 transition-all text-base px-5"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/80 uppercase tracking-wider ml-1">{t('contact_email') || "Email"}</label>
            <Input
              type="email"
              placeholder="john@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-14 bg-black/50 border-white/10 text-white placeholder:text-white/20 rounded-2xl focus-visible:ring-live-red/50 focus-visible:border-live-red/50 transition-all text-base px-5"
            />
          </div>
        </div>
        <div className="space-y-2">
           <label className="text-xs font-bold text-white/80 uppercase tracking-wider ml-1">{t('contact_message') || "Message"}</label>
           <textarea
             required
             placeholder="How can we help?"
             value={formData.message}
             onChange={(e) => setFormData({ ...formData, message: e.target.value })}
             className="w-full bg-black/50 border border-white/10 text-white placeholder:text-white/20 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-red/50 focus-visible:border-live-red/50 transition-all p-5 min-h-[140px] resize-none text-base"
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
          {status === 'loading' ? 'Sending...' : (t('contact_submit') || "Send Inquiry")}
        </Button>
      </form>
    </div>
  );
}
