import Link from "next/link";
import { FC } from "react";
import styled from "styled-components";

import getColorByName from "../../styles/themeHelpers/getColorByName";
import Flex from "../Flex";
import Grid, { GridArea } from "../Grid";
import { Heading, P } from "../Typography";
import {
  FooterSection,
  FooterLink,
} from "../../browser-lib/fixtures/footerSectionLinks";
import IconButtonAsLink from "../Button/IconButtonAsLink";

const StyledSiteFooter = styled.footer`
  width: 100%;
  background: ${getColorByName("grey3")};
  margin: auto;
  margin-top: 80px;
`;

type SiteFooterProps = {
  footerSections: FooterSection[];
  footerNotification?: React.ReactNode;
};

const SiteFooter: FC<SiteFooterProps> = ({
  footerSections,
  footerNotification,
}) => {
  return (
    <StyledSiteFooter>
      <Flex
        justifyContent={"center"}
        flexDirection={"column"}
        pa={12}
        pt={40}
        maxWidth={1200}
        ma={"auto"}
      >
        <Grid>
          {footerSections.map((footerSection) => (
            <GridArea
              mb={[24, 0, 0]}
              key={footerSection.title}
              colSpan={[6, 3, 3]}
            >
              <Heading mb={12} fontSize={16} color="black" tag="h4">
                {footerSection.title}
              </Heading>
              {footerSection.links.map((footerLink: FooterLink) => (
                <P key={footerLink.text} color={"grey8"} fontSize={12}>
                  <Link href={footerLink.href}>{footerLink.text}</Link>
                </P>
              ))}
            </GridArea>
          ))}
        </Grid>
        <Flex ma={48} alignItems={"center"} justifyContent={"center"}>
          {footerNotification && footerNotification}
        </Flex>
        <Flex mb={40} justifyContent={"space-between"}>
          <Flex>
            <IconButtonAsLink
              aria-label={"instagram"}
              icon={"Instagram"}
              href={"/"}
              variant={"transparent"}
            />
            <IconButtonAsLink
              aria-label={"facebook"}
              icon={"Facebook"}
              href={"/"}
              variant={"transparent"}
            />
            <IconButtonAsLink
              aria-label={"twitter"}
              icon={"Twitter"}
              href={"/"}
              variant={"transparent"}
            />
          </Flex>
          <P mt={8} fontSize={12}>
            © Oak National Academy
          </P>
        </Flex>
      </Flex>
    </StyledSiteFooter>
  );
};

export default SiteFooter;
