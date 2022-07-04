import { FC } from "react";
import styled, { css } from "styled-components";

import background, { BackgroundProps } from "../../styles/utils/background";
import { getBreakpoint } from "../../styles/utils/responsive";
import { FlexProps } from "../Flex";

const baseHeaderStyles = css`
  width: 100%; /* Do we need a max width here and to center? */
  min-height: 72px;
`;

const HeaderWrapper = styled.div`
  width: 100%;
`;

const HeadingSpacer = styled.div`
  ${baseHeaderStyles}
`;

const StyledHeader = styled.header<FlexProps & BackgroundProps>`
  ${baseHeaderStyles}
  ${background}
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
  position: fixed;
  z-index: 1;

  @media (min-width: ${getBreakpoint("medium")}px) {
    flex-direction: row;
    align-items: center;
  }
`;

const FixedHeader: FC<BackgroundProps> = ({ children, background }) => (
  <HeaderWrapper>
    <StyledHeader
      background={background}
      justifyContent={["left", "space-between"]}
      alignItems={["flex-start", "center"]}
      flexDirection={["column", "row"]}
    >
      {children}
    </StyledHeader>
    <HeadingSpacer />
  </HeaderWrapper>
);

export default FixedHeader;
