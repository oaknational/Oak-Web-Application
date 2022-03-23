import { FC } from "react";
import type { AppProps } from "next/app";

import { AuthProvider } from "../auth/useAuth";
import theme from "../styles/themes";
import "../styles/constants.css";
import "../styles/reset.css";
import "../styles/globals.css";
import useTheme from "../hooks/useTheme";

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  useTheme(theme);

  return (
    <>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
};

export default MyApp;
