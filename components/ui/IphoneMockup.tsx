'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';

export function IphoneMockup({
  children,
  className = '',
  screenClassName = '',
}: {
  children: ReactNode;
  className?: string;
  screenClassName?: string;
}) {
  return (
    <div className={clsx('relative w-full rounded-[80px] border border-white/10 bg-[#050507] shadow-[0_30px_90px_rgba(0,0,0,0.55)] overflow-hidden', className)}>
      <div className="absolute inset-x-0 top-3 flex justify-center pointer-events-none">
        <div className="h-3 w-[220px] rounded-full bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.12)]" />
      </div>

      <div className="absolute inset-x-0 bottom-5 flex justify-center pointer-events-none">
        <span className="h-10 w-10 rounded-full border border-white/10 bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.12)]" />
      </div>

      <div className="relative h-full w-full px-4 pb-6 pt-10">
        <div className={clsx('relative h-full w-full overflow-hidden rounded-[52px] border border-white/5 bg-black', screenClassName)}>
          <div className="absolute left-1/2 top-3 -translate-x-1/2 h-7 w-[150px] rounded-b-[40px] bg-[#030304] border border-white/10 z-10" />
          <div className="relative h-full w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
