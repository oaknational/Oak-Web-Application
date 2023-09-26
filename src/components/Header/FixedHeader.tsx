import { FC } from "react";
import styled from "styled-components";

import { StyledHeader, HeaderProps, baseHeaderStyles } from "./StyledHeader";

const HeaderWrapper = styled.div`
  width: 100%;
`;

const HeadingSpacer = styled.div`
  ${baseHeaderStyles}
`;

const FixedHeader: FC<HeaderProps> = ({ children, $background }) => (
  <HeaderWrapper>
    <StyledHeader
      as="header"
      $background={$background}
      $justifyContent={["space-between"]}
      $alignItems={["center"]}
      $zIndex="fixedHeader"
      $position="fixed"
    >
      {children}
    </StyledHeader>
    <HeadingSpacer />
  </HeaderWrapper>
);

export default FixedHeader;
