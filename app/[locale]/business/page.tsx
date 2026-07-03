'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import ContactForm from '@/components/ContactForm';
import { LandingNav } from '@/components/LandingNav';
import { LandingFooter } from '@/components/LandingFooter';
import { getSiteCopy } from '@/lib/siteCopy';
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
  const copy = getSiteCopy(locale).business;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#09090B] text-white selection:bg-live-red/30">
      <LandingNav active="business" />

      <section className="px-4 pb-12 pt-32 sm:px-6 md:pb-20 md:pt-40 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-black tracking-[0.22em] text-[#ff3234]">{copy.eyebrow}</p>
          <h1 className="mx-auto mt-4 max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.075em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
            {copy.heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg font-bold leading-relaxed text-white/62 sm:text-xl">
            {copy.heroDescription}
          </p>

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
          <p className="text-sm font-black tracking-[0.22em] text-[#ff3234]">{copy.systemEyebrow}</p>
          <h2 className="mx-auto mt-3 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.075em] text-white sm:text-6xl lg:text-7xl">
            {copy.systemTitle}
          </h2>
        </div>

        {businessFeatures.map((feature, index) => {
          const featureCopy = copy.features[index];
          const hasTransparentImage = 'transparentImage' in feature && feature.transparentImage;
          const imageFirst = index % 2 === 1;

          return (
            <article
              key={featureCopy.title}
              className="mx-auto grid max-w-7xl items-center gap-8 border-t border-white/10 py-12 md:grid-cols-2 md:py-16 lg:gap-16 lg:py-20"
            >
              <div className={`${imageFirst ? 'md:order-2' : ''} max-w-xl py-4 md:py-8`}>
                <p className="text-sm font-black tracking-[0.22em] text-white/42">{featureCopy.eyebrow}</p>
                <h3 className="mt-4 text-5xl font-black leading-[0.92] tracking-[-0.075em] sm:text-6xl">
                  {featureCopy.title.split(featureCopy.accent)[0]}
                  <span className="text-[#ff3234]">{featureCopy.accent}</span>
                  {featureCopy.title.split(featureCopy.accent)[1]}
                </h3>
                <p className="mt-6 max-w-lg text-lg font-bold leading-relaxed text-white/62 sm:text-xl">
                  {featureCopy.description}
                </p>
              </div>

              <div className={`${imageFirst ? 'md:order-1' : ''} relative flex justify-center`}>
                <div
                  className={`relative w-full max-w-[560px] overflow-hidden rounded-[34px] ${
                    hasTransparentImage
                      ? 'bg-transparent shadow-none'
                      : 'bg-black/30 shadow-[0_24px_70px_rgba(0,0,0,0.24)] ring-1 ring-white/10'
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
        <div className="mx-auto max-w-7xl border-y border-white/10 py-10 md:py-14">
          <div className="grid gap-10 md:grid-cols-3">
            {businessTrustItems.map(({ icon: Icon }, index) => {
              const [title, description] = copy.trust[index];

              return (
              <div
                key={title}
                className="group relative text-white transition duration-300 hover:-translate-y-1"
              >
                <div className="relative flex h-12 w-12 items-center justify-center rounded-[16px] bg-white/8 text-white ring-1 ring-white/12 transition duration-300 group-hover:rotate-[-6deg] group-hover:scale-110 group-hover:bg-white group-hover:text-[#111111]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="relative mt-5 text-2xl font-black tracking-[-0.05em]">{title}</h3>
                <p className="relative mt-4 text-base font-bold leading-relaxed text-white/58">{description}</p>
              </div>
            );
            })}
          </div>

          <div className="mt-12 border-t border-white/10 pt-8">
            <div>
              <p className="text-sm font-black tracking-[0.22em] text-white/42">{copy.walkthroughEyebrow}</p>
              <h2 className="mt-3 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.065em] text-white sm:text-5xl">
                {copy.walkthroughTitle}
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-black tracking-[0.22em] text-[#ff3234]">{copy.contactEyebrow}</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.065em] text-white sm:text-5xl">
              {copy.contactTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-bold leading-relaxed text-white/62">
              {copy.contactDescription}
            </p>
          </div>

          <ContactForm />
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
