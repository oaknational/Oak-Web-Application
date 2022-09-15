import styled from "styled-components";

import { box } from "../Box";

/**
 * Styled `ul` (unordered list) component.
 *
 * ## Usage
 *
 * Resets browser spacing and other styles.
 *
 * */
const UL = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  ${box}
`;

export default UL;
