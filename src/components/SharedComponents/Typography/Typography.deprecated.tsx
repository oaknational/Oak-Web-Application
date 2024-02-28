import styled from "styled-components";

import typography, { TypographyProps } from "@/styles/utils/typography";
import Box, { BoxProps } from "@/components/SharedComponents/Box";

type TypographyComponent = BoxProps & TypographyProps;
/**
 * The Typography component sets a typography style context from which children
 * inherit style properties through the cascade.
 * ## Usage
 * This should be the primary component to set a typography context.
 * Use this component whenever you want to style blocks of 'body' text.
 *
 * @deprecated use OakTypography from oak-components instead
 */
const Typography = styled(Box)<TypographyComponent>`
  ${typography}
`;

export default Typography;
