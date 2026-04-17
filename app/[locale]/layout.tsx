import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bouncinn',
  description: 'Event matchmaking and CRM platform',
  icons: {
    icon: [
      // Removing ?v=1 so Googlebot gets a stable, clean path
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    // Google often defaults to the 'apple' or 'icon' tag for search results
    apple: '/apple-touch-icon.png',
    // Point the shortcut to the high-res PNG as well
    shortcut: '/favicon-96x96.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'HuM0qAW7UbJL_UQhcW8pHiExNFur9VvoWcIk7-c4l4I',
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
