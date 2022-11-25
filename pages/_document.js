import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html>
      <Head>
        <Script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}