import Head from "next/head";
import React, { FC } from "react";
import { useRouter } from "next/router";
import {
  OakBox,
  OakFlex,
  oakDefaultTheme,
  OakThemeProvider,
  OakUiRoleToken,
} from "@oaknational/oak-components";
import { useFeatureFlagEnabled } from "posthog-js/react";

import TopNav, { TopNavProps } from "../TopNav/TopNav";

import Seo, { SeoProps } from "@/browser-lib/seo/Seo";
import AppHeader from "@/components/AppComponents/AppHeader";
import LayoutSiteFooter from "@/components/AppComponents/LayoutSiteFooter";
import { OrganizationJsonLd } from "@/browser-lib/seo/getJsonLd";
import LayoutPreviewControls from "@/components/AppComponents/LayoutPreviewControls";
import LayoutClientErrorHeader from "@/components/AppComponents/LayoutClientErrorHeader";
import LayoutClientErrorFooter from "@/components/AppComponents/LayoutClientErrorFooter";
import LandingPagesHeader, {
  LayoutLandingPagesHeaderProps,
} from "@/components/AppComponents/LayoutLandingPagesHeader";
import { CTA } from "@/common-lib/cms-types";
import { Breadcrumb } from "@/components/SharedComponents/Breadcrumbs";
import SkipLink from "@/components/CurriculumComponents/OakComponentsKitchen/SkipLink";

export type HeaderProps = {
  children?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
};

export type HeaderVariant = "app" | "landing-pages" | "client-error";
const headers: Record<
  HeaderVariant,
  FC | FC<LayoutLandingPagesHeaderProps> | FC<HeaderProps>
> = {
  app: AppHeader,
  "landing-pages": LandingPagesHeader,
  "client-error": LayoutClientErrorHeader,
};

export type FooterVariant = "default" | "client-error";
const footers: Record<FooterVariant, FC> = {
  default: LayoutSiteFooter,
  "client-error": LayoutClientErrorFooter,
};

export type LayoutProps = {
  children?: React.ReactNode;
  seoProps: SeoProps;
  headerVariant?: HeaderVariant;
  footerVariant?: FooterVariant;
  breadcrumbs?: Breadcrumb[];
  $background?: OakUiRoleToken;
  headerCta?: CTA | null;
  banner?: React.ReactNode;
  skipLinkHref?: string;
  topNavProps: TopNavProps;
};

const Layout: FC<LayoutProps> = (props) => {
  const {
    children,
    seoProps,
    $background,
    breadcrumbs,
    headerVariant = "app",
    footerVariant = "default",
    banner,
    topNavProps,
  } = props;
  const newTopNavEnabled = useFeatureFlagEnabled("teachers-new-top-nav");

  const Header = headers[headerVariant];
  const Footer = footers[footerVariant];
  const { isPreview } = useRouter();

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <Seo {...seoProps} />
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OrganizationJsonLd />
      <OakFlex $flexDirection="column" $flexGrow={1} $background={$background}>
        <OakBox
          $position={"absolute"}
          $height={"spacing-80"}
          $width={"spacing-64"}
          $zIndex={"in-front"}
          $top={"spacing-92"}
          $left={"spacing-24"}
          $display={newTopNavEnabled ? "none" : "block"}
        >
          <SkipLink href={props.skipLinkHref ?? "#main"}>
            Skip to content
          </SkipLink>
        </OakBox>
        {banner}
        {newTopNavEnabled ? (
          <TopNav {...topNavProps} />
        ) : (
          <Header breadcrumbs={breadcrumbs} headerCta={props.headerCta} />
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
    </OakThemeProvider>
  );
};

export default Layout;
