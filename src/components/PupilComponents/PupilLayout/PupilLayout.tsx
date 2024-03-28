import Head from "next/head";
import { FC } from "react";

import Seo, { SeoProps } from "@/browser-lib/seo/Seo";

export type PupilLayoutProps = {
  children?: React.ReactNode;
  seoProps: SeoProps;
};

/**
 * Layout for pupil pages. Simplified in comparison to the AppLayout as we don't include headers and footers.
 */

export const PupilLayout: FC<PupilLayoutProps> = (props) => {
  const { seoProps, children } = props;

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Seo {...seoProps} />
      {children}
    </>
  );
};
