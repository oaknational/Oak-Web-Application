import styled, { css } from "styled-components";

import { box, BoxProps } from "../Box";
import { FlexProps } from "../Flex";

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
  ${flex}
`;

export default UL;
