import { css } from "styled-components";

import { OakColorName } from "../theme";
import getColorByName from "../themeHelpers/getColorByName";
import getTextColorForBackground from "../themeHelpers/getTextColorForBackground";

import responsive, { ResponsiveValues } from "./responsive";

type OakColorNames = ResponsiveValues<OakColorName>;

export type BackgroundProps = { $background?: OakColorNames };
const background = css<BackgroundProps>`
  ${responsive(
    "background-color",
    (props) => props.$background,
    getColorByName
  )}
  ${responsive(
    "color",
    (props) => props.$background,
    getTextColorForBackground
  )}
`;

export default background;
