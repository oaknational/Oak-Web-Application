import { css } from "styled-components";

import { NegativePixelSpacing, NullablePixelSpacing } from "../theme/types";

import responsive, { ResponsiveValues } from "./responsive";
import { getRemUnits } from "./getRemUnits";

type PaddingValue = NullablePixelSpacing;
type PaddingValues = ResponsiveValues<PaddingValue>;
export type PaddingProps = {
  $pa?: PaddingValues;
  $ph?: PaddingValues;
  $pv?: PaddingValues;
  $pl?: PaddingValues;
  $pr?: PaddingValues;
  $pt?: PaddingValues;
  $pb?: PaddingValues;
};
type MarginValue = "auto" | NullablePixelSpacing | NegativePixelSpacing;
type MarginValues = ResponsiveValues<MarginValue>;
export type MarginProps = {
  $ma?: MarginValues;
  $mh?: MarginValues;
  $mv?: MarginValues;
  $ml?: MarginValues;
  $mr?: MarginValues;
  $mt?: MarginValues;
  $mb?: MarginValues;
};

const parse = (value?: PaddingValue | MarginValue) => {
  return getRemUnits(value);
};
const paddingAll = css<{ $pa?: PaddingValues }>`
  ${responsive("padding", (props) => props.$pa, parse)}
`;
const paddingHorizontal = css<{ $ph?: PaddingValues }>`
  ${responsive("padding-left", (props) => props.$ph, parse)}
  ${responsive("padding-right", (props) => props.$ph, parse)}
`;
const paddingVertical = css<{ $pv?: PaddingValues }>`
  ${responsive("padding-top", (props) => props.$pv, parse)}
  ${responsive("padding-bottom", (props) => props.$pv, parse)}
`;
const paddingLeft = css<{ $pl?: PaddingValues }>`
  ${responsive("padding-left", (props) => props.$pl, parse)}
`;
const paddingRight = css<{ $pr?: PaddingValues }>`
  ${responsive("padding-right", (props) => props.$pr, parse)}
`;
const paddingTop = css<{ $pt?: PaddingValues }>`
  ${responsive("padding-top", (props) => props.$pt, parse)}
`;
const paddingBottom = css<{ $pb?: PaddingValues }>`
  ${responsive("padding-bottom", (props) => props.$pb, parse)}
`;
const marginAll = css<{ $ma?: MarginValues }>`
  ${responsive("margin", (props) => props.$ma, parse)}
`;
const marginHorizontal = css<{ $mh?: MarginValues }>`
  ${responsive("margin-left", (props) => props.$mh, parse)}
  ${responsive("margin-right", (props) => props.$mh, parse)}
`;
const marginVertical = css<{ $mv?: MarginValues }>`
  ${responsive("margin-top", (props) => props.$mv, parse)}
  ${responsive("margin-bottom", (props) => props.$mv, parse)}
`;
const marginLeft = css<{ $ml?: MarginValues }>`
  ${responsive("margin-left", (props) => props.$ml, parse)}
`;
const marginRight = css<{ $mr?: MarginValues }>`
  ${responsive("margin-right", (props) => props.$mr, parse)}
`;
const marginTop = css<{ $mt?: MarginValues }>`
  ${responsive("margin-top", (props) => props.$mt, parse)}
`;
const marginBottom = css<{ $mb?: MarginValues }>`
  ${responsive("margin-bottom", (props) => props.$mb, parse)}
`;

export const margin = css<MarginProps>`
  ${marginAll}
  ${marginHorizontal}
  ${marginVertical}
  ${marginLeft}
  ${marginRight}
  ${marginTop}
  ${marginBottom}
`;

export const padding = css<PaddingProps>`
  ${paddingAll}
  ${paddingHorizontal}
  ${paddingVertical}
  ${paddingLeft}
  ${paddingRight}
  ${paddingTop}
  ${paddingBottom}
`;

export type SpacingProps = PaddingProps & MarginProps;
const spacing = css<SpacingProps>`
  ${padding}
  ${margin}
`;

export default spacing;
