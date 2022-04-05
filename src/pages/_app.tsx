import { FC } from "react";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";

import { AuthProvider } from "../auth/useAuth";
import "../styles/constants.css";
import "../styles/reset.css";
import "../styles/globals.css";
import { useApolloClient } from "../data-layer/graphql/apolloClient";
import useTheme from "../hooks/useTheme";
import { UserStyleContextProvider } from "../context/UserStyleContext";

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  useTheme();
  const apolloClient = useApolloClient({});

  return (
    <>
      <AuthProvider>
        <ApolloProvider client={apolloClient}>
          <UserStyleContextProvider>
            <Component {...pageProps} />
          </UserStyleContextProvider>
        </ApolloProvider>
      </AuthProvider>
    </>
  );
};

export default MyApp;
