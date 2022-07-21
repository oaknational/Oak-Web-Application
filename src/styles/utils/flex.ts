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
};

const flex = css<FlexCssProps>`
  display: flex;
  ${responsive("flex-direction", (props) => props.flexDirection)}
  ${responsive("align-items", (props) => props.alignItems)}
  ${responsive("justify-content", (props) => props.justifyContent)}
  ${responsive("flex", (props) => props.flex)}
  ${responsive("flex-grow", (props) => props.flexGrow)}
  ${responsive("flex-wrap", (props) => props.flexWrap)}
`;

export default flex;
