import { css, CSSProperties } from "styled-components";

import { NullablePixelSpacing, OakColorName } from "../theme/types";
import getColorByName from "../themeHelpers/getColorByName";

import responsive, { ResponsiveValues } from "./responsive";
import { getRemUnits } from "./getRemUnits";

type BorderValue = NullablePixelSpacing;
type BorderValueResponsive = ResponsiveValues<BorderValue>;
type BorderRadius = NullablePixelSpacing | "50%";
type BorderRadiusResponsive = ResponsiveValues<BorderRadius>;

type BorderStyleProps = CSSProperties["borderStyle"];

export type BorderProps = {
  $ba?: BorderValueResponsive;
  $bh?: BorderValueResponsive;
  $bv?: BorderValueResponsive;
  $bl?: BorderValueResponsive;
  $br?: BorderValueResponsive;
  $bt?: BorderValueResponsive;
  $bb?: BorderValueResponsive;
  $borderStyle?: BorderStyleProps;
  $borderColor?: OakColorName;
  $borderRadius?: BorderRadiusResponsive;
};

const parseBorderRadius = (value?: BorderRadius) => {
  return getRemUnits(value);
};

const parseBorder = (value?: BorderRadius) => {
  const borderWidth = getRemUnits(value);
  if (!borderWidth) {
    return;
  }
  return `${borderWidth} solid`;
};

const borderAll = css<{ $ba?: BorderValueResponsive }>`
  ${responsive("border", (props) => props.$ba, parseBorder)}
`;
const borderHorizontal = css<{ $bh?: BorderValueResponsive }>`
  ${responsive("border-left", (props) => props.$bh, parseBorder)}
  ${responsive("border-right", (props) => props.$bh, parseBorder)}
`;
const borderVertical = css<{ $bv?: BorderValueResponsive }>`
  ${responsive("border-top", (props) => props.$bv, parseBorder)}
  ${responsive("border-bottom", (props) => props.$bv, parseBorder)}
`;
const borderLeft = css<{ $bl?: BorderValueResponsive }>`
  ${responsive("border-left", (props) => props.$bl, parseBorder)}
`;
const borderRight = css<{ $br?: BorderValueResponsive }>`
  ${responsive("border-right", (props) => props.$br, parseBorder)}
`;
const borderTop = css<{ $bt?: BorderValueResponsive }>`
  ${responsive("border-top", (props) => props.$bt, parseBorder)}
`;
const borderBottom = css<{ $bb?: BorderValueResponsive }>`
  ${responsive("border-bottom", (props) => props.$bb, parseBorder)}
`;

const borderColor = css<{ $borderColor?: ResponsiveValues<OakColorName> }>`
  ${responsive("border-color", (props) => props.$borderColor, getColorByName)}
`;

const borderRadius = css<{ $borderRadius?: BorderRadiusResponsive }>`
  ${responsive(
    "border-radius",
    (props) => props.$borderRadius,
    parseBorderRadius
  )}
`;

export const border = css<BorderProps>`
  ${borderAll}
  ${borderHorizontal}
  ${borderVertical}
  ${borderLeft}
  ${borderRight}
  ${borderTop}
  ${borderBottom}
  ${borderColor}
  ${borderRadius}
`;

export default border;
