import styled, { css } from "styled-components";

import { margin, MarginProps } from "../../styles/utils/spacing";
import typography, { TypographyProps } from "../../styles/utils/typography";

const pSizes = {
  18: "18px",
  16: "16px",
  14: "14px",
  12: "12px",
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
