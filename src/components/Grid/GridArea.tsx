import styled from "styled-components";

import responsive, { ResponsiveValues } from "../../styles/utils/responsive";
import { SpacingProps } from "../../styles/utils/spacing";
import Flex, { FlexProps } from "../Flex";

type ColSpans = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 12;

type GridAreaProps = {
  $colSpan: Array<ColSpans>;
  $rowSpan?: number;
  $order?: ResponsiveValues<number>;
  $colStart?: ResponsiveValues<ColSpans>;
} & SpacingProps;

const combineSpanStart = (
  start: ColSpans | undefined | null,
  span: ColSpans | undefined | null
) => {
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

const GridArea = styled(Flex)<GridAreaProps & FlexProps>`
  flex-direction: column;
  ${responsive(
    "grid-column",
    (props) => {
      return Array.isArray(props.$colSpan)
        ? props.$colSpan.map((span, index) =>
            combineSpanStart(
              Array.isArray(props.$colStart)
                ? props.$colStart[index]
                : props.$colStart,
              span
            )
          )
        : combineSpanStart(
            Array.isArray(props.$colStart)
              ? props.$colStart[0]
              : props.$colStart,
            props.$colSpan
          );
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
