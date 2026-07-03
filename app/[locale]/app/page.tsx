'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { LandingNav } from '@/components/LandingNav';
import { LandingFooter } from '@/components/LandingFooter';
import { getSiteCopy } from '@/lib/siteCopy';

const cards = [
  {
    image: '/images/app-ceren.png',
    title: 'LIVE AT ROOFTOP',
    meta: 'Ceren, 24',
    className:
      'z-20 max-md:absolute max-md:left-1/2 max-md:top-[90px] max-md:w-[150px] max-md:-translate-x-[122%] max-md:rotate-[-10deg] max-md:[animation:none] md:left-1/2 md:top-[18%] md:w-[225px] md:-translate-x-[126%] lg:w-[275px] 2xl:w-[305px] bouncinn-card-left hover:-translate-y-6 hover:rotate-[-5deg]',
  },
  {
    image: '/images/app-male-profile.png',
    title: 'MATCHED TONIGHT',
    meta: 'Can, 27',
    className:
      'z-30 max-md:absolute max-md:left-1/2 max-md:top-[26px] max-md:w-[205px] max-md:-translate-x-1/2 max-md:rotate-[2deg] max-md:[animation:none] md:left-1/2 md:top-[8%] md:w-[260px] md:-translate-x-1/2 lg:w-[315px] 2xl:w-[350px] bouncinn-card-center hover:-translate-y-7 hover:rotate-[1deg]',
  },
  {
    image: '/images/app-ecem.png',
    title: 'SAME VENUE',
    meta: 'Ecem, 25',
    className:
      'z-10 max-md:absolute max-md:left-1/2 max-md:top-[96px] max-md:w-[150px] max-md:translate-x-[22%] max-md:rotate-[11deg] max-md:[animation:none] md:left-1/2 md:top-[20%] md:w-[225px] md:translate-x-[28%] lg:w-[275px] 2xl:w-[305px] bouncinn-card-right hover:-translate-y-6 hover:rotate-[6deg]',
  },
];

const howSteps = [
  {
    title: 'Find your event',
    image: '/images/how-find-event.png',
  },
  {
    title: 'Make your check-in',
    image: '/images/how-check-in.png',
  },
  {
    title: 'Meet the people',
    image: '/images/how-meet-people.png',
  },
];

function SocialCard({
  image,
  title,
  meta,
  liveLabel,
  className,
}: {
  image: string;
  title: string;
  meta: string;
  liveLabel: string;
  className: string;
}) {
  return (
    <article
      className={`group relative isolate aspect-[9/16] overflow-hidden rounded-[42px] bg-[#111] shadow-[0_34px_80px_rgba(12,13,15,0.28)] ring-1 ring-white/70 transition duration-500 will-change-transform [clip-path:inset(0_round_42px)] md:absolute ${className}`}
    >
      <Image
        src={image}
        alt={title}
        fill
        priority
        sizes="(max-width: 640px) 205px, (max-width: 1024px) 295px, 380px"
        className="rounded-[42px] object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent px-4 pb-4 pt-16 text-white md:px-5 md:pb-5">
        <p className="text-xs font-light tracking-[0.18em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{title}</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-xl font-black tracking-[-0.04em] text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]">{meta}</p>
          <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-bold backdrop-blur-md">{liveLabel}</span>
        </div>
      </div>
    </article>
  );
}

