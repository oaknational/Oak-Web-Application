import { FC } from "react";
import styled from "styled-components";

import {
  StyledHeader,
  HeaderProps,
  baseHeaderStyles,
} from "@/components/AppComponents/StyledHeader";

const HeaderWrapper = styled.div`
  width: 100%;
`;

const HeadingSpacer = styled.div`
  ${baseHeaderStyles}
`;

const LayoutFixedHeader: FC<HeaderProps> = ({ children, $background }) => (
  <HeaderWrapper>
    <StyledHeader
      as="header"
      $background={$background}
      $justifyContent={["space-between"]}
      $alignItems={["center"]}
      $zIndex="fixed-header"
      $position="fixed"
    >
      {children}
    </StyledHeader>
    <HeadingSpacer />
  </HeaderWrapper>
);

export default LayoutFixedHeader;
