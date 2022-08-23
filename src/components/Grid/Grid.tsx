import styled, { css } from "styled-components";

import { NullablePixelSpacing, PixelSpacing } from "../../styles/theme";
import responsive, { ResponsiveValues } from "../../styles/utils/responsive";
import Box, { BoxProps } from "../Box";

type GridGapProps = {
  $rg?: ResponsiveValues<PixelSpacing>;
  $cg?: ResponsiveValues<PixelSpacing>;
};

const parse = (value?: NullablePixelSpacing) => {
  switch (typeof value) {
    case "string":
      return value;
    case "number":
      return `${value}px`;
  }
};

const gridGap = css<GridGapProps>`
  ${responsive("grid-row-gap", (props) => props.$rg, parse)}
  ${responsive("grid-column-gap", (props) => props.$cg, parse)}
`;

const Grid = styled(Box)<GridGapProps & BoxProps>`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 100%;
  ${gridGap}
`;

export default Grid;
