import { FC, useState } from "react";
import type { AppProps } from "next/app";

import { AuthProvider } from "../auth/useAuth";
import "../styles/constants.css";
import "../styles/reset.css";
import "../styles/globals.css";
import useTheme from "../hooks/useTheme";
import { searchContext, SearchTerm } from "../context/SearchContext";

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  useTheme();
  const [searchText, setSearchText] = useState("");
  const [keystage, setKeystage] = useState(new Set<string>());
  const searchTerm: SearchTerm = {
    text: searchText,
    setText: setSearchText,
    keystage,
    setKeystage,
  };

  return (
    <>
      <AuthProvider>
        <searchContext.Provider value={searchTerm}>
          <Component {...pageProps} />
        </searchContext.Provider>
      </AuthProvider>
    </>
  );
};

export default MyApp;
