import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function DownloadPage() {
  const t = await getTranslations("Index");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,51,50,0.34),_transparent_42%),linear-gradient(135deg,_#080505_0%,_#140c0c_45%,_#040303_100%)] px-5 py-8 text-center text-white sm:px-6 sm:py-10 md:py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.06)_0,_transparent_65%)]" />
      <div className="absolute left-1/2 top-[-8rem] h-72 w-72 -translate-x-1/2 rounded-full bg-[#ff3332]/40 blur-[110px] animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-4rem] right-[-2rem] h-56 w-56 rounded-full bg-white/15 blur-[95px]" />
      <div className="absolute inset-0 opacity-80 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14)_0,transparent_28%),radial-gradient(circle_at_80%_80%,rgba(255,51,50,0.3)_0,transparent_24%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.08)_0,transparent_32%)]" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between">
        <header className="w-full pt-2 sm:pt-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/55 opacity-0 animate-[fadeIn_700ms_ease-out_forwards] sm:text-[12px]">
            {t("download_page_eyebrow")}
          </p>
        </header>

        <section className="flex w-full flex-1 flex-col items-center justify-center px-1 py-8 sm:py-10">
          <div className="relative w-full max-w-sm overflow-hidden rounded-[2.3rem] border border-white/10 bg-black/20 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.36)] backdrop-blur-[12px] backdrop-saturate-100 ring-1 ring-white/8 opacity-0 animate-[fadeIn_900ms_ease-out_forwards] sm:p-8">
            <div className="absolute inset-0 animate-[pulse_10s_ease-in-out_infinite] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_58%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_54%),linear-gradient(135deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0.01))]" />
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
            <div className="relative z-10">
              <div className="mb-5 flex justify-center">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.75rem] bg-[#ff3332] shadow-[0_22px_70px_rgba(255,51,50,0.4)] transition-transform duration-700 hover:scale-105 sm:h-32 sm:w-32">
                  <Image
                    src="/images/icon.png"
                    alt="Bouncinn Logo"
                    width={112}
                    height={112}
                    className="h-3/5 w-3/5 object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="mb-4 flex flex-col items-center gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/50">
                  {t("download_page_badge")}
                </p>
                <h2 className="text-[2rem] font-semibold tracking-[0.08em] text-white sm:text-[2.35rem]">
                  {t("download_page_brand")}
                </h2>
              </div>

              <p className="mx-auto max-w-[20rem] text-[0.95rem] leading-7 text-white/80 sm:text-[1rem]">
                {t("download_page_description")}
              </p>

              <div className="mt-7 flex flex-col items-center gap-3 px-1 opacity-0 animate-[fadeIn_1200ms_ease-out_forwards] sm:mt-8">
                <Link
                  href="https://apps.apple.com/us/app/bouncinn/id6759291367"
                  className="w-[200px] transition-transform duration-200 active:scale-95 hover:opacity-90"
                >
                  <Image
                    src="/images/app-store-badge.svg"
                    alt={t("download_page_apple_alt")}
                    width={200}
                    height={60}
                    className="h-auto w-full"
                  />
                </Link>
                <Link
                  href="https://play.google.com/store/apps/details?id=com.bouncinn.app&hl=tr"
                  className="w-[200px] transition-transform duration-200 active:scale-95 hover:opacity-90"
                >
                  <Image
                    src="/images/google-play-badge.svg"
                    alt={t("download_page_google_alt")}
                    width={200}
                    height={60}
                    className="h-auto w-full"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="w-full pb-2 text-[0.9rem] font-medium tracking-[0.25em] text-white/60 sm:pb-0">
          {t("download_page_footer")}
        </footer>
      </div>
    </main>
  );
}
