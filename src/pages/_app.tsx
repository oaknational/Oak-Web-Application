import { FC } from "react";
import type { AppProps } from "next/app";

import theme from "../styles/themes";
import "../styles/constants.css";
import "../styles/reset.css";
import "../styles/globals.css";
import useTheme from "../hooks/useTheme";
import { SearchContext, SearchTerm } from "../context/SearchContext";

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  useTheme(theme);

  const searchTerm: SearchTerm = { text: "" };

  return (
    <>
      <SearchContext.Provider value={searchTerm}>
        <Component {...pageProps} />
      </SearchContext.Provider>
    </>
  );
};

export default MyApp;
