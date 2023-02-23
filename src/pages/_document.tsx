import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import Script from "next/script";
import { ServerStyleSheet } from "styled-components";

import config from "../config/browser";

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
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link
            rel="manifest"
            href="/site.webmanifest"
            crossOrigin="use-credentials"
          />
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
          {/**
           * DEBUG
           *
           * This is strictly for testing with the company UXTweak and must
           * NOT be merged into main.
           */}
          <Script id="UXTweak-test" strategy="beforeInteractive">{`
<script type="text/javascript">(function(u,x,t,w,e,a,k,s){a=function(v){try{u.setItem(t+e,v)}catch(e){}v=JSON.parse(v);for(k=0;k<v.length;k++){s=x.createElement("script");s.text="(function(u,x,t,w,e,a,k){a=u[e]=function(){a.q.push(arguments)};a.q=[];a.t=+new Date;a.c=w;k=x.createElement('script');k.async=1;k.src=t;x.getElementsByTagName('head')[0].appendChild(k)})(window,document,'"+v[k].u+"',"+JSON.stringify(v[k].c)+",'"+v[k].g+"')";x.getElementsByTagName("head")[0].appendChild(s)}};try{k=u.getItem(t+e)}catch(e){}if(k){return a(k)}k=new XMLHttpRequest;k.onreadystatechange=function(){if(k.readyState==4&&k.status==200)a(k.responseText)};k.open("POST",w+e);k.send(x.URL)})(sessionStorage,document,"uxt:","https://api.uxtweak.com/snippet/","df95c105-9336-4898-af98-bc9a20589c87");</script>          `}</Script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
