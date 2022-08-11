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
import MaxWidth from "../MaxWidth/MaxWidth";

const StyledSiteFooter = styled.footer`
  background: ${getColorByName("white")};
  width: 100%;
  margin-top: 80px;
  z-index: 0;
`;

type SiteFooterProps = {
  footerSections: FooterSection[];
  footerNotification?: React.ReactNode;
};

const FooterSectionLinks: FC<FooterSection> = ({ title, links }) => {
  return (
    <Flex $flexDirection="column">
      <Heading
        $mb={8}
        $fontSize={16}
        $lineHeight="20px"
        $color="grey9"
        tag="h4"
        $fontFamily={"headingLight"}
      >
        {title}
      </Heading>
      <Typography $fontSize={12} $lineHeight={"20px"} color="grey9">
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
        <MaxWidth
          $position={"relative"}
          $justifyContent={"center"}
          $flexDirection={"column"}
          $ph={12}
          $ma={"auto"}
          $width={"100%"}
        >
          <Flex $width={"100%"} $flexWrap={["wrap"]}>
            <Flex $mb={32} $flexGrow={[1, 0]} $mr={48} $flexDirection="column">
              <Flex $mb={16} $flexDirection={"column"}>
                <FooterSectionLinks
                  title={footerSections[0]?.title}
                  links={footerSections[0]?.links}
                />
              </Flex>
              <Flex $mb={16} $flexDirection={"column"}>
                <FooterSectionLinks
                  title={footerSections[1]?.title}
                  links={footerSections[1]?.links}
                />
              </Flex>
            </Flex>

            <Flex
              $flexGrow={[1, 0]}
              $flexDirection="column"
              $mb={[24, 0]}
              $mr={48}
            >
              <FooterSectionLinks
                title={footerSections[2]?.title}
                links={footerSections[2]?.links}
              />
            </Flex>

            <Flex $flexDirection="column">
              <FooterSectionLinks
                title={footerSections[3]?.title}
                links={footerSections[3]?.links}
              />
            </Flex>

            <Flex
              $flexDirection={"column"}
              $justifyContent={"space-between"}
              $alignItems={"flex-end"}
              $flexGrow={[0, 1]}
              $pl={[32, 0]}
            >
              <Flex $position="relative">
                <Image
                  alt={"Oak National Academy Logo"}
                  height={66}
                  width={150}
                  src={LogoText}
                ></Image>
              </Flex>

              {footerNotification}
            </Flex>
          </Flex>
          <Flex $mb={80} $width={"100%"} $mt={32}>
            <Flex $alignItems={"center"} $justifyContent={"center"}>
              <IconButtonAsLink
                aria-label={"instagram"}
                icon={"Instagram"}
                href={"https://instagram.com/oaknational"}
                variant={"minimal"}
                $mr={16}
                size={"small"}
              />
              <IconButtonAsLink
                aria-label={"facebook"}
                icon={"Facebook"}
                href={"https://facebook.com/oaknationalacademy"}
                variant={"minimal"}
                $mr={16}
                size={"small"}
              />
              <IconButtonAsLink
                aria-label={"twitter"}
                icon={"Twitter"}
                href={"https://twitter.com/oaknational"}
                variant={"minimal"}
                $mr={[12, 32]}
                size={"small"}
              />
            </Flex>
            <Flex $alignItems={"center"}>
              <P $textAlign="center" fontSize={12}>
                © Oak National Academy
              </P>
            </Flex>
          </Flex>
        </MaxWidth>
      </nav>
    </StyledSiteFooter>
  );
};

export default SiteFooter;
