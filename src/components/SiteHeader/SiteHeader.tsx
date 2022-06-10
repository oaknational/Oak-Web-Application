import { FC } from "react";
import Link from "next/link";
import styled from "styled-components";

import { useAuth } from "../../context/Auth";
import SearchForm from "../SearchForm";
import UnstyledButton from "../UnstyledButton/UnstyledButton";
import background, { BackgroundProps } from "../../styles/utils/background";
import { getBreakpoint } from "../../styles/utils/responsive";
import Flex, { FlexProps } from "../Flex";
import Icon from "../Icon";
import flex from "../../styles/utils/flex";
import { Span } from "../Typography/Typography";
import Menu from "../Menu";

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

const HeaderButton = styled(UnstyledButton)`
  padding-right: 24px;
  text-transform: capitalize;
`;

const HeaderButtonWrapper = styled.div`
  align-items: center;
  display: flex;
  margin-left: auto;
  font-weight: normal;
`;

const SiteHeader: FC = () => {
  const { user, signOut } = useAuth();

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
      <SearchForm />
      <HeaderButtonWrapper>
        {user ? (
          <HeaderButton onClick={signOut}>Sign out</HeaderButton>
        ) : (
          <Link href="/sign-in">Sign in</Link>
        )}
        <Menu>
          <span>I'm in a menu</span>
        </Menu>
      </HeaderButtonWrapper>
    </StyledSiteHeader>
  );
};

export default SiteHeader;
