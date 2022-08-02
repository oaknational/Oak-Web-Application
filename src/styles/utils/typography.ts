import { css } from "styled-components";

import { OakFontName } from "../theme";
import getFontFamily from "../themeHelpers/getFontFamily";

import color, { ColorProps } from "./color";
import position, { PositionProps } from "./position";
import responsive, { ResponsiveValues } from "./responsive";

type FontSize = string | number;
const parseFontSize = (value?: FontSize | null) => {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return `${value}px`;
  }
};

export type TypographyProps = ColorProps &
  PositionProps & {
    $fontFamily?: ResponsiveValues<OakFontName>;
    $fontSize?: ResponsiveValues<FontSize>;
    $fontWeight?: ResponsiveValues<400 | 600>;
    $lineHeight?: ResponsiveValues<string | number>;
    $textAlign?: "left" | "center" | "right";
  };
const typography = css<TypographyProps>`
  ${responsive("font-family", (props) => props.$fontFamily, getFontFamily)}
  ${responsive("font-weight", (props) => props.$fontWeight)}
  ${responsive("line-height", (props) => props.$lineHeight)}
  ${responsive("font-size", (props) => props.$fontSize, parseFontSize)}
  ${responsive("text-align", (props) => props.$textAlign)}
  ${color}
  ${position}
`;

export default typography;
