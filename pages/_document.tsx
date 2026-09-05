import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  const pixelId = process.env.NEXT_PUBLIC_OPENAI_ADS_PIXEL_ID;
  const serializedPixelId = pixelId
    ? JSON.stringify(pixelId).replace(/</g, '\\u003c')
    : null;

  return (
    <Html>
      <Head>
        {serializedPixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
(function (w, d, s, u) {
  if (w.oaiq) return;
  var q = function () {
    q.q.push(arguments);
  };
  q.q = [];
  w.oaiq = q;
  var js = d.createElement(s);
  js.async = true;
  js.src = u;
  var f = d.getElementsByTagName(s)[0];
  f.parentNode.insertBefore(js, f);
})(window, document, "script", "https://bzrcdn.openai.com/sdk/oaiq.min.js");

oaiq("init", {
  pixelId: ${serializedPixelId},
});

oaiq("measure", "page_viewed", {
  type: "contents",
  contents: [
    {
      id: window.location.pathname,
      content_type: "page",
    },
  ],
});
              `,
            }}
          />
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
