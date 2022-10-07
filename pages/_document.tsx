import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="エリザベスパークの特大顔出しパネルのウェブアプリ" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@JADENgygo" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="プリコネパネル" />
        <meta property="og:description" content="エリザベスパークの特大顔出しパネルのウェブアプリ" />
        <meta property="og:url" content="https://priconne-panel.vercel.app" />
        <meta property="og:image" content="https://priconne-panel.vercel.app/card.webp" />
        <link rel="icon" href="/peko.png" />
      </Head>
      <body>
        <script src="/script.js" async />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
