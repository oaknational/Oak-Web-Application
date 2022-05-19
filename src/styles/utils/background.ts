import { css } from "styled-components";

import theme, { OakColorName } from "../theme";

import responsive, { ResponsiveValues } from "./responsive";

const getBackgroundColor = (color?: OakColorName) => {
  return color ? theme.colors[color].color : undefined;
};
const getTextColorForBackground = (color?: OakColorName) => {
  return color ? theme.colors[color].contrastText : undefined;
};

type OakColorNames = ResponsiveValues<OakColorName>;

export type BackgroundProps = { bg?: OakColorNames };
const background = css<BackgroundProps>`
  ${responsive("background-color", (props) => props.bg, getBackgroundColor)}
  ${responsive("color", (props) => props.bg, getTextColorForBackground)}
`;

export default background;
