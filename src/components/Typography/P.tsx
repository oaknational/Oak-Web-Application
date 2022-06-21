import styled, { CSSProperties } from "styled-components";

import getFontFamily from "../../styles/themeHelpers/getFontFamily";
import color from "../../styles/utils/color";
import { margin, MarginProps } from "../../styles/utils/spacing";
import typography, { TypographyProps } from "../../styles/utils/typography";

import { BodyFontSize } from "./Typography";

type PProps = MarginProps &
  Omit<TypographyProps, "fontSize" | "fontFamily"> & {
    fontSize?: BodyFontSize;
    textAlign?: CSSProperties["textAlign"];
  };
/**
 * Styled `p` (paragraph) component.
 * ## Usage
 * In general, using a `p` as a descendant of `<Body>` should suffice.
 * However, if you want different styles for a particular paragraph,
 * you can use this component to apply additional styles.
 */
const P = styled.p<PProps>`
  ${typography}
  ${margin}
  ${color}
  font-family: ${getFontFamily("body")};
  text-align: ${(props) => props.textAlign};
`;

export default P;
