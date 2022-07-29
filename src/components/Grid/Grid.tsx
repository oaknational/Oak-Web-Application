import styled from "styled-components";

import background from "../../styles/utils/background";
import position, { PositionProps } from "../../styles/utils/position";
import spacing, {
  gridGap,
  GridGapProps,
  SpacingProps,
} from "../../styles/utils/spacing";

const Grid = styled.div<GridGapProps & SpacingProps & PositionProps>`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 100%;
  ${gridGap}
  ${spacing}
  ${position}
  ${background}
`;

export default Grid;
