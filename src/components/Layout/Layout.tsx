import Head from "next/head";
import { FC } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

import AppHeader from "../AppHeader";
import SiteFooter from "../SiteFooter";
import { OrganizationJsonLd } from "../../browser-lib/seo/getJsonLd";
import Seo, { SeoProps } from "../../browser-lib/seo/Seo";
import background, { BackgroundProps } from "../../styles/utils/background";
import { OakColorName } from "../../styles/theme";
import SiteHeader from "../SiteHeader";
import PreviewControls from "../PreviewControls";
import ClientErrorHeader from "../ClientErrorHeader";
import ClientErrorFooter from "../ClientErrorFooter";
import LandingPagesHeader from "../LandingPagesHeader";
import { CTA } from "../../node-lib/cms";
import { LandingPagesHeaderProps } from "../LandingPagesHeader/LandingPagesHeader";

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

export type HeaderVariant = "app" | "site" | "landingPages" | "client-error";
const headers: Record<HeaderVariant, FC | FC<LandingPagesHeaderProps>> = {
  app: AppHeader,
  site: SiteHeader,
  landingPages: LandingPagesHeader,
  "client-error": ClientErrorHeader,
};
export type FooterVariant = "default" | "client-error";
const footers: Record<FooterVariant, FC> = {
  default: SiteFooter,
  "client-error": ClientErrorFooter,
};

export type LayoutProps = {
  seoProps: SeoProps;
  headerVariant?: HeaderVariant;
  footerVariant?: FooterVariant;
  $background?: OakColorName;
  headerCta?: CTA | null;
};

const Layout: FC<LayoutProps> = (props) => {
  const {
    children,
    seoProps,
    $background,
    headerVariant = "site",
    footerVariant = "default",
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
        <Header headerCta={props.headerCta} />
        <StyledLayout>{children}</StyledLayout>

        <Footer />
        {isPreview && <PreviewControls />}
      </Container>
    </>
  );
};

export default Layout;
