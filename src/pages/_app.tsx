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
import { SearchProvider } from "../context/Search/SearchContext";
import ErrorBoundary from "../components/ErrorBoundary";
import DefaultSeo from "../browser-lib/seo/DefaultSeo";
import useOakTheme from "../hooks/useOakTheme";
import CookieConsentProvider from "../browser-lib/cookie-consent/CookieConsentProvider";
import AnalyticsProvider from "../context/Analytics/AnalyticsProvider";
import AppHooks from "../components/App/AppHooks";
import { MenuProvider } from "../context/Menu";

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const { theme } = useOakTheme();

  return (
    <>
      <GlobalStyle />
      <CookieConsentProvider>
        <ThemeProvider theme={theme}>
          <ErrorBoundary>
            <SSRProvider>
              <AnalyticsProvider>
                <SearchProvider>
                  <DefaultSeo />
                  <MenuProvider>
                    <Component {...pageProps} />
                  </MenuProvider>
                  <SpriteSheet />
                  <AppHooks />
                </SearchProvider>
              </AnalyticsProvider>
            </SSRProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </CookieConsentProvider>
    </>
  );
};

export default MyApp;
