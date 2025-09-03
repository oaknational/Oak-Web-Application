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
          <meta
            name="pingdom-uptime-check"
            content={getBrowserConfig("pingdomUptimeId")}
          />
          {parse(FAVICON_LINKS_HEAD_INNER_HTML)}
          <meta
            name="release-stage"
            content={getBrowserConfig("releaseStage")}
          />
          <meta name="revised" content={new Date().toUTCString()} />
          <meta name="version" content={getBrowserConfig("appVersion")} />
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
