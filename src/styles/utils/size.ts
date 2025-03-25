import { css } from "styled-components";

import type { SizeValue, SizeValues } from "../theme/types";

import responsive from "./responsive";
import { getRemUnits } from "./getRemUnits";

const parse = (value?: SizeValue) => {
  return getRemUnits(value);
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
