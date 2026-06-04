'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Building2, Mail, MessageCircle, Sparkles } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { LandingFooter } from '@/components/LandingFooter';
import { LandingNav } from '@/components/LandingNav';

const contactCards = [
  {
    icon: MessageCircle,
    title: 'Product questions',
    description: 'Ask about the app experience, events, venues, matching or future city launches.',
  },
  {
    icon: Building2,
    title: 'Venue demos',
    description: 'Request a walkthrough for Bouncinn Business and see how it fits your operation.',
  },
  {
    icon: Sparkles,
    title: 'Partnerships',
    description: 'Tell us about collaborations, event ideas or ways Bouncinn can support your crowd.',
  },
];

export default function ContactPage() {
  const locale = useLocale();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#09090B] text-white selection:bg-live-red/30">
      <LandingNav active="contact" />

      <section className="px-4 pb-14 pt-32 sm:px-6 md:pb-20 md:pt-40 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center gap-8">
          <div>
            <p className="text-sm font-black tracking-[0.22em] text-[#ff3234]">CONTACT BOUNCINN</p>
            <h1 className="mt-4 text-5xl font-black leading-[0.9] tracking-[-0.075em] sm:text-6xl lg:text-7xl">
              Let&apos;s build the next night out.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-bold leading-relaxed text-white/62 sm:text-xl">
              Whether you&apos;re running a venue, planning a launch, or just curious about Bouncinn, send us a note and we&apos;ll get back to you.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="mailto:hello@bouncinn.com"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[#ff3234] px-7 text-base font-black text-white shadow-[0_18px_44px_rgba(255,50,52,0.32)] transition hover:-translate-y-0.5 hover:bg-[#e62c2e]"
              >
                <Mail className="h-5 w-5" />
                hello@bouncinn.com
              </a>
              <Link
                href={`/${locale}/business`}
                className="inline-flex h-14 items-center justify-center rounded-full bg-white px-7 text-base font-black text-[#111111] shadow-[0_18px_44px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                Explore Business
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {contactCards.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group rounded-[34px] bg-white p-7 text-[#111111] shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-2"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#111111] text-white transition duration-300 group-hover:rotate-[-6deg] group-hover:bg-[#ff3234]">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-2xl font-black tracking-[-0.05em]">{title}</h2>
              <p className="mt-4 text-base font-bold leading-relaxed text-[#111111]/62">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
        <div className="mx-auto flex max-w-3xl justify-center">
          <div className="w-full [&>div]:max-w-none [&>div]:border-white/10 [&>div]:bg-[#0d0d0f] [&>div]:shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
            <ContactForm />
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
