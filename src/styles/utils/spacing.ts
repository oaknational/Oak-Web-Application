import { css } from "styled-components";

import { PixelSpacing } from "../theme/types";

import responsive, { ResponsiveValues } from "./responsive";

type SpacingValue = "auto" | PixelSpacing;
type SpacingValues = ResponsiveValues<SpacingValue>;
export type PaddingProps = {
  $pa?: SpacingValues;
  $ph?: SpacingValues;
  $pv?: SpacingValues;
  $pl?: SpacingValues;
  $pr?: SpacingValues;
  $pt?: SpacingValues;
  $pb?: SpacingValues;
};
export type MarginProps = {
  $ma?: SpacingValues;
  $mh?: SpacingValues;
  $mv?: SpacingValues;
  $ml?: SpacingValues;
  $mr?: SpacingValues;
  $mt?: SpacingValues;
  $mb?: SpacingValues;
};

const parse = (value?: SpacingValue) => {
  switch (typeof value) {
    case "string":
      return value;
    case "number":
      return `${value}px`;
  }
};
const paddingAll = css<{ $pa?: SpacingValues }>`
  ${responsive("padding", (props) => props.$pa, parse)}
`;
const paddingHorizontal = css<{ $ph?: SpacingValues }>`
  ${responsive("padding-left", (props) => props.$ph, parse)}
  ${responsive("padding-right", (props) => props.$ph, parse)}
`;
const paddingVertical = css<{ $pv?: SpacingValues }>`
  ${responsive("padding-top", (props) => props.$pv, parse)}
  ${responsive("padding-bottom", (props) => props.$pv, parse)}
`;
const paddingLeft = css<{ $pl?: SpacingValues }>`
  ${responsive("padding-left", (props) => props.$pl, parse)}
`;
const paddingRight = css<{ $pr?: SpacingValues }>`
  ${responsive("padding-right", (props) => props.$pr, parse)}
`;
const paddingTop = css<{ $pt?: SpacingValues }>`
  ${responsive("padding-top", (props) => props.$pt, parse)}
`;
const paddingBottom = css<{ $pb?: SpacingValues }>`
  ${responsive("padding-bottom", (props) => props.$pb, parse)}
`;
const marginAll = css<{ $ma?: SpacingValues }>`
  ${responsive("margin", (props) => props.$ma, parse)}
`;
const marginHorizontal = css<{ $mh?: SpacingValues }>`
  ${responsive("margin-left", (props) => props.$mh, parse)}
  ${responsive("margin-right", (props) => props.$mh, parse)}
`;
const marginVertical = css<{ $mv?: SpacingValues }>`
  ${responsive("margin-top", (props) => props.$mv, parse)}
  ${responsive("margin-bottom", (props) => props.$mv, parse)}
`;
const marginLeft = css<{ $ml?: SpacingValues }>`
  ${responsive("margin-left", (props) => props.$ml, parse)}
`;
const marginRight = css<{ $mr?: SpacingValues }>`
  ${responsive("margin-right", (props) => props.$mr, parse)}
`;
const marginTop = css<{ $mt?: SpacingValues }>`
  ${responsive("margin-top", (props) => props.$mt, parse)}
`;
const marginBottom = css<{ $mb?: SpacingValues }>`
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
