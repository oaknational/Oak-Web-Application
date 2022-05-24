import Head from "next/head";
import { FC } from "react";
import styled from "styled-components";

import SiteHeader from "../SiteHeader";
import SiteFooter from "../SiteFooter";
import { OrganizationJsonLd } from "../../browser-lib/seo/getJsonLd";
import Seo, { SeoProps } from "../../browser-lib/seo/Seo";
import background, { BackgroundProps } from "../../styles/utils/background";
import { OakColorName } from "../../styles/theme";

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
  padding: 24px 12px;
  max-width: 1200px;
  width: 100%;
  align-self: center;
`;

interface LayoutProps {
  seoProps: SeoProps;
  background?: OakColorName;
}

/** 1. Titles for SEO should be between 50-60 characters long 
    2. Title should contain app name
    3. SEO descriptions should be between 150-300 characters long */
const Layout: FC<LayoutProps> = (props) => {
  const { children, seoProps, background } = props;
  return (
    <>
      <Seo {...seoProps} />
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OrganizationJsonLd />
      <Container background={background}>
        <SiteHeader />
        <StyledLayout>{children}</StyledLayout>
        <SiteFooter />
      </Container>
    </>
  );
};

export default Layout;
