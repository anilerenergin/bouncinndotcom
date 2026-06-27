import Image from "next/image";
import Link from "next/link";

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#da2825] to-[#1f1717] flex flex-col items-center justify-between py-12 px-6 text-center text-white">
      {/* Top Text */}
      <div className="w-full mt-4">
        <h1 className="text-xl md:text-2xl font-medium tracking-wide">Find friends for events.</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center max-w-sm mx-auto space-y-6 w-full flex-grow justify-center mt-[-40px]">
        <div className="w-28 h-28 md:w-32 md:h-32 mb-2 rounded-[1.75rem] overflow-hidden shadow-2xl drop-shadow-xl flex items-center justify-center bg-[#FF3332]">
          <Image
            src="/images/icon.png"
            alt="Bouncinn Logo"
            width={112}
            height={112}
            className="object-contain w-3/5 h-3/5"
            priority
          />
        </div>
        
        <h2 className="text-[32px] md:text-4xl font-bold tracking-tight">Bouncinn</h2>
        
        <p className="text-[16px] md:text-lg text-white/95 leading-snug px-4">
          Find people going to the same events or venues with you.
        </p>

        <div className="flex flex-col w-full gap-4 pt-6 px-6 items-center">
          <Link href="https://apps.apple.com/us/app/bouncinn/id6759291367" className="w-[200px] transition-transform active:scale-95 hover:opacity-90">
            <Image
              src="/images/app-store-badge.svg"
              alt="Download on the App Store"
              width={200}
              height={60}
              className="w-full h-auto"
            />
          </Link>
          <Link href="https://play.google.com/store/apps/details?id=com.bouncinn.app&hl=tr" className="w-[200px] transition-transform active:scale-95 hover:opacity-90">
            <Image
              src="/images/google-play-badge.svg"
              alt="Get it on Google Play"
              width={200}
              height={60}
              className="w-full h-auto"
            />
          </Link>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="w-full mb-4 text-[15px] opacity-90 font-medium tracking-wide">
        Bouncinn.com
      </div>
    </main>
  );
}
