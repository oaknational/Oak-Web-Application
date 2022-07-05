import styled from "styled-components";

import typography, { TypographyProps } from "../../styles/utils/typography";
import Box, { BoxProps } from "../Box";
import getFontFamily from "../../styles/themeHelpers/getFontFamily";

const bodyFontSizes = {
  18: "18px",
  16: "16px",
  14: "14px",
  12: "12px",
};

export type BodyFontSize = keyof typeof bodyFontSizes;

type TypographyComponent = BoxProps &
  Omit<TypographyProps, "fontSize" | "fontFamily"> & {
    fontSize?: BodyFontSize;
  };
/**
 * The Typography component sets a typography style context from which children
 * inherit style properties through the cascade.
 * ## Usage
 * This should be the primary component to set a typography context.
 * Use this component whenever you want to style blocks of 'body' text.
 */
const Typography = styled(Box)<TypographyComponent>`
  ${typography}
  font-family: ${getFontFamily("body")};
`;

/**
 * @todo do we even want to set defaults here? The issue with setting defaults
 * is that if we place a Typography inside another Typography, the expected
 * behaviour would be that it extends the current context, rather than
 * resetting certain defaults?
 * Perhaps defaults should be in global css instead.
 */
Typography.defaultProps = {
  fontWeight: 400,
  lineHeight: 1.4,
};

export default Typography;
