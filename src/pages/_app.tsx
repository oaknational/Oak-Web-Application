import { FC } from "react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { SSRProvider } from "@react-aria/ssr";

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
import { SearchProvider } from "../context/Search/SearchContext";
import { ToastProvider } from "../context/Toast";
import { BreadcrumbProvider } from "../context/Breadcrumb";

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
              <AnalyticsProvider {...analyticsOptions}>
                <DefaultSeo />
                <SearchProvider>
                  <MenuProvider>
                    <ToastProvider>
                      <BreadcrumbProvider>
                        <Component {...pageProps} />
                      </BreadcrumbProvider>
                      <AppHooks />
                    </ToastProvider>
                  </MenuProvider>
                </SearchProvider>
              </AnalyticsProvider>
            </SSRProvider>
          </ErrorBoundary>
          <SpriteSheet />
        </ThemeProvider>
      </CookieConsentProvider>
    </>
  );
};

export default OakWebApplication;
