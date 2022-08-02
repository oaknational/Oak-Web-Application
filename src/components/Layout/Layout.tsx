import Head from "next/head";
import { FC } from "react";
import styled from "styled-components";

import AppHeader from "../AppHeader";
import SiteFooter from "../SiteFooter";
import { OrganizationJsonLd } from "../../browser-lib/seo/getJsonLd";
import Seo, { SeoProps } from "../../browser-lib/seo/Seo";
import background, { BackgroundProps } from "../../styles/utils/background";
import { OakColorName } from "../../styles/theme";
import footerSections from "../../browser-lib/fixtures/footerSectionLinks";
import SiteHeader from "../SiteHeader";

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

type HeaderVariant = "app" | "site";
const headers: Record<HeaderVariant, FC> = {
  app: AppHeader,
  site: SiteHeader,
};
interface LayoutProps {
  seoProps: SeoProps;
  headerVariant?: "app" | "site";
  $background?: OakColorName;
}

/** 1. Titles for SEO should be between 50-60 characters long 
    2. Title should contain app name
    3. SEO descriptions should be between 150-300 characters long */
const Layout: FC<LayoutProps> = (props) => {
  const { children, seoProps, $background, headerVariant = "site" } = props;

  const Header = headers[headerVariant];
  return (
    <>
      <Seo {...seoProps} />
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OrganizationJsonLd />
      <Container $background={$background}>
        <Header />
        <StyledLayout>{children}</StyledLayout>
        <SiteFooter footerSections={footerSections} />
      </Container>
    </>
  );
};

export default Layout;
