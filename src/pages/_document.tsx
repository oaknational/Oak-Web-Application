import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import { ServerStyleSheet } from "styled-components";
import parse from "html-react-parser";

import { FAVICON_LINKS_HEAD_INNER_HTML } from "../image-data";
import getBrowserConfig from "../browser-lib/getBrowserConfig";
import { generateNonce } from "../lib/csp/generateNonce";

interface MyDocumentProps extends DocumentInitialProps {
  nonce?: string;
}

class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    // Generate nonce for CSP
    const nonce = generateNonce();

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      // Add nonce to response headers if not already set
      if (ctx.res && !ctx.res.headersSent) {
        const existingCSP = ctx.res.getHeader("Content-Security-Policy");
        if (!existingCSP) {
          // CSP will be set by middleware, but we store nonce for use in render
          ctx.res.setHeader("X-CSP-Nonce", nonce);
        }
      }

      return {
        ...initialProps,
        nonce,
        styles: (
          <>
            {initialProps.styles}
            {/* Apply nonce to styled-components style tags */}
            {sheet.getStyleElement().map((element, index) =>
              element
                ? {
                    ...element,
                    props: { ...element.props, nonce, key: index },
                  }
                : null,
            )}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    const { nonce } = this.props;

    return (
      <Html lang="en-GB">
        <Head nonce={nonce}>
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
          <NextScript nonce={nonce} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
