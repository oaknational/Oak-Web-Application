import { CSSProperties } from "react";
import { css } from "styled-components";

import responsive from "./responsive";

export type PositionProps = { position?: CSSProperties["position"] };
const position = css<PositionProps>`
  ${responsive("position", (props) => props.position)}
`;

export default position;
