import { css } from "styled-components";

import { OakFontName } from "../theme";
import getFontFamily from "../themeHelpers/getFontFamily";

import color, { ColorProps } from "./color";
import responsive, { ResponsiveValues } from "./responsive";

type FontSize = string | number;
const parseFontSize = (value?: FontSize) => {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return `${value}px`;
  }
};

export type TypographyProps = ColorProps & {
  $fontFamily?: ResponsiveValues<OakFontName>;
  $fontSize?: ResponsiveValues<FontSize>;
  $fontWeight?: ResponsiveValues<400 | 600>;
  $lineHeight?: ResponsiveValues<string | number>;
};
const typography = css<TypographyProps>`
  ${responsive("font-family", (props) => props.$fontFamily, getFontFamily)}
  ${responsive("font-weight", (props) => props.$fontWeight)}
  ${responsive("font-height", (props) => props.$lineHeight)}
  ${responsive("font-size", (props) => props.$fontSize, parseFontSize)}
  ${color}
`;

export default typography;
