import { FC } from "react";
import Link from "next/link";
import styled, { css } from "styled-components";

import SearchForm from "../SearchForm";
import background, { BackgroundProps } from "../../styles/utils/background";
import { getBreakpoint } from "../../styles/utils/responsive";
import Flex, { FlexProps } from "../Flex";
import Icon from "../Icon";
import flex from "../../styles/utils/flex";
import { Span } from "../Typography";
import Menu from "../Menu";

const baseHeaderStyles = css`
  width: 100%;
  min-height: 72px;
`;

const HeadingSpacer = styled.div`
  ${baseHeaderStyles}
`;

const StyledAppHeader = styled.header<BackgroundProps>`
  ${baseHeaderStyles}
  display: flex;
  flex-direction: column;
  padding: 12px;
  position: fixed;
  ${background}

  @media (min-width: ${getBreakpoint("medium")}px) {
    flex-direction: row;
    align-items: center;
  }
`;

const HomeLink = styled.a<FlexProps>`
  ${flex}
`;

/**
 * Header for logging in and using search -
 * header for the app, not a landing page
 *
 */
const AppHeader: FC = () => {
  return (
    <div>
      <StyledAppHeader background="grey3">
        <Flex mr={40}>
          <Link href={"/"} passHref>
            <HomeLink alignItems="center">
              <Icon name="Home" size={32} mr={8} />
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
        <SearchForm />
        <Menu>
          <p>Hello joe</p>
        </Menu>
      </StyledAppHeader>
      <HeadingSpacer />
    </div>
  );
};

export default AppHeader;
