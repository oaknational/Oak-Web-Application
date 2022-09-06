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
  $colStart?: ColSpans;
} & SpacingProps;

const combineSpanStart = (start: number | undefined, span: number) => {
  return start ? `${start}/${span}` : `${span}`;
};

const parseSpanStart = (value: string | null | undefined) => {
  if (value?.includes("/")) {
    const [start, span] = value.split("/");
    return `${start} / span ${span}`;
  }
  const span = value;
  return `span ${span}`;
};

const GridArea = styled(Box)<GridAreaProps & BoxProps & FlexProps>`
  ${spacing}
  ${flex}
  flex-direction: column;
  ${responsive(
    "grid-column",
    (props) => {
      return Array.isArray(props.$colSpan)
        ? props.$colSpan.map((span) => combineSpanStart(props.$colStart, span))
        : combineSpanStart(props.$colStart, props.$colSpan);
    },
    (value) => parseSpanStart(value)
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
