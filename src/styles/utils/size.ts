import { css } from "styled-components";

import { NullablePixelSpacing, PercentSpacing } from "../theme/types";

import responsive, { ResponsiveValues } from "./responsive";
import { pxToRemString } from "./pxToRemString";

type SizeValue =
  | PercentSpacing
  | "auto"
  | "none"
  | NullablePixelSpacing
  | "max-content";
export type SizeValues = ResponsiveValues<SizeValue>;

const parse = (value?: SizeValue) => {
  return pxToRemString(value);
};

export type SizeProps = {
  $width?: SizeValues;
  $minWidth?: SizeValues;
  $maxWidth?: SizeValues;
  $height?: SizeValues;
  $minHeight?: SizeValues;
  $maxHeight?: SizeValues;
};

const size = css<SizeProps>`
  ${responsive("width", (props) => props.$width, parse)}
  ${responsive("min-width", (props) => props.$minWidth, parse)}
  ${responsive("max-width", (props) => props.$maxWidth, parse)}
  ${responsive("height", (props) => props.$height, parse)}
  ${responsive("min-height", (props) => props.$minHeight, parse)}
  ${responsive("max-height", (props) => props.$maxHeight, parse)}
`;

export default size;
