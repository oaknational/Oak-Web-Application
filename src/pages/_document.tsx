import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en-GB">
      <Head>
        <meta
          name="release-stage"
          content={process.env.NEXT_PUBLIC_RELEASE_STAGE}
        />
        <meta name="revised" content={new Date().toUTCString()} />
        <meta name="version" content={process.env.NEXT_PUBLIC_APP_VERSION} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
