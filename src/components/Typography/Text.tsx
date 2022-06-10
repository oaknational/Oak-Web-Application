import styled, { css } from "styled-components";

import { margin, MarginProps } from "../../styles/utils/spacing";
import typography, { TypographyProps } from "../../styles/utils/typography";

const textSizes = {
  18: "18px",
  16: "16px",
  14: "14px",
  12: "12px",
};

export type TextSize = keyof typeof textSizes;
export const text = css<{ size?: TextSize; lineClamp?: number }>`
  font-family: ABeeZee, sans-serif;
  line-height: 1.4;
  ${({ lineClamp }) =>
    typeof lineClamp === "number" &&
    css`
      display: -webkit-box;
      -webkit-line-clamp: ${lineClamp};
      -webkit-box-orient: vertical;
      overflow: hidden;
    `}
`;

type TextProps = TypographyProps &
  MarginProps & {
    fontSize?: TextSize;
    lineClamp?: number;
  };
/**
 * Wrapper component from which children inherit typography styles.
 * ## Usage
 * Use this component whenever you want multiple paragraphs of the
 * same style.
 */
const Text = styled.div<TextProps>`
  ${text}
  ${margin}
  ${typography}
`;

export default Text;
