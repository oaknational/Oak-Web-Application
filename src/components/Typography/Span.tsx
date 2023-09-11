import styled from "styled-components";

import color, { ColorProps } from "../../styles/utils/color";
import opacity, { OpacityProps } from "../../styles/utils/opacity";
import { margin, MarginProps } from "../../styles/utils/spacing";
import typography, { TypographyProps } from "../../styles/utils/typography";

export type SpanProps = TypographyProps &
  ColorProps &
  OpacityProps &
  MarginProps;
/**
 * Span renders a `span` (inline text) component, exposing all the typography props.
 * ## Usage
 * Use this component when you want to apply styles to a piece of inline text.
 */
const Span = styled.span<SpanProps>`
  ${typography}
  ${color}
  ${opacity}
  ${margin}
`;

export default Span;
