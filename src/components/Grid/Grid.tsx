import styled from "styled-components";

import spacing, {
  gridGap,
  GridGapProps,
  SpacingProps,
} from "../../styles/utils/spacing";

const Grid = styled.div<GridGapProps & SpacingProps>`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 100%;
  ${gridGap}
  ${spacing}
`;

export default Grid;
