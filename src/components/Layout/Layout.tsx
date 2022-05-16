import Head from "next/head";
import { FC } from "react";

import SiteHeader from "../SiteHeader";
import SiteFooter from "../SiteFooter";
import { OrganizationJsonLd } from "../../browser-lib/seo/getJsonLd";
import Seo, { SeoProps } from "../../browser-lib/seo/Seo";

import styles from "./Layout.module.css";

interface LayoutProps {
  seoProps: SeoProps;
}

/** 1. Titles for SEO should be between 50-60 characters long 
    2. Title should contain app name
    3. SEO descriptions should be between 150-300 characters long */
const Layout: FC<LayoutProps> = (props) => {
  const { children, seoProps } = props;
  return (
    <>
      <Seo {...seoProps} />
      <Head>
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
