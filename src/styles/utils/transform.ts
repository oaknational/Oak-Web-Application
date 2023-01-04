import { CSSProperties } from "react";
import { css } from "styled-components";

import responsive, { ResponsiveValues } from "./responsive";

export type TransformProps = {
  $transform?: ResponsiveValues<CSSProperties["transform"] | null>;
  $transformOrigin?: ResponsiveValues<CSSProperties["transformOrigin"] | null>;
};
const transform = css<TransformProps>`
  ${responsive("transform", (props) => props.$transform)}
  ${responsive("transform-origin", (props) => props.$transformOrigin)}
`;

export default transform;
