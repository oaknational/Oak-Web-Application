import { css } from "styled-components";

import { OakFontName } from "../theme";
import getFontFamily from "../themeHelpers/getFontFamily";

import background, { BackgroundProps } from "./background";
import color, { ColorProps } from "./color";
import responsive, { ResponsiveValues } from "./responsive";

/**
 * @todo get these from theme
 */

const reset = css`
  all: initial;
`;
const headingSizes = {
  1: "56px",
  2: "48px",
  3: "40px",
  4: "32px",
  5: "24px",
  6: "20px",
  7: "16px",
};
export type HeadingSize = keyof typeof headingSizes;
export const heading = css<{ size: HeadingSize }>`
  ${reset}
  font-weight: 600;
  font-family: Lexend, sans-serif;
  line-height: 1.2;
  font-size: ${(props) => headingSizes[props.size]};
`;
const textSizes = {
  1: "18px",
  2: "16px",
  3: "14px",
  4: "12px",
};
export type TextSize = keyof typeof textSizes;
export const text = css<{ size?: TextSize }>`
  ${reset}
  font-family: ABeeZee, sans-serif;
  line-height: 1.4;
  font-size: ${({ size = 1 }) => textSizes[size]};
`;

type FontSize = string | number;
const parseFontSize = (value?: FontSize) => {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return `${value}px`;
  }
  return "inherit";
};
export type TypographyProps = {
  fontFamily?: OakFontName;
  fontSize?: ResponsiveValues<FontSize>;
  fontWeight?: string | number;
  lineHeight?: string | number;
} & BackgroundProps &
  ColorProps;
const typography = css<TypographyProps>`
  font-family: ${(props) => getFontFamily(props.fontFamily)};
  font-weight: ${(props) => props.fontWeight};
  line-height: ${(props) => props.lineHeight};
  ${responsive("font-size", (props) => props.fontSize, parseFontSize)}
  ${background}
  ${color}
`;

export default typography;
