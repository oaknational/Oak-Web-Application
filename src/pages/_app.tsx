import { FC } from "react";
import type { AppProps } from "next/app";

import { AuthProvider } from "../auth/useAuth";
import "../styles/constants.css";
import "../styles/reset.css";
import "../styles/globals.css";
import useTheme from "../hooks/useTheme";
import { SearchProvider } from "../context/SearchContext";

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  useTheme();

  return (
    <>
      <AuthProvider>
        <SearchProvider>
          <Component {...pageProps} />
        </SearchProvider>
      </AuthProvider>
    </>
  );
};

export default MyApp;
