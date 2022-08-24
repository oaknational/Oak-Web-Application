import { CSSProperties } from "react";
import { css } from "styled-components";

import { NullablePixelSpacing } from "../theme";
import { NegativePixelSpacing, PercentSpacing } from "../theme/types";

import responsive, { ResponsiveValues } from "./responsive";

type PxOrPercent = NullablePixelSpacing | NegativePixelSpacing | PercentSpacing;
export type PositionProps = {
  $position?: ResponsiveValues<CSSProperties["position"]>;
  $top?: ResponsiveValues<PxOrPercent>;
  $right?: ResponsiveValues<PxOrPercent>;
  $bottom?: ResponsiveValues<PxOrPercent>;
  $left?: ResponsiveValues<PxOrPercent>;
  $overflow?: ResponsiveValues<CSSProperties["overflow"]>;
};
const parsePxOrPercent = (value?: PxOrPercent) => {
  return typeof value === "number" ? `${value}px` : value;
};
const position = css<PositionProps>`
  ${responsive("position", (props) => props.$position)}
  ${responsive("top", (props) => props.$top, parsePxOrPercent)}
  ${responsive("right", (props) => props.$right, parsePxOrPercent)}
  ${responsive("bottom", (props) => props.$bottom, parsePxOrPercent)}
  ${responsive("left", (props) => props.$left, parsePxOrPercent)}
  ${responsive("overflow", (props) => props.$overflow)}
`;

export default position;
