import { FC } from "react";
import styled, { css } from "styled-components";

import { OakTheme, PropsWithTheme } from "../../styles/theme";
import background, { BackgroundProps } from "../../styles/utils/background";
import Flex from "../Flex";

export type HeaderConfig = {
  height: number;
};

const headerConfig = (theme: OakTheme) => theme.header;
const headerHeight = ({ theme }: PropsWithTheme) => headerConfig(theme).height;

const baseHeaderStyles = css`
  width: 100%; /* Do we need a max width here and to center? */
  min-height: ${headerHeight}px;
`;

const HeaderWrapper = styled.div`
  width: 100%;
`;

const HeadingSpacer = styled.div`
  ${baseHeaderStyles}
`;

const StyledHeader = styled(Flex)`
  ${baseHeaderStyles}
  ${background}
  padding: 12px;
  position: fixed;
  z-index: 1;
`;

const FixedHeader: FC<BackgroundProps> = ({ children, $background }) => (
  <HeaderWrapper>
    <StyledHeader
      as="header"
      $background={$background}
      $justifyContent={["left", "space-between"]}
      $alignItems={["flex-start", "center"]}
      $flexDirection={["column", "row"]}
    >
      {children}
    </StyledHeader>
    <HeadingSpacer />
  </HeaderWrapper>
);

export default FixedHeader;
