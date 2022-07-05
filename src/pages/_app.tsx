import { FC } from "react";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "styled-components";
import { OverlayProvider } from "@react-aria/overlays";

import GlobalStyle from "../styles/GlobalStyle";
import { AuthProvider } from "../context/Auth";
import useApolloClient from "../browser-lib/graphql/useApolloClient";
import { SearchProvider } from "../context/Search/SearchContext";
import ErrorBoundary from "../components/ErrorBoundary";
import { BookmarksProvider } from "../context/Bookmarks";
import DefaultSeo from "../browser-lib/seo/DefaultSeo";
import useOakTheme from "../hooks/useOakTheme";
import CookieConsentProvider from "../browser-lib/cookie-consent/CookieConsentProvider";

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const apolloClient = useApolloClient();
  const { theme } = useOakTheme();

  return (
    <>
      <ErrorBoundary>
        <GlobalStyle />
        <AuthProvider>
          <ApolloProvider client={apolloClient}>
            <BookmarksProvider>
              <SearchProvider>
                <ThemeProvider theme={theme}>
                  <OverlayProvider>
                    <CookieConsentProvider>
                      <DefaultSeo />
                      <Component {...pageProps} />
                    </CookieConsentProvider>
                  </OverlayProvider>
                </ThemeProvider>
              </SearchProvider>
            </BookmarksProvider>
          </ApolloProvider>
        </AuthProvider>
      </ErrorBoundary>
    </>
  );
};

export default MyApp;
