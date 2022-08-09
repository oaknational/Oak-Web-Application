import { FC } from "react";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "styled-components";
import { SSRProvider } from "@react-aria/ssr";

/**
 * Custom global styles (which should be kept to a minimum) must all be imported in _app.tsx
 */
import "../browser-lib/gleap/gleap.css";
import "../browser-lib/oak-globals/oakGlobals";
import GlobalStyle from "../styles/GlobalStyle";
import SpriteSheet from "../components/SpriteSheet";
import { AuthProvider } from "../context/Auth";
import useApolloClient from "../browser-lib/graphql/useApolloClient";
import { SearchProvider } from "../context/Search/SearchContext";
import ErrorBoundary from "../components/ErrorBoundary";
import { BookmarksProvider } from "../context/Bookmarks";
import DefaultSeo from "../browser-lib/seo/DefaultSeo";
import useOakTheme from "../hooks/useOakTheme";
import CookieConsentProvider from "../browser-lib/cookie-consent/CookieConsentProvider";
import AnalyticsProvider from "../context/Analytics/AnalyticsProvider";
import AppHooks from "../components/App/AppHooks";

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const apolloClient = useApolloClient();
  const { theme } = useOakTheme();

  return (
    <>
      <GlobalStyle />
      <CookieConsentProvider>
        <ThemeProvider theme={theme}>
          <ErrorBoundary>
            <SSRProvider>
              <AnalyticsProvider>
                <AuthProvider>
                  <ApolloProvider client={apolloClient}>
                    <BookmarksProvider>
                      <SearchProvider>
                        <DefaultSeo />
                        <Component {...pageProps} />
                        <SpriteSheet />
                        <AppHooks />
                      </SearchProvider>
                    </BookmarksProvider>
                  </ApolloProvider>
                </AuthProvider>
              </AnalyticsProvider>
            </SSRProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </CookieConsentProvider>
    </>
  );
};

export default MyApp;
