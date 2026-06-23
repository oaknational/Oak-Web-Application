import Head from "next/head";
import React, { FC } from "react";
import { useRouter } from "next/router";
import { OakFlex, OakUiRoleToken } from "@oaknational/oak-components";

import TopNav, { TopNavProps } from "../TopNav/TopNav";

import Seo, { SeoProps } from "@/browser-lib/seo/Seo";
import LayoutSiteFooter from "@/components/AppComponents/LayoutSiteFooter";
import { OrganizationJsonLd } from "@/browser-lib/seo/getJsonLd";
import LayoutPreviewControls from "@/components/AppComponents/LayoutPreviewControls";
import LayoutClientErrorFooter from "@/components/AppComponents/LayoutClientErrorFooter";
import { CTA } from "@/common-lib/cms-types";
import { Breadcrumb } from "@/components/SharedComponents/Breadcrumbs";

export type HeaderProps = {
  children?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
};

export type FooterVariant = "default" | "client-error";
const footers: Record<FooterVariant, FC> = {
  default: LayoutSiteFooter,
  "client-error": LayoutClientErrorFooter,
};

export type LayoutProps = {
  children?: React.ReactNode;
  seoProps: SeoProps;
  footerVariant?: FooterVariant;
  breadcrumbs?: Breadcrumb[];
  $background?: OakUiRoleToken;
  headerCta?: CTA | null;
  banner?: React.ReactNode;
  topNavProps: TopNavProps;
};

const Layout: FC<LayoutProps> = (props) => {
  const {
    children,
    seoProps,
    $background,
    footerVariant = "default",
    banner,
    topNavProps,
  } = props;
  const Footer = footers[footerVariant];
  const { isPreview } = useRouter();

  return (
    <>
      <Seo {...seoProps} />
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OrganizationJsonLd />
      <OakFlex $flexDirection="column" $flexGrow={1} $background={$background}>
        {banner}
        <TopNav {...topNavProps} />
        <OakFlex
          $flexDirection="column"
          $flexGrow={1}
          $width="100%"
          as="main"
          id="main"
        >
          {children}
        </OakFlex>
        <Footer />
        {isPreview && <LayoutPreviewControls />}
      </OakFlex>
    </>
  );
};

export default Layout;
