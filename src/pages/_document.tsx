import { Html, Head, Main, NextScript } from "next/document";

import config from "../config";

export default function Document() {
  return (
    <Html lang="en-GB">
      <Head>
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
