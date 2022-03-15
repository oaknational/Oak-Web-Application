import { FC } from "react";
import type { AppProps } from "next/app";

import theme from "../styles/themes";
import "../styles/constants.css";
import "../styles/reset.css";
import "../styles/globals.css";
import useTheme from "../hooks/useTheme";

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  useTheme(theme);

  return (
    <>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
