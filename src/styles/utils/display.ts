import { CSSProperties } from "react";
import { css } from "styled-components";

import responsive from "./responsive";

export type DisplayProps = { display?: CSSProperties["display"] };
const display = css<DisplayProps>`
  ${responsive("display", (props) => props.display)}
`;

export default display;
