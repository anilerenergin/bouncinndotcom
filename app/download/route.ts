import { NextResponse } from 'next/server';

const APPLE_STORE_URL = 'https://apps.apple.com/us/app/bouncinn/id6759291367';
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.bouncinn.app&hl=tr';

const isAndroid = (userAgent: string) => /android/i.test(userAgent);
const isIos = (userAgent: string) =>
  /iphone|ipad|ipod|ios/i.test(userAgent) ||
  (/macintosh/i.test(userAgent) && /mobile/i.test(userAgent));

export function GET(request: Request) {
  const userAgent = request.headers.get('user-agent') ?? '';

  if (isIos(userAgent)) {
    return NextResponse.redirect(APPLE_STORE_URL);
  }

  if (isAndroid(userAgent)) {
    return NextResponse.redirect(GOOGLE_PLAY_URL);
  }

  return new NextResponse(
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Download Bouncinn</title>
    <script>
      const ua = navigator.userAgent || '';
      const isIos = /iphone|ipad|ipod|ios/i.test(ua) || (/macintosh/i.test(ua) && /mobile/i.test(ua));
      const isAndroid = /android/i.test(ua);
      const APPLE_URL = '${APPLE_STORE_URL}';
      const PLAY_URL = '${GOOGLE_PLAY_URL}';

      if (isIos) {
        window.location.replace(APPLE_URL);
      } else if (isAndroid) {
        window.location.replace(PLAY_URL);
      }
    </script>
  </head>
  <body>
    <h1>Download Bouncinn</h1>
    <p>We couldn't detect your device automatically. Choose your store manually:</p>
    <ul>
      <li><a href="${APPLE_STORE_URL}">Download on the App Store</a></li>
      <li><a href="${GOOGLE_PLAY_URL}">Download on Google Play</a></li>
    </ul>
  </body>
</html>`,
    {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }
  );
}
