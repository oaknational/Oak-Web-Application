import styled from "styled-components";

import flex from "../../styles/utils/flex";
import typography, { TypographyProps } from "../../styles/utils/typography";
import { box } from "../Box";
import { FlexProps } from "../Flex";

/**
 * Styled `li` (list item) component.
 *
 * ## Usage
 *
 * Places where we directly want to style a list item
 *
 * */
const LI = styled.li<FlexProps & TypographyProps>`
  ${box}
  ${flex}
  ${typography}
`;

LI.defaultProps = {
  $display: "revert",
};

export default LI;
