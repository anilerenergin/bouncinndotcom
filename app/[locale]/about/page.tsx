'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { CalendarCheck, MapPin, UsersRound } from 'lucide-react';
import { LandingFooter } from '@/components/LandingFooter';
import { LandingNav } from '@/components/LandingNav';
import { getSiteCopy } from '@/lib/siteCopy';

const principles = [MapPin, UsersRound, CalendarCheck];

export default function AboutPage() {
  const locale = useLocale();
  const copy = getSiteCopy(locale).about;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#09090B] text-white selection:bg-live-red/30">
      <LandingNav />

      <section className="px-4 pb-14 pt-32 sm:px-6 md:pb-20 md:pt-40 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm font-black tracking-[0.22em] text-[#ff3234]">{copy.eyebrow}</p>
            <h1 className="mt-4 max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.075em] sm:text-6xl lg:text-8xl">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-bold leading-relaxed text-white/62 sm:text-xl">
              {copy.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/${locale}/app`}
                className="inline-flex h-14 items-center justify-center rounded-full bg-[#ff3234] px-8 text-base font-black text-white shadow-[0_18px_44px_rgba(255,50,52,0.32)] transition hover:-translate-y-0.5 hover:bg-[#e62c2e]"
              >
                {copy.appCta}
              </Link>
              <Link
                href={`/${locale}/business`}
                className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-base font-black text-[#111111] shadow-[0_18px_44px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                {copy.businessCta}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-[44px] bg-white shadow-[0_28px_90px_rgba(0,0,0,0.38)]">
            <Image
              src="/images/app-crowd-discover.png"
              alt="Bouncinn discover app screen"
              fill
              priority
              sizes="(max-width: 768px) 88vw, 520px"
              className="object-contain p-8"
            />
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {principles.map((Icon, index) => {
            const [title, description] = copy.principles[index];

            return (
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
            );
          })}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-8 rounded-[44px] bg-white p-6 text-[#111111] shadow-[0_28px_90px_rgba(0,0,0,0.38)] md:grid-cols-[0.92fr_1fr] md:p-10 lg:p-14">
          <div className="relative aspect-square overflow-hidden rounded-[34px] bg-black">
            <Image
              src="/images/app-vibe-night.png"
              alt="People using Bouncinn at a venue"
              fill
              sizes="(max-width: 768px) 90vw, 520px"
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-sm font-black tracking-[0.22em] text-[#ff3234]">{copy.whyEyebrow}</p>
            <h2 className="mt-4 text-5xl font-black leading-[0.92] tracking-[-0.075em] sm:text-6xl">
              {copy.whyTitle}
            </h2>
            <p className="mt-6 text-lg font-bold leading-relaxed text-[#111111]/66 sm:text-xl">{copy.whyBodyA}</p>
            <p className="mt-5 text-lg font-bold leading-relaxed text-[#111111]/66 sm:text-xl">{copy.whyBodyB}</p>
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
