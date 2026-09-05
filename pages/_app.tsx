import '@fortawesome/fontawesome-svg-core/styles.css';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import AnnouncementBar from '../components/AnnouncementBar';
import './style.css';

declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void;
  }
}

function OpenAIAdsRouteTracker() {
  useEffect(() => {
    const trackPageView = () => {
      try {
        window.oaiq?.('measure', 'page_viewed', {
          type: 'contents',
          contents: [
            {
              id: window.location.pathname,
              content_type: 'page',
            },
          ],
        });
      } catch {
        // Conversion measurement must never interrupt navigation.
      }
    };

    Router.events.on('routeChangeComplete', trackPageView);

    return () => {
      Router.events.off('routeChangeComplete', trackPageView);
    };
  }, []);

  return null;
}

function MyApp({ Component, pageProps }: AppProps) {
  const openAIAdsPixelId = process.env.NEXT_PUBLIC_OPENAI_ADS_PIXEL_ID;

  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-ST7R3WQ353" />
      <Script>{`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-ST7R3WQ353');
`}
      </Script>

      {openAIAdsPixelId && <OpenAIAdsRouteTracker />}
      <AnnouncementBar />
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
