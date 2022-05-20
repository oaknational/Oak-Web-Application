import { css } from "styled-components";

/**
 * @todo get these from theme
 */

const reset = css`
  all: initial;
`;
const headingSizes = {
  1: "56px",
  2: "48px",
  3: "40px",
  4: "32px",
  5: "24px",
  6: "20px",
  7: "16px",
};
export type HeadingSize = keyof typeof headingSizes;
export const heading = css<{ size: HeadingSize }>`
  ${reset}
  font-family: Lexend, sans-serif;
  line-height: 1.2;
  font-size: ${(props) => headingSizes[props.size]};
`;
const textSizes = {
  1: "18px",
  2: "16px",
  3: "14px",
  4: "12px",
};
export type TextSize = keyof typeof textSizes;
export const text = css<{ size?: TextSize }>`
  ${reset}
  font-family: ABeeZee, sans-serif;
  line-height: 1.4;
  font-size: ${({ size = 1 }) => textSizes[size]};
`;
