'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function WaitlistForm() {
  const t = useTranslations('Index');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Mock submission
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-success font-medium text-center p-6 bg-success/10 border border-success/20 rounded-2xl">
          {t('success_msgs')}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-backwards">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold tracking-tight text-foreground">{t('waitlist_title')}</h3>
        <p className="text-muted-foreground">{t('waitlist_desc')}</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          type="email"
          placeholder={t('email_placeholder')}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 text-base px-4 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus-visible:ring-brand-yellow/50"
        />
        <Button type="submit" size="lg" className="w-full h-12 text-base font-semibold rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]">
          {t('submit_btn')}
        </Button>
      </form>
    </div>
  );
}
