import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { ServerStyleSheet } from "styled-components";
import parse from "html-react-parser";

import { FAVICON_LINKS_HEAD_INNER_HTML } from "../image-data";
import getBrowserConfig from "../browser-lib/getBrowserConfig";

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

          <meta
            name="release-stage"
            content={getBrowserConfig("releaseStage")}
          />
          <meta name="revised" content={new Date().toUTCString()} />
          <meta name="version" content={getBrowserConfig("appVersion")} />

          <meta
            name="pingdom-uptime-check"
            content={getBrowserConfig("pingdomUptimeId")}
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
