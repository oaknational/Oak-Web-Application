import styled from "styled-components";

import responsive, { ResponsiveValues } from "../../styles/utils/responsive";
import { SpacingProps } from "../../styles/utils/spacing";
import Flex, { FlexProps } from "../Flex";

type ColRowSpan =
  | 0
  | 0.5
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 9.5
  | 10
  | 11
  | 12;
type ColSpan = ColRowSpan;
type RowSpan = ColRowSpan;

export type GridAreaProps = {
  $colSpan: Array<ColSpan>;
  $rowSpan?: Array<RowSpan>;
  $order?: ResponsiveValues<number>;
  $colStart?: ResponsiveValues<ColSpan>;
  $colEnd?: ResponsiveValues<ColSpan>;
  $rowStart?: ResponsiveValues<RowSpan>;
} & SpacingProps;

const combineSpanStart = (
  start: ColSpan | undefined | null | RowSpan,
  span: ColSpan | undefined | null | RowSpan,
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
              span,
            ),
          )
        : combineSpanStart(
            Array.isArray(props.$colStart)
              ? props.$colStart[0]
              : props.$colStart,
            props.$colSpan,
          );
    },
    (value) => parseSpanStart(value),
  )};
  ${responsive(
    "grid-row",
    (props) => {
      return Array.isArray(props.$rowSpan)
        ? props.$rowSpan.map((span, index) =>
            combineSpanStart(
              Array.isArray(props.$rowStart)
                ? props.$rowStart[index]
                : props.$rowStart,
              span,
            ),
          )
        : combineSpanStart(
            Array.isArray(props.$rowStart)
              ? props.$rowStart[0]
              : props.$rowStart,
            props.$rowSpan,
          );
    },
    (value) => parseSpanStart(value),
  )};
  ${responsive(
    "order",
    (props) => props.$order,
    (value) => value && `${value}`,
  )};
  ${responsive("grid-row", (props) =>
    props.$rowSpan ? `span ${props.$rowSpan}` : "span 1",
  )};
  ${responsive("grid-column-start", (props) => props.$colStart)}
  ${responsive("grid-column-end", (props) => props.$colEnd)}
  ${responsive("grid-row-start", (props) => props.$rowStart)}
`;

export default GridArea;
