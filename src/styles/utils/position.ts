import { CSSProperties } from "react";
import { css } from "styled-components";

import { NullablePixelSpacing } from "../theme";
import { NegativePixelSpacing, PercentSpacing, Unset } from "../theme/types";

import responsive, { ResponsiveValues } from "./responsive";

type PxOrPercent =
  | NullablePixelSpacing
  | NegativePixelSpacing
  | PercentSpacing
  | Unset;

export type PositionProps = {
  $position?: ResponsiveValues<CSSProperties["position"]>;
  $top?: ResponsiveValues<PxOrPercent>;
  $right?: ResponsiveValues<PxOrPercent>;
  $bottom?: ResponsiveValues<PxOrPercent>;
  $left?: ResponsiveValues<PxOrPercent>;
  $overflow?: ResponsiveValues<CSSProperties["overflow"]>;
  $overflowX?: ResponsiveValues<CSSProperties["overflowX"]>;
  $overflowY?: ResponsiveValues<CSSProperties["overflowY"]>;
  $objectFit?: ResponsiveValues<CSSProperties["objectFit"]>;
  $objectPosition?: ResponsiveValues<CSSProperties["objectPosition"]>;
  $pointerEvents?: ResponsiveValues<CSSProperties["pointerEvents"]>;
  $visibility?: ResponsiveValues<CSSProperties["visibility"]>;
  $gap?: ResponsiveValues<PxOrPercent>;
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
  ${responsive("overflow-x", (props) => props.$overflowX)}
  ${responsive("overflow-y", (props) => props.$overflowY)}
  ${responsive("object-fit", (props) => props.$objectFit)}
  ${responsive("object-position", (props) => props.$objectPosition)}
  ${responsive("pointer-events", (props) => props.$pointerEvents)}
  ${responsive("visibility", (props) => props.$visibility)}
  ${responsive("gap", (props) => props.$gap, parsePxOrPercent)}
`;

export default position;
