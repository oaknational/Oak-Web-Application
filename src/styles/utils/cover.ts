import { css } from "styled-components";

import responsive, { ResponsiveValues } from "./responsive";

export type CoverProps = { $cover?: ResponsiveValues<boolean> };
const cover = css<CoverProps>`
  ${responsive("position", (props) => (props.$cover ? "absolute" : undefined))}
  ${responsive("top", (props) => (props.$cover ? 0 : undefined))}
  ${responsive("right", (props) => (props.$cover ? 0 : undefined))}
  ${responsive("bottom", (props) => (props.$cover ? 0 : undefined))}
  ${responsive("left", (props) => (props.$cover ? 0 : undefined))}
  ${responsive("height", (props) => (props.$cover ? "100%" : undefined))}
`;

export default cover;
