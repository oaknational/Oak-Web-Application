import styled from "styled-components";

import { box, BoxProps } from "../Box";

type ULProps = BoxProps;
/**
 * Styled `ul` (unordered list) component.
 *
 * ## Usage
 *
 * Resets browser spacing and other styles, accepts BoxProps' style props.
 *
 * */
const UL = styled.ul<ULProps>`
  list-style: none;
  padding: 0;
  margin: 0;
  ${box}
`;

export default UL;
