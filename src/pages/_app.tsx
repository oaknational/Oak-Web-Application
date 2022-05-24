import { FC } from "react";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "styled-components";

import GlobalStyle from "../styles/GlobalStyle";
import { AuthProvider } from "../context/Auth";
import useApolloClient from "../browser-lib/graphql/useApolloClient";
import useTheme from "../hooks/useTheme";
import { UserStyleContextProvider } from "../context/UserStyleContext";
import { SearchProvider } from "../context/Search/SearchContext";
import ErrorBoundary from "../components/ErrorBoundary";
import { BookmarksProvider } from "../context/Bookmarks";
import DefaultSeo from "../browser-lib/seo/DefaultSeo";
import theme from "../styles/theme";

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  useTheme();
  const apolloClient = useApolloClient();

  return (
    <>
      <ErrorBoundary>
        <GlobalStyle />
        <AuthProvider>
          <ApolloProvider client={apolloClient}>
            <UserStyleContextProvider>
              <BookmarksProvider>
                <SearchProvider>
                  <ThemeProvider theme={theme}>
                    <DefaultSeo />
                    <Component {...pageProps} />
                  </ThemeProvider>
                </SearchProvider>
              </BookmarksProvider>
            </UserStyleContextProvider>
          </ApolloProvider>
        </AuthProvider>
      </ErrorBoundary>
    </>
  );
};

export default MyApp;
