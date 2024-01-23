import styled from "styled-components";

import typography, { TypographyProps } from "@/styles/utils/typography";

type LabelProps = TypographyProps;
/**
 * Label renders a `label` element, exposing all the typography props.
 * ## Usage
 * Use this component when you want to apply styles to a label, likely within
 * a form.
 */
const Label = styled.label<LabelProps>`
  ${typography}
`;

export default Label;
