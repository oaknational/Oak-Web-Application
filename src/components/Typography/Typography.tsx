import styled from "styled-components";

import typography, { TypographyProps } from "../../styles/utils/typography";
import Box, { BoxProps } from "../SharedComponents/Box";

type TypographyComponent = BoxProps & TypographyProps;
/**
 * The Typography component sets a typography style context from which children
 * inherit style properties through the cascade.
 * ## Usage
 * This should be the primary component to set a typography context.
 * Use this component whenever you want to style blocks of 'body' text.
 */
const Typography = styled(Box)<TypographyComponent>`
  ${typography}
`;

export default Typography;
