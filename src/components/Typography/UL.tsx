import styled, { css } from "styled-components";

import { GridProps } from "../Grid";
import { grid } from "../Grid/Grid";

import { box, BoxProps } from "@/components/SharedComponents/Box";
import { FlexProps } from "@/components/SharedComponents/Flex";
import flex from "@/styles/utils/flex";

type ULProps = BoxProps & {
  $reset?: boolean;
};
/**
 * Styled `ul` (unordered list) component.
 *
 * ## Usage
 *
 * Resets browser spacing and other styles, accepts BoxProps' style props.
 *
 * */
const UL = styled.ul<ULProps>`
  ${(props) =>
    props.$reset &&
    css`
      list-style: none;
      padding: 0;
    `}
  margin: 0;
  ${box}
`;

/**
 * Styled 'ul' extended with properties of Flex
 */
export const FlexList = styled(UL)<ULProps & FlexProps>`
  display: flex;
  ${flex}
`;

/**
 * Styled 'ul' extended with properties of Grid
 */
export const GridList = styled(UL)<ULProps & GridProps & BoxProps>`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 100%;
  padding: 0;
  margin: 0;
  ${grid}
  ${box}
`;

export default UL;
