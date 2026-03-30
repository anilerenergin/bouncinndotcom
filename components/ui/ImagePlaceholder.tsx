'use client';

export const ImagePlaceholder = ({ className = "" }: { className?: string }) => (
  <div className={`relative bg-[#141415] border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden group shadow-2xl ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
    <p className="text-white/30 font-bold tracking-widest text-xs uppercase z-10 transition-transform group-hover:scale-110">PUT IMAGE HERE</p>
  </div>
);
