import { css } from "styled-components";

import { OakColorName } from "../theme";
import getColorByName from "../themeHelpers/getColorByName";

import responsive, { ResponsiveValues } from "./responsive";

type OakColorNames = ResponsiveValues<OakColorName>;

export type ColorProps = { $color?: OakColorNames };
const color = css<ColorProps>`
  ${responsive<ColorProps, OakColorName>(
    "color",
    (props) => props.$color,
    getColorByName
  )}
`;

export default color;
