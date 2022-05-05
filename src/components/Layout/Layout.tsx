import Head from "next/head";
import { FC } from "react";

import SiteHeader from "../SiteHeader";
import SiteFooter from "../SiteFooter";
import { OrganizationJsonLd } from "../../browser-lib/seo/getJsonLd";
import config from "../../config";

import styles from "./Layout.module.css";

const Layout: FC = (props) => {
  const { children } = props;
  return (
    <>
      <Head>
        <title>{config.get("appName")}</title>
        <meta name={config.get("appDescription")} content="Education Tech" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OrganizationJsonLd />
      <SiteHeader />
      <main className={styles.main}>{children}</main>
      <SiteFooter />
    </>
  );
};

export default Layout;
