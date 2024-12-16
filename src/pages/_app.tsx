import { FC } from "react";
import type { AppProps } from "next/app";
import { Lexend } from "next/font/google";
import { ThemeProvider } from "styled-components";
import { OverlayProvider } from "react-aria";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { ClerkProvider } from "@clerk/nextjs";

/**
 * Custom global styles (which should be kept to a minimum) must all be imported in _app.tsx
 */

import "@/browser-lib/gleap/gleap.css";
import "@/browser-lib/oak-globals/oakGlobals";
import GlobalStyle from "@/styles/GlobalStyle";
import SpriteSheet from "@/components/SharedComponents/SpriteSheet";
import ErrorBoundary from "@/components/AppComponents/ErrorBoundary";
import DefaultSeo from "@/browser-lib/seo/DefaultSeo";
import useOakTheme from "@/hooks/useOakTheme";
import CookieConsentProvider from "@/browser-lib/cookie-consent/CookieConsentProvider";
import AnalyticsProvider, {
  AnalyticsProviderProps,
} from "@/context/Analytics/AnalyticsProvider";
import { MenuProvider } from "@/context/Menu";
import { ToastProvider } from "@/context/Toast";
import AppHooks from "@/components/AppComponents/App/AppHooks";

const lexend = Lexend({ subsets: ["latin"] });

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
      <GlobalStyle fontFamily={lexend.style.fontFamily} />
      <ClerkProvider
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        afterSignOutUrl="/"
      >
        <CookieConsentProvider>
          <ThemeProvider theme={theme}>
            <ErrorBoundary>
              <PostHogProvider client={posthog}>
                <AnalyticsProvider {...analyticsOptions}>
                  <DefaultSeo />
                  <OverlayProvider>
                    <MenuProvider>
                      <ToastProvider>
                        <>
                          <style jsx global>{`
                            html {
                              font-family: ${lexend.style.fontFamily};
                            }
                          `}</style>
                        </>
                        <Component {...pageProps} />
                        <AppHooks />
                      </ToastProvider>
                    </MenuProvider>
                  </OverlayProvider>
                </AnalyticsProvider>
              </PostHogProvider>
            </ErrorBoundary>
            <SpriteSheet />
          </ThemeProvider>
        </CookieConsentProvider>
      </ClerkProvider>
    </>
  );
};

export default OakWebApplication;
