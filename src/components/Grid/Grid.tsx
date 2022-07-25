import styled, { css } from "styled-components";

import { PixelSpacing } from "../../styles/theme";
import responsive, { ResponsiveValues } from "../../styles/utils/responsive";
import spacing, { SpacingProps } from "../../styles/utils/spacing";

type GridGapProps = {
  $rg?: ResponsiveValues<PixelSpacing>;
  $cg?: ResponsiveValues<PixelSpacing>;
};

const parse = (value?: PixelSpacing) => {
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

const Grid = styled.div<GridGapProps & SpacingProps>`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 100%;
  ${gridGap}
  ${spacing}
`;

export default Grid;
