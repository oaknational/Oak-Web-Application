import { FC } from "react";
import Link from "next/link";
import styled from "styled-components";

import { useUserStyleContext } from "../../context/UserStyleContext";
import { useAuth } from "../../context/Auth";
import SearchForm from "../SearchForm";
import UnstyledButton from "../UnstyledButton/UnstyledButton";
import background, { BackgroundProps } from "../../styles/utils/background";

const StyledSiteHeader = styled.header<BackgroundProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 72px;
  padding: 12px;
  ${background}

  @media (min-width: 900px) {
    flex-direction: row;
    align-items: center;
  }
`;

const Title = styled.div`
  margin-right: 12px;
`;

const HeaderButton = styled(UnstyledButton)`
  padding-right: 24px;
  text-transform: capitalize;
`;

const HeaderButtonWrapper = styled.div`
  margin-left: auto;
  font-weight: normal;
`;

const SiteHeader: FC = () => {
  const { user, signOut } = useAuth();
  const userStyleContext = useUserStyleContext();

  const handleClick = () => {
    userStyleContext.user === "teachers"
      ? userStyleContext.setUser("pupils")
      : userStyleContext.setUser("teachers");
  };

  return (
    <StyledSiteHeader background="grey3">
      <Title>Oak</Title>
      <SearchForm />
      <HeaderButtonWrapper>
        <HeaderButton onClick={handleClick}>
          {userStyleContext.user}
        </HeaderButton>
        {user ? (
          <HeaderButton onClick={signOut}>Sign out</HeaderButton>
        ) : (
          <Link href="/sign-in">Sign in</Link>
        )}
      </HeaderButtonWrapper>
    </StyledSiteHeader>
  );
};

export default SiteHeader;
