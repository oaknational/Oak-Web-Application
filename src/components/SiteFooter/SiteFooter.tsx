import Link from "next/link";
import { FC } from "react";
import styled from "styled-components";
import Image from "next/image";

import getColorByName from "../../styles/themeHelpers/getColorByName";
import Flex from "../Flex";
import Typography, { Heading, P } from "../Typography";
import {
  FooterSection,
  FooterLink,
} from "../../browser-lib/fixtures/footerSectionLinks";
import IconButtonAsLink from "../Button/IconButtonAsLink";
import LogoText from "../../../public/images/oak-logo-text.svg";
import { getBreakpoint } from "../../styles/utils/responsive";

const StyledSiteFooter = styled.footer`
  background: ${getColorByName("white")};
  width: 100%;
  margin-top: 160px;
  padding-top: 80px;
  z-index: 0;
`;

const BackgroundImageContainer = styled.div`
  padding-bottom: 80px;

  ::before {
    z-index: -1;
    content: " ";
    position: absolute;
    width: 110%;
    height: 100%;
    background-image: url("images/pen/loop-down.svg");
    background-size: 50%;
    background-repeat: no-repeat;
    background-position: bottom right 20px;

    @media (max-width: ${getBreakpoint("medium")}px) {
      width: 97%;
      background-size: 80%;
      background-position: bottom right -100px;
    }

    @media (max-width: ${getBreakpoint("small")}px) {
      width: 97%;
      background-size: 160%;
      background-position: bottom right -56px;
    }
  }
`;

type SiteFooterProps = {
  footerSections: FooterSection[];
  footerNotification?: React.ReactNode;
};

const FooterSectionLinks: FC<FooterSection> = ({ title, links }) => {
  return (
    <Flex flexDirection="column">
      <Heading mb={8} lineHeight={20} fontSize={16} color="grey9" tag="h4">
        {title}
      </Heading>
      <Typography fontSize={12} lineHeight={20} color="grey9">
        <ul role={"list"}>
          {links?.map((footerLink: FooterLink) => (
            <li key={footerLink.text}>
              <Link href={footerLink.href}>{footerLink.text}</Link>
            </li>
          ))}
        </ul>
      </Typography>
    </Flex>
  );
};

const SiteFooter: FC<SiteFooterProps> = ({
  footerSections,
  footerNotification,
}) => {
  return (
    <StyledSiteFooter>
      <nav>
        <Flex
          position={"relative"}
          justifyContent={"center"}
          flexDirection={"column"}
          ph={12}
          maxWidth={1200}
          ma={"auto"}
        >
          <BackgroundImageContainer>
            <Flex flexWrap={["wrap"]}>
              <Flex mb={32} flexGrow={[1, 0]} mr={48} flexDirection="column">
                <Flex mb={16} flexDirection={"column"}>
                  <FooterSectionLinks
                    title={footerSections[0]?.title}
                    links={footerSections[0]?.links}
                  />
                </Flex>
                <Flex mb={16} flexDirection={"column"}>
                  <FooterSectionLinks
                    title={footerSections[1]?.title}
                    links={footerSections[1]?.links}
                  />
                </Flex>
              </Flex>

              <Flex
                flexGrow={[1, 0]}
                flexDirection="column"
                mb={[24, 0]}
                mr={48}
              >
                <FooterSectionLinks
                  title={footerSections[2]?.title}
                  links={footerSections[2]?.links}
                />
              </Flex>

              <Flex flexDirection="column">
                <FooterSectionLinks
                  title={footerSections[3]?.title}
                  links={footerSections[3]?.links}
                />
              </Flex>

              <Flex
                flexDirection={"column"}
                justifyContent={"space-between"}
                alignItems={"flex-end"}
                flexGrow={[0, 1]}
                pl={[32, 0]}
              >
                <Flex position="relative">
                  <Image
                    alt={"Oak National Academy Logo"}
                    height={63}
                    width={150}
                    src={LogoText}
                  ></Image>
                </Flex>

                {footerNotification}
              </Flex>
            </Flex>
            <Flex mt={32}>
              <Flex justifyContent={"center"}>
                <IconButtonAsLink
                  aria-label={"instagram"}
                  icon={"Instagram"}
                  href={"/instagram"}
                  variant={"minimal"}
                  size={"tiny"}
                  mr={24}
                />
                <IconButtonAsLink
                  aria-label={"facebook"}
                  icon={"Facebook"}
                  href={"/facebook"}
                  variant={"minimal"}
                  size={"tiny"}
                  mr={24}
                />
                <IconButtonAsLink
                  aria-label={"twitter"}
                  icon={"Twitter"}
                  href={"/twitter"}
                  variant={"minimal"}
                  size={"tiny"}
                  mr={24}
                />
              </Flex>
              <P fontSize={12}>© Oak National Academy</P>
            </Flex>
          </BackgroundImageContainer>
        </Flex>
      </nav>
    </StyledSiteFooter>
  );
};

export default SiteFooter;
