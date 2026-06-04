'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import ContactForm from '@/components/ContactForm';
import { LandingNav } from '@/components/LandingNav';
import { LandingFooter } from '@/components/LandingFooter';
import { DatabaseZap, PlugZap, Scaling } from 'lucide-react';

const businessFeatures = [
  {
    eyebrow: 'LIVE OPERATIONS',
    title: 'See the pulse of your venue',
    accent: 'pulse',
    description:
      'Track guests, check-ins, favorites, subscriptions and no-shows from one real-time overview built for busy nights.',
    image: '/images/analytics.png',
    alt: 'Bouncinn analytics dashboard',
    variant: 'white',
  },
  {
    eyebrow: 'GUEST LIST',
    title: 'Manage every guest without the chaos',
    accent: 'guest',
    description:
      'Keep guest requests, arrivals and list status organized so your door team and managers stay in sync.',
    image: '/images/guestmanage.png',
    alt: 'Guest management interface',
    variant: 'dark',
  },
  {
    eyebrow: 'PROMOTERS',
    title: 'Know which promoters actually perform',
    accent: 'perform',
    description:
      'Monitor promoter output, guest flow and campaign contribution without chasing screenshots or scattered spreadsheets.',
    image: '/images/promoters-transparent-rounded.png',
    alt: 'Promoter management interface',
    variant: 'white',
    transparentImage: true,
  },
  {
    eyebrow: 'PROMOTIONS',
    title: 'Launch offers when the room needs energy',
    accent: 'offers',
    description:
      'Create targeted promotions and push timely campaigns to the people most likely to show up tonight.',
    image: '/images/promotionsengine.png',
    alt: 'Promotion engine interface',
    variant: 'dark',
  },
  {
    eyebrow: 'TARGETING',
    title: 'Reach the right crowd, not just more people',
    accent: 'crowd',
    description:
      'Use event behavior and venue data to understand who to invite, when to reach them and what will move them.',
    image: '/images/campaign.png',
    alt: 'Campaign targeting interface',
    variant: 'white',
  },
];

const businessTrustItems = [
  {
    title: 'Private venue data',
    description: 'Keep your venue data structured, separated and ready for smarter decisions.',
    icon: DatabaseZap,
  },
  {
    title: 'API ready',
    description: 'Connect Bouncinn Business to the tools your team already uses.',
    icon: PlugZap,
  },
  {
    title: 'Built to scale',
    description: 'Support multiple nights, venues and campaigns without rebuilding your workflow.',
    icon: Scaling,
  },
];

