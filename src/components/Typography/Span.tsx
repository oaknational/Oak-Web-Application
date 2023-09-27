import styled from "styled-components";

import color, { ColorProps } from "@/styles/utils/color";
import opacity, { OpacityProps } from "@/styles/utils/opacity";
import {
  margin,
  MarginProps,
  padding,
  PaddingProps,
} from "@/styles/utils/spacing";
import typography, { TypographyProps } from "@/styles/utils/typography";
import border, { BorderProps } from "@/styles/utils/border";
import background, { BackgroundProps } from "@/styles/utils/background";

export type SpanProps = TypographyProps &
  ColorProps &
  OpacityProps &
  MarginProps &
  PaddingProps &
  BackgroundProps &
  BorderProps;
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
  ${padding}
  ${background}
  ${border}
`;

export default Span;
