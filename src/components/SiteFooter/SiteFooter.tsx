import Link from "next/link";
import { FC } from "react";
import styled from "styled-components";

import getColorByName from "../../styles/themeHelpers/getColorByName";
import Flex from "../Flex";
import Grid, { GridArea } from "../Grid";
import Typography, { Heading, P } from "../Typography";
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
        <Typography fontSize={12} lineHeight={20} color="grey8">
          <nav>
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
                  <ul role={"list"}>
                    {footerSection.links.map((footerLink: FooterLink) => (
                      <li key={footerLink.text}>
                        <Link href={footerLink.href}>{footerLink.text}</Link>
                      </li>
                    ))}
                  </ul>
                </GridArea>
              ))}
            </Grid>
          </nav>
        </Typography>
        <Flex ma={48} alignItems={"center"} justifyContent={"center"}>
          {footerNotification}
        </Flex>
        <Flex mb={40} justifyContent={"space-between"}>
          <Flex>
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
          <P mt={8} fontSize={12}>
            © Oak National Academy
          </P>
        </Flex>
      </Flex>
    </StyledSiteFooter>
  );
};

export default SiteFooter;
