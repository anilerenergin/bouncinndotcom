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
      { url: '/favicon-96x96.png?v=1', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg?v=1', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png?v=1',
    shortcut: '/favicon.ico?v=1',
  },
  manifest: '/site.webmanifest?v=1',
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
