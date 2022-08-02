import { CSSProperties } from "react";
import { css } from "styled-components";

import { NullablePixelSpacing } from "../theme";

import responsive from "./responsive";

type PxOrPercent = NullablePixelSpacing | "100%" | "50%";

export type PositionProps = {
  $position?: CSSProperties["position"];
  $top?: PxOrPercent;
  $right?: PxOrPercent;
  $bottom?: PxOrPercent;
  $left?: PxOrPercent;
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
`;

export default position;
