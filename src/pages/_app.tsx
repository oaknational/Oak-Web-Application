import { FC } from "react";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "styled-components";
import { SSRProvider } from "@react-aria/ssr";

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
    <SSRProvider>
      <ErrorBoundary>
        <GlobalStyle />
        <CookieConsentProvider>
          <AuthProvider>
            <ApolloProvider client={apolloClient}>
              <BookmarksProvider>
                <SearchProvider>
                  <ThemeProvider theme={theme}>
                    <DefaultSeo />
                    <Component {...pageProps} />
                  </ThemeProvider>
                </SearchProvider>
              </BookmarksProvider>
            </ApolloProvider>
          </AuthProvider>
        </CookieConsentProvider>
      </ErrorBoundary>
    </SSRProvider>
  );
};

export default MyApp;
