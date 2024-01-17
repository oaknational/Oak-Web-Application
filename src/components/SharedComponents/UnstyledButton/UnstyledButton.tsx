import styled from "styled-components";

import color, { ColorProps } from "@/styles/utils/color";
import display, { DisplayProps } from "@/styles/utils/display";
import spacing, { SpacingProps } from "@/styles/utils/spacing";
import typography, { TypographyProps } from "@/styles/utils/typography";

export type UnstyledButtonProps = TypographyProps &
  SpacingProps &
  ColorProps &
  DisplayProps;
const UnstyledButton = styled.button<UnstyledButtonProps>`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  text-align: left;
  font-family: unset;
  ${typography}
  ${color}
  ${spacing}
  ${display}
`;

export default UnstyledButton;
