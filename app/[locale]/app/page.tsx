'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LandingNav } from '@/components/LandingNav';
import { LandingFooter } from '@/components/LandingFooter';

const cards = [
  {
    image: '/images/app-ceren.png',
    title: 'LIVE AT ROOFTOP',
    meta: 'Ceren, 24',
    className:
      'z-20 w-[min(82vw,310px)] md:left-1/2 md:top-[14%] md:w-[225px] md:-translate-x-[126%] lg:w-[250px] bouncinn-card-left hover:-translate-y-6 hover:rotate-[-5deg]',
  },
  {
    image: '/images/app-male-profile.png',
    title: 'MATCHED TONIGHT',
    meta: 'Can, 27',
    className:
      'z-30 w-[min(82vw,310px)] md:left-1/2 md:top-[2%] md:w-[260px] md:-translate-x-1/2 lg:w-[290px] bouncinn-card-center hover:-translate-y-7 hover:rotate-[1deg]',
  },
  {
    image: '/images/app-ecem.png',
    title: 'SAME VENUE',
    meta: 'Ecem, 25',
    className:
      'z-10 w-[min(82vw,310px)] md:left-1/2 md:top-[16%] md:w-[225px] md:translate-x-[28%] lg:w-[250px] bouncinn-card-right hover:-translate-y-6 hover:rotate-[6deg]',
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
  className,
}: {
  image: string;
  title: string;
  meta: string;
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
        sizes="(max-width: 640px) 210px, (max-width: 1024px) 295px, 330px"
        className="rounded-[42px] object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-5 pb-5 pt-16 text-white">
        <p className="text-xs font-light tracking-[0.18em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{title}</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-xl font-black tracking-[-0.04em] text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]">{meta}</p>
          <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-bold backdrop-blur-md">LIVE</span>
        </div>
      </div>
    </article>
  );
}

export default function AppPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#09090B] text-[#111111] selection:bg-live-red/30 selection:text-white">
      <section className="relative flex min-h-screen flex-col justify-end overflow-hidden px-4 pb-10 pt-28 sm:px-6 md:pb-8 lg:px-8">
        <LandingNav active="app" />

        <div className="bouncinn-hero-perspective relative z-10 mx-auto flex w-full max-w-sm flex-col items-center gap-5 pt-4 md:block md:h-[500px] md:max-w-5xl md:pt-0 lg:h-[520px]">
          {cards.map((card) => (
            <SocialCard key={card.title} {...card} />
          ))}
        </div>

        <div className="relative z-20 mx-auto mt-8 max-w-4xl text-center md:mt-[-34px]">
          <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.075em] text-white sm:text-6xl md:text-6xl lg:text-7xl">
            Check-in. <span className="text-[#ff3234]">Match.</span> Meet.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-bold leading-relaxed text-white/65 sm:text-xl">
            Discover who&apos;s at the same venue or event before the night begins.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-8 overflow-hidden rounded-[44px] bg-white p-6 shadow-[0_28px_90px_rgba(0,0,0,0.38)] md:grid-cols-[1fr_0.82fr] md:p-10 lg:p-14">
          <div className="max-w-xl py-4 md:py-8">
            <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.075em] text-[#111111] sm:text-6xl lg:text-7xl">
              Let us help you find your <span className="text-[#ff3234]">vibe</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg font-bold leading-relaxed text-[#111111]/68 sm:text-xl">
              Browse curated local events and venues where your kind of people are already hanging out.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#"
                aria-label="Get it on Google Play"
                className="flex h-[60px] w-full max-w-[258px] items-center gap-4 rounded-[13px] bg-black px-5 text-white shadow-[0_14px_28px_rgba(0,0,0,0.24)] ring-1 ring-white/12 transition hover:-translate-y-1 hover:bg-[#111] sm:w-[258px]"
              >
                <Image src="/images/store-google-play.svg" alt="" width={42} height={42} className="h-10 w-10 shrink-0" />
                <span className="flex flex-col text-left leading-[0.95]">
                  <span className="text-[13px] font-semibold tracking-[0.05em] text-white/90">GET IT ON</span>
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
                  <span className="text-[13px] font-semibold tracking-[0.05em] text-white/90">Download on the</span>
                  <span className="mt-1 text-[26px] font-black tracking-[-0.05em]">App Store</span>
                </span>
              </Link>
            </div>
          </div>

          <div className="relative aspect-square w-full max-w-[560px] justify-self-center overflow-hidden rounded-[34px] bg-black shadow-[0_24px_70px_rgba(40,0,0,0.34)] md:justify-self-end">
            <Image
              src="/images/app-vibe-night.png"
              alt="People browsing Bouncinn at a nightclub"
              fill
              sizes="(max-width: 768px) 100vw, 620px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 pt-4 sm:px-6 md:pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black tracking-[0.22em] text-[#ff3234]">HOW IT WORKS</p>
              <h2 className="mt-3 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.075em] text-white sm:text-6xl lg:text-7xl">
                From plan to people in three taps
              </h2>
            </div>
            <p className="max-w-md text-lg font-bold leading-relaxed text-white/58">
              
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3 lg:gap-7">
            {howSteps.map((step) => (
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
              Find out where the <span className="text-[#ff3234]">crowd</span> is
            </h2>
            <p className="mt-6 max-w-lg text-lg font-bold leading-relaxed text-[#111111]/68 sm:text-xl">
              All events in one app. People are here too.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#"
                aria-label="Get it on Google Play"
                className="flex h-[60px] w-full max-w-[258px] items-center gap-4 rounded-[13px] bg-black px-5 text-white shadow-[0_14px_28px_rgba(0,0,0,0.24)] ring-1 ring-white/12 transition hover:-translate-y-1 hover:bg-[#111] sm:w-[258px]"
              >
                <Image src="/images/store-google-play.svg" alt="" width={42} height={42} className="h-10 w-10 shrink-0" />
                <span className="flex flex-col text-left leading-[0.95]">
                  <span className="text-[13px] font-semibold tracking-[0.05em] text-white/90">GET IT ON</span>
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
                  <span className="text-[13px] font-semibold tracking-[0.05em] text-white/90">Download on the</span>
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
