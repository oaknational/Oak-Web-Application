import Link, { LinkProps } from "next/link";
import styled, { CSSProperties } from "styled-components";

import { margin, MarginProps } from "../../styles/utils/spacing";
import typography, { TypographyProps } from "../../styles/utils/typography";

import { BodyFontSize } from "./Typography";

type AProps = MarginProps &
  LinkProps &
  Omit<TypographyProps, "fontSize" | "fontFamily"> & {
    fontSize?: BodyFontSize;
    textAlign?: CSSProperties["textAlign"];
  };
/**
 * Styled `a` (next/link) (anchor) component.
 * ##
 */

const A = styled(Link)<AProps>`
  ${typography}
  ${margin};
  text-align: ${(props) => props.textAlign};
`;

export default A;
