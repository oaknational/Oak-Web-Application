import styled, { css } from "styled-components";

import { margin, MarginProps } from "../../styles/utils/spacing";
import typography, { TypographyProps } from "../../styles/utils/typography";

const pSizes = {
  56: "56px",
  48: "48px",
  40: "40px",
  32: "32px",
  24: "24px",
  20: "20px",
  16: "16px",
};
export const pDefaults = css`
  font-weight: 400;
  font-family: ABeeZee, sans-serif;
  line-height: 1.4;
`;

type PProps = TypographyProps & MarginProps & { fontSize: keyof typeof pSizes };

const P = styled.p<PProps>`
  ${pDefaults}
  ${typography}
  ${margin}
`;

export default P;
