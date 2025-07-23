import styled, { css } from "styled-components";
import {
  OakFlex,
  OakAllSpacingToken,
  OakFlexProps,
} from "@oaknational/oak-components";

import { OakColorName, OakTheme, PropsWithTheme } from "@/styles/theme";

export type HeaderConfig = {
  height: OakAllSpacingToken;
  color: OakColorName;
  background: OakColorName;
};

const headerConfig = (theme: OakTheme) => theme.header;
const headerHeight = ({ theme }: PropsWithTheme) => headerConfig(theme).height;

export const baseHeaderStyles = css`
  width: 100%; /* Do we need a max width here and to center? */
  min-height: ${headerHeight}px;
`;

export const StyledHeader = styled(OakFlex)`
  ${baseHeaderStyles}
  padding: 12px 16px;
`;

export type HeaderProps = { children?: React.ReactNode } & OakFlexProps;
