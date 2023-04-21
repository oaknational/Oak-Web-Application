import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { ServerStyleSheet } from "styled-components";
import parse from "html-react-parser";

import config from "../config/browser";
import { FAVICON_LINKS_HEAD_INNER_HTML } from "../image-data";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="en-GB">
        <Head>
          {parse(FAVICON_LINKS_HEAD_INNER_HTML)}

          <link
            href="https://googleapis-fonts.thenational.academy/css2?family=Lexend:wght@300;400;600&display=swap"
            rel="stylesheet"
          />

          <meta name="release-stage" content={config.get("releaseStage")} />
          <meta name="revised" content={new Date().toUTCString()} />
          <meta name="version" content={config.get("appVersion")} />

          <meta
            name="pingdom-uptime-check"
            content={config.get("pingdomUptimeId")}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
