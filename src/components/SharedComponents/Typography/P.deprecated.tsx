import styled from "styled-components";

import color, { ColorProps } from "@/styles/utils/color";
import { margin, MarginProps } from "@/styles/utils/spacing";
import typography, { TypographyProps } from "@/styles/utils/typography";

type PProps = MarginProps & TypographyProps & ColorProps;
/**
 * Styled `p` (paragraph) component.
 * ## Usage
 * In general, using a `p` as a descendant of `<Body>` should suffice.
 * However, if you want different styles for a particular paragraph,
 * you can use this component to apply additional styles.
 *
 * @deprecated use OakP from oak-components instead
 */
const P = styled.p<PProps>`
  ${typography}
  ${color}
  ${margin}

  a {
    color: ${(props) => props.theme.colors.navy};
  }
`;

export default P;
