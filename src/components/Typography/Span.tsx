import styled from "styled-components";

import typography, { TypographyProps } from "../../styles/utils/typography";

type SpanProps = TypographyProps;
/**
 * Span renders a `span` (inline text) component, exposing all the typography props.
 * ## Usage
 * Use this component when you want to apply styles to a piece of inline text.
 */
const Span = styled.span<SpanProps>`
  ${typography}
`;

export default Span;