export default function BusinessPage() {
  const locale = useLocale();
  const base = `/${locale}`;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#09090B] text-white selection:bg-live-red/30">
      <LandingNav active="business" showBusinessSignup />

      <section className="px-4 pb-12 pt-32 sm:px-6 md:pb-20 md:pt-40 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-black tracking-[0.22em] text-[#ff3234]">BOUNCINN BUSINESS</p>
          <h1 className="mx-auto mt-4 max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.075em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Run your venue from one live dashboard
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg font-bold leading-relaxed text-white/62 sm:text-xl">
            Running a venue usually feels like juggling ten glass balls at once. Currently, your data and operations are scattered everywhere-and that&apos;s exactly where you&apos;re losing money.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={`${base}/contact`}
              className="inline-flex h-14 items-center justify-center rounded-full bg-[#ff3234] px-8 text-base font-black text-white shadow-[0_18px_44px_rgba(255,50,52,0.32)] transition hover:-translate-y-0.5 hover:bg-[#e62c2e]"
            >
              Request demo
            </Link>
            <Link
              href={`${base}/business/sign-up`}
              className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-base font-black text-[#111111] shadow-[0_18px_44px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-white/90"
            >
              Sign up
            </Link>
          </div>

          <div className="mx-auto mt-14 max-w-5xl">
            <div className="relative mx-auto aspect-[2048/1358] w-full max-w-[980px]">
              <div className="absolute inset-x-[8.2%] top-[7.1%] bottom-[4.7%] rounded-t-[26px] border border-[#526070] bg-[#020304] shadow-[0_42px_120px_rgba(0,0,0,0.68)] md:rounded-t-[42px]">
                <div className="pointer-events-none absolute left-1/2 top-[2.6%] z-20 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#02070d] ring-2 ring-[#172033] shadow-[0_0_10px_rgba(59,130,246,0.7)]" />
                <div className="absolute inset-x-[1.6%] top-[1.8%] bottom-[3.2%] overflow-hidden rounded-t-[22px] bg-black md:rounded-t-[34px]">
                <Image
                  src="/images/business-dashboard.png"
                  alt="Bouncinn Business dashboard overview"
                  fill
                  priority
                  sizes="(max-width: 1024px) 84vw, 820px"
                  className="object-contain object-center opacity-95"
                />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-[1.2%] h-[4.3%] rounded-b-[24px] bg-gradient-to-b from-[#728196] via-[#273443] to-[#05070a] shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
                <div className="absolute left-1/2 top-0 h-[62%] w-[22%] -translate-x-1/2 rounded-b-[28px] bg-gradient-to-b from-[#8b98aa] to-[#283545] shadow-inner" />
                <div className="absolute inset-x-0 top-0 h-px bg-white/35" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8 px-4 pb-16 pt-6 sm:px-6 md:space-y-10 md:pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-black tracking-[0.22em] text-[#ff3234]">WHAT THE SYSTEM DOES</p>
          <h2 className="mx-auto mt-3 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.075em] text-white sm:text-6xl lg:text-7xl">
            One system for every moving part of the night
          </h2>
        </div>

        {businessFeatures.map((feature, index) => {
          const isWhite = feature.variant === 'white';
          const hasTransparentImage = 'transparentImage' in feature && feature.transparentImage;
          const imageFirst = index % 2 === 1;

          return (
            <article
              key={feature.title}
              className={`mx-auto grid max-w-7xl items-center gap-8 overflow-hidden rounded-[44px] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.38)] md:grid-cols-2 md:p-10 lg:p-14 ${
                isWhite ? 'bg-white text-[#111111]' : 'bg-[#141416] text-white ring-1 ring-white/10'
              }`}
            >
              <div className={`${imageFirst ? 'md:order-2' : ''} max-w-xl py-4 md:py-8`}>
                <p className="text-sm font-black tracking-[0.22em] text-[#ff3234]">{feature.eyebrow}</p>
                <h3 className="mt-4 text-5xl font-black leading-[0.92] tracking-[-0.075em] sm:text-6xl">
                  {feature.title.split(feature.accent)[0]}
                  <span className="text-[#ff3234]">{feature.accent}</span>
                  {feature.title.split(feature.accent)[1]}
                </h3>
                <p className={`mt-6 max-w-lg text-lg font-bold leading-relaxed sm:text-xl ${isWhite ? 'text-[#111111]/68' : 'text-white/62'}`}>
                  {feature.description}
                </p>
                <Link
                  href={`${base}/contact`}
                  className={`mt-7 inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-black transition hover:-translate-y-0.5 ${
                    isWhite
                      ? 'bg-[#111111] text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] hover:bg-[#ff3234]'
                      : 'bg-white text-[#111111] shadow-[0_14px_30px_rgba(0,0,0,0.22)] hover:bg-[#ff3234] hover:text-white'
                  }`}
                >
                  Request demo
                </Link>
              </div>

              <div className={`${imageFirst ? 'md:order-1' : ''} relative flex justify-center`}>
                <div
                  className={`relative w-full max-w-[560px] overflow-hidden rounded-[34px] ${
                    hasTransparentImage
                      ? 'bg-transparent shadow-none'
                      : `${isWhite ? 'bg-[#09090B]' : 'bg-black'} shadow-[0_24px_70px_rgba(0,0,0,0.34)]`
                  }`}
                >
                  <Image
                    src={feature.image}
                    alt={feature.alt}
                    width={1120}
                    height={760}
                    sizes="(max-width: 768px) 90vw, 560px"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[44px] bg-white p-6 text-[#111111] shadow-[0_28px_90px_rgba(0,0,0,0.38)] md:p-10 lg:p-14">
          <div className="grid gap-5 md:grid-cols-3">
            {businessTrustItems.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-[28px] bg-[#09090B] p-7 text-white shadow-[0_18px_48px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(255,50,52,0.22)]"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                  <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#ff3234]/25 blur-3xl" />
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#ff3234] to-transparent" />
                </div>
                <div className="relative flex h-12 w-12 items-center justify-center rounded-[16px] bg-white text-[#111111] transition duration-300 group-hover:rotate-[-6deg] group-hover:scale-110 group-hover:bg-[#ff3234] group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="relative mt-5 text-2xl font-black tracking-[-0.05em]">{title}</h3>
                <p className="relative mt-4 text-base font-bold leading-relaxed text-white/58">{description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-black/10 pt-8 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-black tracking-[0.22em] text-[#ff3234]">READY FOR A LIVE WALKTHROUGH?</p>
              <h2 className="mt-3 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.065em] sm:text-5xl">
                See how Bouncinn Business fits your venue.
              </h2>
            </div>
            <Link
              href={`${base}/contact`}
              className="inline-flex h-14 shrink-0 items-center justify-center rounded-full bg-[#ff3234] px-8 text-base font-black text-white shadow-[0_18px_44px_rgba(255,50,52,0.28)] transition hover:-translate-y-0.5 hover:bg-[#e62c2e]"
            >
              Request demo
            </Link>
          </div>
        </div>
      </section>

      <section id="contact" className="px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-black tracking-[0.22em] text-[#ff3234]">GET IN TOUCH</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.065em] text-white sm:text-5xl">
              Let&apos;s talk about your venue.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-bold leading-relaxed text-white/62">
              Fill out the form below and our team will follow up with a demo and pricing tailored to your business.
            </p>
          </div>

          <ContactForm />
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
