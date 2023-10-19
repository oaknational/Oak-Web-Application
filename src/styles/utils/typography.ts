import { CSSProperties } from "react";
import { css } from "styled-components";

import responsive, { ResponsiveValues } from "../../styles/utils/responsive";

import { getRemUnits } from "./getRemUnits";

export type FontVariant =
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "heading-4"
  | "heading-5"
  | "heading-6"
  | "heading-7"
  | "heading-light-1"
  | "heading-light-2"
  | "heading-light-3"
  | "heading-light-4"
  | "heading-light-5"
  | "heading-light-6"
  | "heading-light-7"
  | "body-1"
  | "body-1-bold"
  | "body-2"
  | "body-2-bold"
  | "body-3"
  | "body-3-bold"
  | "body-4"
  | "list-item-1"
  | "list-item-2";

type FontWeight = 300 | 400 | 600 | 700;
export type FontSize = 12 | 14 | 16 | 18 | 20 | 24 | 32 | 40 | 48 | 56;
type LineHeight = 16 | 20 | 24 | 28 | 32 | 40 | 48 | 56 | 64;
type LetterSpacing = "0.0115em" | "-0.005em";
type Font = readonly [FontSize, LineHeight, FontWeight, LetterSpacing];
export const FONT_VARIANTS: Record<FontVariant, Font> = {
  "heading-1": [56, 64, 600, "0.0115em"],
  "heading-2": [48, 56, 600, "0.0115em"],
  "heading-3": [40, 48, 600, "0.0115em"],
  "heading-4": [32, 40, 600, "0.0115em"],
  "heading-5": [24, 32, 600, "0.0115em"],
  "heading-6": [20, 24, 600, "0.0115em"],
  "heading-7": [16, 20, 600, "0.0115em"],
  "heading-light-1": [56, 64, 400, "0.0115em"],
  "heading-light-2": [48, 56, 400, "0.0115em"],
  "heading-light-3": [40, 48, 400, "0.0115em"],
  "heading-light-4": [32, 40, 400, "0.0115em"],
  "heading-light-5": [24, 32, 400, "0.0115em"],
  "heading-light-6": [20, 24, 400, "0.0115em"],
  "heading-light-7": [16, 20, 400, "0.0115em"],
  "body-1": [18, 28, 300, "-0.005em"],
  "body-2": [16, 24, 300, "-0.005em"],
  "body-3": [14, 20, 300, "-0.005em"],
  "body-4": [12, 16, 300, "-0.005em"],
  "body-1-bold": [18, 28, 700, "-0.005em"],
  "body-2-bold": [16, 24, 700, "-0.005em"],
  "body-3-bold": [14, 20, 700, "-0.005em"],
  "list-item-1": [18, 32, 300, "-0.005em"],
  "list-item-2": [16, 24, 300, "-0.005em"],
} as const;

const getFontWeight = (font?: FontVariant | null): FontWeight | undefined => {
  if (!font) return;
  return FONT_VARIANTS[font][2];
};
const getFontSize = (font?: FontVariant | null): string | null | undefined => {
  if (!font) return;
  const fontSizePx = FONT_VARIANTS[font][0];
  return getRemUnits(fontSizePx);
};
const getLineHeight = (
  font?: FontVariant | null,
): string | null | undefined => {
  if (!font) return;
  return getRemUnits(FONT_VARIANTS[font][1]);
};
const getLetterSpacing = (
  font?: FontVariant | null,
): LetterSpacing | undefined => {
  if (!font) return;
  return FONT_VARIANTS[font][3];
};

export type FontProps = {
  $font?: ResponsiveValues<FontVariant>;
};

const fontVariant = css<FontProps>`
  font-family: Lexend, sans-serif;
  ${responsive("font-weight", (props) => props.$font, getFontWeight)}
  ${responsive("font-size", (props) => props.$font, getFontSize)}
  ${responsive("line-height", (props) => props.$font, getLineHeight)}
  ${responsive("letter-spacing", (props) => props.$font, getLetterSpacing)}
`;

export type TypographyProps = FontProps & {
  $textDecoration?: ResponsiveValues<
    "underline" | "overline" | "line-through" | "none"
  >;
  $textAlign?: ResponsiveValues<CSSProperties["textAlign"]>;
  $whiteSpace?: ResponsiveValues<
    "normal" | "nowrap" | "pre" | "pre-wrap" | "pre-line" | "break-spaces"
  >;
  $wordWrap?: ResponsiveValues<"normal" | "break-word" | "initial" | "inherit">;
  $textOverflow?: ResponsiveValues<"clip" | "ellipsis">;
};

const typography = css<TypographyProps>`
  ${fontVariant}
  ${responsive("text-align", (props) => props.$textAlign)}
  ${responsive("text-decoration", (props) => props.$textDecoration)}
  ${responsive("white-space", (props) => props.$whiteSpace)}
  ${responsive("word-wrap", (props) => props.$wordWrap)}
  ${responsive("text-overflow", (props) => props.$textOverflow)}
`;

export default typography;
