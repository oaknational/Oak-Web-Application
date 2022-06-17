import { FC } from "react";
import Link from "next/link";
import styled from "styled-components";

import background, { BackgroundProps } from "../../styles/utils/background";
import { getBreakpoint } from "../../styles/utils/responsive";
import Flex, { FlexProps } from "../Flex";
import Icon from "../Icon";
import flex from "../../styles/utils/flex";
import { Span } from "../Typography";

const StyledSiteHeader = styled.header<BackgroundProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 72px;
  padding: 12px;
  ${background}

  @media (min-width: ${getBreakpoint("medium")}px) {
    flex-direction: row;
    align-items: center;
  }
`;

const HomeLink = styled.a<FlexProps>`
  ${flex}
`;

const SiteHeader: FC = () => {
  return (
    <StyledSiteHeader background="grey3">
      <Flex mr={40}>
        <Link href={"/"} passHref>
          <HomeLink alignItems="center">
            <Icon name="Home" size={30} mr={8} />
            <Span
              fontFamily="heading"
              fontWeight={600}
              fontSize={20}
              lineHeight={1}
            >
              Oak
            </Span>
          </HomeLink>
        </Link>
      </Flex>
    </StyledSiteHeader>
  );
};

export default SiteHeader;
