import styled from "styled-components";

import responsive from "../../styles/utils/responsive";

type ColSpans = 1 | 2 | 3 | 4 | 6 | 8 | 12;

type GridAreaProps = {
  colSpan: Array<ColSpans>;
};

const GridArea = styled.div<GridAreaProps>`
  ${responsive(
    "grid-column",
    (props) => props.colSpan,
    (value) => `span ${value}`
  )};
`;

export default GridArea;
