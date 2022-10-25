import styled from "styled-components";

import spacing, { SpacingProps } from "../../styles/utils/spacing";
import typography, { TypographyProps } from "../../styles/utils/typography";

export type UnstyledButtonProps = TypographyProps & SpacingProps;
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
  ${spacing}
`;

export default UnstyledButton;
