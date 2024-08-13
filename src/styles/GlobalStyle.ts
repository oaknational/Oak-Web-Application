import { createGlobalStyle, css } from "styled-components";

import resetStyles from "./reset.styles";
import oakStyles from "./oak.styles";

type GlobalStyleProps = {
  fontFamily: string;
};

const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
  ${resetStyles}
  ${oakStyles}
  ${(props) => {
    return css`
      @property --google-font {
        syntax: "<font>";
        inherits: false;
        initial-value: ${props.fontFamily};
      }
      body {
        font-family: var(--google-font);
      }
    `;
  }}
`;

export default GlobalStyle;
