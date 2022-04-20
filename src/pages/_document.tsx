import { Html, Head, Main, NextScript } from "next/document";

import config from "../config";

export default function Document() {
  return (
    <Html lang="en-GB">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@300&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=ABeeZee&display=swap"
          rel="stylesheet"
        />
        <meta name="release-stage" content={config.get("releaseStage")} />
        <meta name="revised" content={new Date().toUTCString()} />
        <meta name="version" content={config.get("appVersion")} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
