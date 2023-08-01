import { CSSProperties } from "react";
import { css } from "styled-components";

import responsive, { ResponsiveValues } from "./responsive";

export type FlexCssProps = {
  $flexDirection?: ResponsiveValues<CSSProperties["flexDirection"]>;
  $alignItems?: ResponsiveValues<CSSProperties["alignItems"]>;
  $justifyContent?: ResponsiveValues<CSSProperties["justifyContent"]>;
  $flex?: ResponsiveValues<CSSProperties["flex"]>;
  $flexGrow?: ResponsiveValues<CSSProperties["flexGrow"]>;
  $flexWrap?: ResponsiveValues<CSSProperties["flexWrap"]>;
  $alignSelf?: ResponsiveValues<CSSProperties["alignSelf"]>;
  $flexShrink?: ResponsiveValues<CSSProperties["flexShrink"]>;
  $gap?: ResponsiveValues<CSSProperties["gap"]>;
};

const flex = css<FlexCssProps>`
  ${responsive("flex-direction", (props) => props.$flexDirection)}
  ${responsive("align-items", (props) => props.$alignItems)}
  ${responsive("justify-content", (props) => props.$justifyContent)}
  ${responsive("flex", (props) => props.$flex)}
  ${responsive("flex-grow", (props) => props.$flexGrow)}
  ${responsive("flex-wrap", (props) => props.$flexWrap)}
  ${responsive("align-self", (props) => props.$alignSelf)}
  ${responsive("flex-shrink", (props) => props.$flexShrink)}
  ${responsive("gap", (props) => props.$gap)}
`;

export default flex;
