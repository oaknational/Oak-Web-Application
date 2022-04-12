import { FC, useState } from "react";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";

import { AuthProvider } from "../auth/useAuth";
import "../styles/constants.css";
import "../styles/reset.css";
import "../styles/globals.css";
import { useApolloClient } from "../data-layer/graphql/apolloClient";
import useTheme from "../hooks/useTheme";
import { SearchContext, SearchTerm } from "../context/SearchContext";

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  useTheme();
  const [searchText, setSearchText] = useState("");
  const [keystage, setKeystage] = useState("");
  const searchTerm: SearchTerm = {
    text: searchText,
    setText: setSearchText,
    keystage,
    setKeystage,
  };

  const apolloClient = useApolloClient({});
  return (
    <>
      <AuthProvider>
        <ApolloProvider client={apolloClient}>
            <SearchContext.Provider value={searchTerm}>
              <Component {...pageProps} />
            </SearchContext.Provider>
        </ApolloProvider>
      </AuthProvider>
    </>
  );
};

export default MyApp;
