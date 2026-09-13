import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iseeskrjduslooowowcc.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'cdn.bugece.co',
      },
      {
        protocol: 'https',
        hostname: 'supabase.bouncinn.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
