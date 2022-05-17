import { createGlobalStyle } from "styled-components";

import resetStyles from "./reset.styles";
import oakStyles from "./oak.styles";

const GlobalStyle = createGlobalStyle`
  ${resetStyles}
  ${oakStyles}
`;

export default GlobalStyle;
