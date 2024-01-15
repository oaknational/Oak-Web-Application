import Head from "next/head";
import React, { FC } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

import Seo, { SeoProps } from "@/browser-lib/seo/Seo";
import AppHeader from "@/components/AppComponents/AppHeader";
import SiteFooter from "@/components/SiteFooter";
import { OrganizationJsonLd } from "@/browser-lib/seo/getJsonLd";
import background, { BackgroundProps } from "@/styles/utils/background";
import { OakColorName } from "@/styles/theme";
import PreviewControls from "@/components/PreviewControls";
import LayoutClientErrorHeader from "@/components/SharedComponents/LayoutClientErrorHeader";
import LayoutClientErrorFooter from "@/components/SharedComponents/LayoutClientErrorFooter";
import LandingPagesHeader from "@/components/LandingPagesHeader";
import { CTA } from "@/common-lib/cms-types";
import { LandingPagesHeaderProps } from "@/components/LandingPagesHeader/LandingPagesHeader";
import { Breadcrumb } from "@/components/SharedComponents/Breadcrumbs";

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
  FC | FC<LandingPagesHeaderProps> | FC<HeaderProps>
> = {
  app: AppHeader,
  "landing-pages": LandingPagesHeader,
  "client-error": LayoutClientErrorHeader,
};

export type FooterVariant = "default" | "client-error";
const footers: Record<FooterVariant, FC> = {
  default: SiteFooter,
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
      <Seo {...seoProps} />
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OrganizationJsonLd />
      <Container $background={$background}>
        {banner}
        <Header breadcrumbs={breadcrumbs} headerCta={props.headerCta} />
        <StyledLayout>{children}</StyledLayout>
        <Footer />
        {isPreview && <PreviewControls />}
      </Container>
    </>
  );
};

export default Layout;
