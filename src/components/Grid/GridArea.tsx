import styled from "styled-components";

import flex from "../../styles/utils/flex";
import responsive from "../../styles/utils/responsive";
import spacing, { SpacingProps } from "../../styles/utils/spacing";
import Box, { BoxProps } from "../Box";
import { FlexProps } from "../Flex";

type ColSpans = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 12;

type GridAreaProps = {
  $colSpan: Array<ColSpans>;
  $rowSpan?: number;
  $order?: Array<number>;
} & SpacingProps;

const GridArea = styled(Box)<GridAreaProps & BoxProps & FlexProps>`
  ${spacing}
  ${flex}
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
