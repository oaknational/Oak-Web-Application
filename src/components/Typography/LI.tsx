import styled from "styled-components";

import { margin, MarginProps } from "../../styles/utils/spacing";
import typography, { TypographyProps } from "../../styles/utils/typography";

/**
 * Styled `li` (ordered list) component.
 *
 * ## Usage
 *
 * Places where we directly want to style a list item
 *
 * */
const LI = styled.li<MarginProps & TypographyProps>`
  ${margin}
  ${typography}
`;

export default LI;
