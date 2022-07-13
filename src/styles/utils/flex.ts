import { CSSProperties } from "react";
import { css } from "styled-components";

import responsive, { ResponsiveValues } from "./responsive";

export type FlexCssProps = {
  flexDirection?: ResponsiveValues<CSSProperties["flexDirection"]>;
  alignItems?: ResponsiveValues<CSSProperties["alignItems"]>;
  justifyContent?: ResponsiveValues<CSSProperties["justifyContent"]>;
  flex?: ResponsiveValues<CSSProperties["flex"]>;
  flexGrow?: ResponsiveValues<CSSProperties["flexGrow"]>;
  flexWrap?: ResponsiveValues<CSSProperties["flexWrap"]>;
  maxWidth?: ResponsiveValues<CSSProperties["maxWidth"]>;
};

const parse = (value?: number | string) => {
  switch (typeof value) {
    case "string":
      return value;
    case "number":
      return `${value}px`;
  }
};

const flex = css<FlexCssProps>`
  display: flex;
  ${responsive("flex-direction", (props) => props.flexDirection)}
  ${responsive("align-items", (props) => props.alignItems)}
  ${responsive("justify-content", (props) => props.justifyContent)}
  ${responsive("flex", (props) => props.flex)}
  ${responsive("flex-grow", (props) => props.flexGrow)}
  ${responsive("flex-wrap", (props) => props.flexWrap)}
  ${responsive("max-width", (props) => props.maxWidth, parse)}
`;

export default flex;
