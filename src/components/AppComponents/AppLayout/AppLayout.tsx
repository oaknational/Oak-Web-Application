import Head from "next/head";
import React, { FC } from "react";
import { useRouter } from "next/router";
import { OakFlex, OakUiRoleToken } from "@oaknational/oak-components";

import TopNav, { TopNavProps } from "../TopNav/TopNav";
import TopNavMinimal from "../TopNav/TopNavMinimal";

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

export type AppVariant = "default" | "client-error";
const footers: Record<AppVariant, FC> = {
  default: LayoutSiteFooter,
  "client-error": LayoutClientErrorFooter,
};

export type AppLayoutProps = {
  children?: React.ReactNode;
  seoProps: SeoProps;
  breadcrumbs?: Breadcrumb[];
  $background?: OakUiRoleToken;
  headerCta?: CTA | null;
  banner?: React.ReactNode;
  topNavProps: TopNavProps;
  appVariant?: AppVariant;
};

const AppLayout: FC<AppLayoutProps> = (props) => {
  const {
    children,
    seoProps,
    $background,
    banner,
    topNavProps,
    appVariant = "default",
  } = props;
  const Footer = footers[appVariant];
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
        {appVariant === "client-error" ? (
          <TopNavMinimal />
        ) : (
          <TopNav {...topNavProps} />
        )}
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

export default AppLayout;
