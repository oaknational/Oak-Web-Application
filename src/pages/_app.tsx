import { FC } from "react";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";

import { AuthProvider } from "../auth/useAuth";
import "../styles/constants.css";
import "../styles/reset.css";
import "../styles/globals.css";
import useApolloClient from "../browser-lib/graphql/useApolloClient";
import useTheme from "../hooks/useTheme";
import { UserStyleContextProvider } from "../context/UserStyleContext";
import ErrorBoundary from "../components/ErrorBoundary";
import { BookmarksProvider } from "../hooks/useBookmarks";

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
                <Component {...pageProps} />
              </BookmarksProvider>
            </UserStyleContextProvider>
          </ApolloProvider>
        </AuthProvider>
      </ErrorBoundary>
    </>
  );
};

export default MyApp;
