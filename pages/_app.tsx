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

function OpenAIAdsPixel({ pixelId }: { pixelId: string }) {
  useEffect(() => {
    const trackPageView = () => {
      window.oaiq?.('measure', 'page_viewed');
    };

    Router.events.on('routeChangeComplete', trackPageView);

    return () => {
      Router.events.off('routeChangeComplete', trackPageView);
    };
  }, []);

  return (
    <Script id="openai-ads-pixel" strategy="afterInteractive">
      {`
!function(w,d,s,u,o,f,js,fjs){w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)},w[o].l=1*new Date();f=d.createElement(s),js=d.getElementsByTagName(s)[0],f.async=1,f.src=u,js.parentNode.insertBefore(f,js)}(window,document,"script","https://cdn.openai.com/oaiq.js","oaiq");
oaiq("init", ${JSON.stringify(pixelId)});
oaiq("measure", "page_viewed");
      `}
    </Script>
  );
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

      {openAIAdsPixelId && <OpenAIAdsPixel pixelId={openAIAdsPixelId} />}
      <AnnouncementBar />
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
