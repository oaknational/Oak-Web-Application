import Head from "next/head";
import { FC } from "react";
import styled from "styled-components";
import Link from "next/link";

import SiteHeader from "../SiteHeader";
import SiteFooter from "../SiteFooter";
import { OrganizationJsonLd } from "../../browser-lib/seo/getJsonLd";
import Seo, { SeoProps } from "../../browser-lib/seo/Seo";
import background, { BackgroundProps } from "../../styles/utils/background";
import { OakColorName } from "../../styles/theme";
import footerSections from "../../browser-lib/fixtures/footerSectionLinks";
import Flex from "../Flex";
import IconButtonAsLink from "../Button/IconButtonAsLink";
import { Heading } from "../Typography";

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

interface LayoutProps {
  seoProps: SeoProps;
  $background?: OakColorName;
}

/** 1. Titles for SEO should be between 50-60 characters long 
    2. Title should contain app name
    3. SEO descriptions should be between 150-300 characters long */
const LandingPageLayout: FC<LayoutProps> = (props) => {
  const { children, seoProps, $background } = props;
  return (
    <>
      <Seo {...seoProps} />
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OrganizationJsonLd />
      <Container $background={$background}>
        <SiteHeader />
        <StyledLayout>{children}</StyledLayout>
        <SiteFooter
          footerSections={footerSections}
          footerNotification={
            <Flex justifyContent={"center"} alignItems={"center"}>
              <IconButtonAsLink
                icon={"Rocket"}
                aria-label={"Join new beta oak"}
                href={"/beta/onboarding"}
                size={"tiny"}
                mr={12}
                variant={"primary"}
              />
              <Heading tag="h5" fontSize={16}>
                <Link href={"/beta/onboarding"}>Join Beta</Link>
              </Heading>
            </Flex>
          }
        />
      </Container>
    </>
  );
};

export default LandingPageLayout;
