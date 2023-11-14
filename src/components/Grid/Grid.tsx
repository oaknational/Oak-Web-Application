import styled, { css } from "styled-components";

import { NullablePixelSpacing, PixelSpacing } from "../../styles/theme";
import responsive, { ResponsiveValues } from "../../styles/utils/responsive";
import Box, { BoxProps } from "../Box";

const parse = (value?: NullablePixelSpacing) => {
  switch (typeof value) {
    case "string":
      return value;
    case "number":
      return `${value}px`;
  }
};

const grid = css<GridProps>`
  ${responsive("grid-row-gap", (props) => props.$rg, parse)}
  ${responsive("grid-column-gap", (props) => props.$cg, parse)}
  ${responsive("grid-auto-rows", (props) => props.$gridAutoRows)}
  ${responsive("grid-template-areas", (props) => props.$gridTemplateAreas)}
  ${responsive("grid-template-columns", (props) => props.$gridTemplateColumns)}
`;

export type GridProps = BoxProps & {
  $rg?: ResponsiveValues<PixelSpacing>;
  $cg?: ResponsiveValues<PixelSpacing>;
  // grid-auto-rows: 1fr; ensures all rows are the same height
  $gridAutoRows?: ResponsiveValues<"1fr">;
  $gridTemplateAreas?: ResponsiveValues<string>;
  $gridTemplateColumns?: ResponsiveValues<string>;
};
const Grid = styled(Box)<GridProps>`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 100%;
  ${grid}
`;

export default Grid;
