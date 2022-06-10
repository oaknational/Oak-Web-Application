import styled from "styled-components";

import typography, { TypographyProps } from "../../styles/utils/typography";

type SpanProps = TypographyProps;
const Span = styled.span<SpanProps>`
  ${typography}
`;

export default Span;