export default function AppPage() {
  const locale = useLocale();
  const copy = getSiteCopy(locale).app;
  const vibeEyebrow = locale === 'tr' ? 'GECENI KESFET' : locale === 'de' ? 'ENTDECKE DEINE NACHT' : 'DISCOVER YOUR NIGHT';
  const localizedCards = cards.map((card, index) => ({
    ...card,
    title: [copy.cards.rooftop, copy.cards.matched, copy.cards.sameVenue][index],
    liveLabel: copy.cards.live,
  }));
  const localizedHowSteps = howSteps.map((step, index) => ({
    ...step,
    title: copy.howSteps[index],
  }));

  return (
    <main className="min-h-screen overflow-hidden bg-[#09090B] text-[#111111] selection:bg-live-red/30 selection:text-white">
      <section className="relative flex min-h-[760px] flex-col justify-end overflow-hidden px-4 pb-10 pt-36 sm:px-6 md:min-h-screen md:pb-8 md:pt-24 lg:px-8 2xl:pt-20">
        <LandingNav active="app" />

        <div className="bouncinn-hero-perspective relative z-10 mx-auto h-[390px] w-full max-w-[390px] overflow-visible pt-4 md:block md:h-[540px] md:max-w-5xl md:pt-0 lg:h-[585px] lg:max-w-6xl lg:-translate-y-12 2xl:h-[625px] 2xl:max-w-[1240px] 2xl:-translate-y-14">
          {localizedCards.map((card) => (
            <SocialCard key={card.title} {...card} />
          ))}
        </div>

        <div className="relative z-20 mx-auto mt-5 max-w-[1400px] text-center md:mt-[-18px] lg:mt-[-70px] 2xl:mt-[-82px]">
          <h2 className="text-[3.2rem] font-black leading-[0.9] tracking-[-0.075em] text-white sm:text-6xl md:text-6xl lg:text-8xl 2xl:whitespace-nowrap 2xl:text-[5.7rem]">
            {copy.heroTitleA} <span className="text-[#ff3234]">{copy.heroTitleB}</span> {copy.heroTitleC}
          </h2>
          <p className="mx-auto mt-4 max-w-[320px] text-base font-bold leading-relaxed text-white/65 sm:max-w-2xl sm:text-xl 2xl:max-w-3xl 2xl:text-2xl">
            {copy.heroDescription}
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-12 sm:px-6 md:py-20 lg:px-8">
        <div className="pointer-events-none absolute bottom-0 right-[-10%] h-[420px] w-[420px] rounded-full bg-white/[0.03] blur-[140px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1fr_0.86fr] lg:gap-16">
          <div className="max-w-2xl py-4 md:py-8">
            <p className="mb-5 text-sm font-black tracking-[0.22em] text-white/42">{vibeEyebrow}</p>
            <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.075em] text-white sm:text-6xl lg:text-7xl">
              {copy.vibeTitleA} {copy.vibeTitleAccent && <span className="text-[#ff3234]">{copy.vibeTitleAccent}</span>}
            </h2>
            <p className="mt-6 max-w-xl text-lg font-bold leading-relaxed text-white/62 sm:text-xl">
              {copy.vibeDescription}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#"
                aria-label="Get it on Google Play"
                className="flex h-[60px] w-full max-w-[258px] items-center gap-4 rounded-[13px] bg-black px-5 text-white shadow-[0_18px_38px_rgba(0,0,0,0.34)] ring-1 ring-white/12 transition hover:-translate-y-1 hover:bg-[#111] hover:ring-white/24 sm:w-[258px]"
              >
                <Image src="/images/store-google-play.svg" alt="" width={42} height={42} className="h-10 w-10 shrink-0" />
                <span className="flex flex-col text-left leading-[0.95]">
                  <span className="text-[13px] font-semibold tracking-[0.05em] text-white/90">{copy.googleSmall}</span>
                  <span className="mt-1 text-[26px] font-black tracking-[-0.05em]">Google Play</span>
                </span>
              </Link>
              <Link
                href="#"
                aria-label="Download on the App Store"
                className="flex h-[60px] w-full max-w-[258px] items-center gap-4 rounded-[13px] bg-black px-5 text-white shadow-[0_18px_38px_rgba(0,0,0,0.34)] ring-1 ring-white/12 transition hover:-translate-y-1 hover:bg-[#111] hover:ring-white/24 sm:w-[258px]"
              >
                <Image src="/images/store-apple.svg" alt="" width={42} height={42} className="h-10 w-10 shrink-0" />
                <span className="flex flex-col text-left leading-[0.95]">
                  <span className="text-[13px] font-semibold tracking-[0.05em] text-white/90">{copy.appleSmall}</span>
                  <span className="mt-1 text-[26px] font-black tracking-[-0.05em]">App Store</span>
                </span>
              </Link>
            </div>
          </div>

          <div className="relative aspect-square w-full max-w-[560px] justify-self-center rounded-[38px] bg-white/[0.03] p-2 shadow-[0_28px_90px_rgba(0,0,0,0.32)] ring-1 ring-white/10 md:justify-self-end">
            <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-black">
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-black/36 via-transparent to-black/8" />
            <Image
              src="/images/app-vibe-night.png"
              alt="People browsing Bouncinn at a nightclub"
              fill
              sizes="(max-width: 768px) 100vw, 620px"
              className="object-cover"
            />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 pt-4 sm:px-6 md:pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black tracking-[0.22em] text-[#ff3234]">{copy.howEyebrow}</p>
              <h2 className="mt-3 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.075em] text-white sm:text-6xl lg:text-7xl">
                {copy.howTitle}
              </h2>
            </div>
            <p className="max-w-md text-lg font-bold leading-relaxed text-white/58">
              
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3 lg:gap-7">
            {localizedHowSteps.map((step) => (
              <article
                key={step.title}
                className="group rounded-[34px] p-2 transition duration-300 hover:-translate-y-2"
              >
                <div className="relative mx-auto w-full max-w-[235px]">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={370}
                    height={762}
                    sizes="(max-width: 768px) 70vw, 235px"
                    className="h-auto w-full transition duration-700 group-hover:scale-[1.015]"
                  />
                </div>
                <div className="px-2 pb-2 pt-6 text-center">
                  <h3 className="text-2xl font-black tracking-[-0.05em] text-white">{step.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-8 overflow-hidden rounded-[44px] bg-white p-6 shadow-[0_28px_90px_rgba(0,0,0,0.38)] md:grid-cols-[0.82fr_1fr] md:p-10 lg:p-14">
          <div className="relative mx-auto w-full max-w-[300px]">
            <Image
              src="/images/app-crowd-discover.png"
              alt="Bouncinn discover screen"
              width={640}
              height={1262}
              sizes="(max-width: 768px) 70vw, 300px"
              className="h-auto w-full"
            />
          </div>

          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.075em] text-[#111111] sm:text-6xl lg:text-7xl">
              {copy.crowdTitleA} <span className="text-[#ff3234]">{copy.crowdTitleAccent}</span> {copy.crowdTitleB}
            </h2>
            <p className="mt-6 max-w-lg text-lg font-bold leading-relaxed text-[#111111]/68 sm:text-xl">
              {copy.crowdDescription}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#"
                aria-label="Get it on Google Play"
                className="flex h-[60px] w-full max-w-[258px] items-center gap-4 rounded-[13px] bg-black px-5 text-white shadow-[0_14px_28px_rgba(0,0,0,0.24)] ring-1 ring-white/12 transition hover:-translate-y-1 hover:bg-[#111] sm:w-[258px]"
              >
                <Image src="/images/store-google-play.svg" alt="" width={42} height={42} className="h-10 w-10 shrink-0" />
                <span className="flex flex-col text-left leading-[0.95]">
                  <span className="text-[13px] font-semibold tracking-[0.05em] text-white/90">{copy.googleSmall}</span>
                  <span className="mt-1 text-[26px] font-black tracking-[-0.05em]">Google Play</span>
                </span>
              </Link>
              <Link
                href="#"
                aria-label="Download on the App Store"
                className="flex h-[60px] w-full max-w-[258px] items-center gap-4 rounded-[13px] bg-black px-5 text-white shadow-[0_14px_28px_rgba(0,0,0,0.24)] ring-1 ring-white/12 transition hover:-translate-y-1 hover:bg-[#111] sm:w-[258px]"
              >
                <Image src="/images/store-apple.svg" alt="" width={42} height={42} className="h-10 w-10 shrink-0" />
                <span className="flex flex-col text-left leading-[0.95]">
                  <span className="text-[13px] font-semibold tracking-[0.05em] text-white/90">{copy.appleSmall}</span>
                  <span className="mt-1 text-[26px] font-black tracking-[-0.05em]">App Store</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
