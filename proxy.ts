import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'tr'],
  defaultLocale: 'tr',
  localePrefix: 'always'
});

export function proxy(req: NextRequest) {
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/', '/(tr|en)/:path*']
};
