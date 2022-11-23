import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins" />
        <NextScript src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></NextScript>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}