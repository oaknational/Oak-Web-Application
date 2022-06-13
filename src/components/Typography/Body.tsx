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

type BodyProps = BoxProps &
  Omit<TypographyProps, "fontSize" | "fontFamily"> & {
    fontSize?: BodyFontSize;
  };
/**
 * Wrapper component from which children inherit typography styles.
 * ## Usage
 * This should be the primary component to set a typography context.
 * Use this component whenever you want to style blocks of 'body' text.
 */
const Body = styled(Box)<BodyProps>`
  ${typography}
  font-family: ${getFontFamily("body")};
`;

Body.defaultProps = {
  fontWeight: 400,
  lineHeight: 1.4,
};

export default Body;
