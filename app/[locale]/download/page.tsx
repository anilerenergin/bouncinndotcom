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

        <div className="flex flex-col w-full gap-4 pt-6 px-6 items-center">
          <a href="https://apps.apple.com/us/app/bouncinn/id6759291367" target="_blank" rel="noopener noreferrer" className="w-[200px] transition-transform active:scale-95 hover:opacity-90">
            <Image
              src="/images/app-store-badge.svg"
              alt="Download on the App Store"
              width={200}
              height={60}
              className="w-full h-auto"
            />
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.bouncinn.app&hl=tr" target="_blank" rel="noopener noreferrer" className="w-[200px] transition-transform active:scale-95 hover:opacity-90">
            <Image
              src="/images/google-play-badge.svg"
              alt="Get it on Google Play"
              width={200}
              height={60}
              className="w-full h-auto"
            />
          </a>
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
