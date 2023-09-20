import { FC } from "react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { SSRProvider } from "@react-aria/ssr";
import { OverlayProvider } from "react-aria";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { MathJaxContext } from "better-react-mathjax";

/**
 * Custom global styles (which should be kept to a minimum) must all be imported in _app.tsx
 */
import "../browser-lib/gleap/gleap.css";
import "../browser-lib/oak-globals/oakGlobals";
import GlobalStyle from "../styles/GlobalStyle";
import SpriteSheet from "../components/SpriteSheet";
import ErrorBoundary from "../components/ErrorBoundary";
import DefaultSeo from "../browser-lib/seo/DefaultSeo";
import useOakTheme from "../hooks/useOakTheme";
import CookieConsentProvider from "../browser-lib/cookie-consent/CookieConsentProvider";
import AnalyticsProvider, {
  AnalyticsProviderProps,
} from "../context/Analytics/AnalyticsProvider";
import AppHooks from "../components/App/AppHooks";
import { MenuProvider } from "../context/Menu";
import { ToastProvider } from "../context/Toast";
import InlineSpriteSheet from "../components/InlineSpriteSheet";

type OakWebApplicationProps = AppProps & {
  analyticsOptions: AnalyticsProviderProps;
};
const OakWebApplication: FC<OakWebApplicationProps> = ({
  Component,
  pageProps,
  analyticsOptions,
}) => {
  const { theme } = useOakTheme();

  return (
    <>
      <GlobalStyle />
      <CookieConsentProvider>
        <ThemeProvider theme={theme}>
          <ErrorBoundary>
            <SSRProvider>
              <PostHogProvider client={posthog}>
                <AnalyticsProvider {...analyticsOptions}>
                  <DefaultSeo />
                  <OverlayProvider>
                    <MenuProvider>
                      <ToastProvider>
                        <MathJaxContext>
                          <Component {...pageProps} />
                        </MathJaxContext>
                        <AppHooks />
                      </ToastProvider>
                    </MenuProvider>
                  </OverlayProvider>
                </AnalyticsProvider>
              </PostHogProvider>
            </SSRProvider>
          </ErrorBoundary>
          <SpriteSheet />
          <InlineSpriteSheet />
        </ThemeProvider>
      </CookieConsentProvider>
    </>
  );
};

export default OakWebApplication;
