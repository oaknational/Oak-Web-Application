import Head from "next/head";
import React, { FC } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  OakBox,
  oakDefaultTheme,
  OakThemeProvider,
} from "@oaknational/oak-components";

import Seo, { SeoProps } from "@/browser-lib/seo/Seo";
import AppHeader from "@/components/AppComponents/AppHeader";
import LayoutSiteFooter from "@/components/AppComponents/LayoutSiteFooter";
import { OrganizationJsonLd } from "@/browser-lib/seo/getJsonLd";
import background, { BackgroundProps } from "@/styles/utils/background";
import { OakColorName } from "@/styles/theme";
import LayoutPreviewControls from "@/components/AppComponents/LayoutPreviewControls";
import LayoutClientErrorHeader from "@/components/AppComponents/LayoutClientErrorHeader";
import LayoutClientErrorFooter from "@/components/AppComponents/LayoutClientErrorFooter";
import LandingPagesHeader, {
  LayoutLandingPagesHeaderProps,
} from "@/components/AppComponents/LayoutLandingPagesHeader";
import { CTA } from "@/common-lib/cms-types";
import { Breadcrumb } from "@/components/SharedComponents/Breadcrumbs";
import SkipLink from "@/components/CurriculumComponents/OakComponentsKitchen/SkipLink";

const Container = styled.div<BackgroundProps>`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  ${background}
`;
const StyledLayout = styled.main`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
`;
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
  $background?: OakColorName;
  headerCta?: CTA | null;
  banner?: React.ReactNode;
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
  } = props;
  const Header = headers[headerVariant];
  const Footer = footers[footerVariant];
  const { isPreview } = useRouter();

  return (
    <>
      <OakThemeProvider theme={oakDefaultTheme}>
        <Seo {...seoProps} />
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <OrganizationJsonLd />
        <Container $background={$background}>
          <OakBox
            $position={"absolute"}
            $height={"all-spacing-13"}
            $width={"all-spacing-11"}
            $zIndex={"in-front"}
            $top={"all-spacing-14"}
            $left={"all-spacing-6"}
          >
            <SkipLink href="#main">Skip to content</SkipLink>
          </OakBox>
          {banner}
          <Header breadcrumbs={breadcrumbs} headerCta={props.headerCta} />
          <StyledLayout id="main">{children}</StyledLayout>
          <Footer />
          {isPreview && <LayoutPreviewControls />}
        </Container>
      </OakThemeProvider>
    </>
  );
};

export default Layout;
