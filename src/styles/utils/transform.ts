import { CSSProperties } from "react";
import { css } from "styled-components";

import responsive, { ResponsiveValues } from "./responsive";

export type TransformProps = {
  $transform?: ResponsiveValues<CSSProperties["transform"] | null>;
};
const transform = css<TransformProps>`
  ${responsive("transform", (props) => props.$transform)}
`;

export default transform;
