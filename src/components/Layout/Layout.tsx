import Head from "next/head";
import { FC } from "react";

import SiteHeader from "../SiteHeader";
import SiteFooter from "../SiteFooter";

import styles from "./Layout.module.css";

const Layout: FC = (props) => {
  const { children } = props;
  return (
    <>
      <Head>
        <title>Oak National Academy</title>
        <meta name="description" content="Education Tech" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SiteHeader />
      <main className={styles.main}>{children}</main>
      <SiteFooter />
    </>
  );
};

export default Layout;
