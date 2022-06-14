import styled from "styled-components";

import { gridGap, GridGapProps } from "../../styles/utils/spacing";

const Grid = styled.div<GridGapProps>`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 100%;
  ${gridGap}
`;

export default Grid;
