import styled from "styled-components";

import spacing, { SpacingProps } from "../../styles/utils/spacing";
import typography, { TypographyProps } from "../../styles/utils/typography";

/**
 * Styled `li` (ordered list) component.
 *
 * ## Usage
 *
 * Places where we directly want to style a list item
 *
 * */
const LI = styled.li<SpacingProps & TypographyProps>`
  ${spacing}
  ${typography}
`;

export default LI;
