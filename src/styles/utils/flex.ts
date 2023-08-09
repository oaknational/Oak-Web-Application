import { CSSProperties } from "react";
import { css } from "styled-components";

import { NullablePixelSpacing } from "../theme";

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
  $gap?: ResponsiveValues<NullablePixelSpacing>;
};

const parse = (value?: unknown) => {
  switch (typeof value) {
    case "string":
      return value;
    case "number":
      return `${value}px`;
  }
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
  ${responsive("gap", (props) => props.$gap, parse)}
`;

export default flex;
