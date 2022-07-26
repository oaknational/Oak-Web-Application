import styled from "styled-components";

import responsive from "../../styles/utils/responsive";
import spacing, { SpacingProps } from "../../styles/utils/spacing";

type ColSpans = 1 | 2 | 3 | 4 | 6 | 8 | 12;

type GridAreaProps = {
  $colSpan: Array<ColSpans>;
  $rowSpan?: number;
  $order?: Array<number>;
} & SpacingProps;

const GridArea = styled.div<GridAreaProps>`
  ${spacing}
  display: flex;
  flex-direction: column;
  ${responsive(
    "grid-column",
    (props) => props.$colSpan,
    (value) => `span ${value}`
  )};
  ${responsive(
    "order",
    (props) => props.$order,
    (value) => value && `${value}`
  )};
  ${responsive("grid-row", (props) =>
    props.$rowSpan ? `span ${props.$rowSpan}` : "span 1"
  )};
`;

export default GridArea;
