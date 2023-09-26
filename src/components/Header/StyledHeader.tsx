import styled, { css } from "styled-components";

import {
  OakColorName,
  OakTheme,
  PixelSpacing,
  PropsWithTheme,
} from "../../styles/theme";
import background, { BackgroundProps } from "../../styles/utils/background";
import Flex from "../Flex";

export type HeaderConfig = {
  height: PixelSpacing;
  color: OakColorName;
  background: OakColorName;
};

const headerConfig = (theme: OakTheme) => theme.header;
const headerHeight = ({ theme }: PropsWithTheme) => headerConfig(theme).height;

export const baseHeaderStyles = css`
  width: 100%; /* Do we need a max width here and to center? */
  min-height: ${headerHeight}px;
`;

export const StyledHeader = styled(Flex)`
  ${baseHeaderStyles}
  ${background}
  padding: 12px 16px;
`;

export type HeaderProps = { children?: React.ReactNode } & BackgroundProps;
