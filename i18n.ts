import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'tr', 'de'] as const;
type Locale = (typeof locales)[number];

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    locale = 'en';
  }

  return {
    locale: locale as string,
    messages: (await import(`./messages/${locale === 'de' ? 'en' : locale}.json`)).default
  };
});
