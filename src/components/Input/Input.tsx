import styled, { css } from "styled-components";

import getColor from "../../styles/themeHelpers/getColor";
import getFontFamily from "../../styles/themeHelpers/getFontFamily";
import { getBreakpoint } from "../../styles/utils/responsive";
import { margin, MarginProps } from "../../styles/utils/spacing";
import UnstyledInput from "../UnstyledInput";

const inputStyles = css`
  height: ${(props) => props.theme.input.height};
  border-radius: ${(props) => props.theme.input.borderRadius};
  border-color: ${getColor((props) => props.palette.input.default.border)};
  border-width: ${(props) => props.theme.input.borderWidth};
  border-style: solid;
  padding-left: 12px;
  padding-right: 0;
  font-size: 16px;
  font-family: ${getFontFamily("ui")};
  font-weight: 400;
  width: 100%;

  @media (max-width: ${getBreakpoint("small")}px) {
    /* iOS zooms in on inputs with font sizes <16px on mobile */
    font-size: 16px;
  }

  &,
  ::placeholder {
    font-family: ${getFontFamily("ui")};
  }

  :valid:not([value=""]) {
    border-color: ${getColor((props) => props.palette.input.valid.border)};
  }

  ::placeholder {
    color: ${getColor((props) => props.palette.input.valid.placeholder)};
    opacity: 1;
  }

  ${margin}
`;

type InputProps = MarginProps & {
  value: string;
};
const Input = styled(UnstyledInput)<InputProps>`
  ${inputStyles}
`;

export default Input;
