import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'tr', 'de'] as const;

function isLocale(locale: string | undefined): locale is (typeof locales)[number] {
  return locales.some((supportedLocale) => supportedLocale === locale);
}

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  
  // Validate that the incoming `locale` parameter is valid
  if (!isLocale(locale)) {
    locale = 'en';
  }

  return {
    locale: locale as string,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
