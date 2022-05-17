import { FC } from "react";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";

import "../styles/constants.css";
import "../styles/reset.css";
import "../styles/globals.css";
import { AuthProvider } from "../context/Auth";
import useApolloClient from "../browser-lib/graphql/useApolloClient";
import useTheme from "../hooks/useTheme";
import { UserStyleContextProvider } from "../context/UserStyleContext";
import { SearchProvider } from "../context/SearchContext";
import ErrorBoundary from "../components/ErrorBoundary";
import { BookmarksProvider } from "../context/Bookmarks";
import DefaultSeo from "../browser-lib/seo/DefaultSeo";

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  useTheme();
  const apolloClient = useApolloClient();

  return (
    <>
      <ErrorBoundary>
        <AuthProvider>
          <ApolloProvider client={apolloClient}>
            <UserStyleContextProvider>
              <BookmarksProvider>
                <SearchProvider>
                  <DefaultSeo />
                  <Component {...pageProps} />
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
