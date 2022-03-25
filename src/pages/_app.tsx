import { FC } from "react";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";

import theme from "../styles/themes";
import "../styles/constants.css";
import "../styles/reset.css";
import "../styles/globals.css";
import { useApolloClient } from "../data-layer/graphql/apolloClient";
import useTheme from "../hooks/useTheme";

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  useTheme(theme);
  const apolloClient = useApolloClient({});

  return (
    <>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  );
};

export default MyApp;
