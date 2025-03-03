"use client";
import { createGlobalStyle, css } from "styled-components";

import resetStyles from "./reset.styles";
import oakStyles from "./oak.styles";
import posthogHackStyles from "./posthog-hack.styles";

type GlobalStyleProps = {
  fontFamily: string;
};

const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
  ${resetStyles}
  ${oakStyles}
  ${posthogHackStyles}
  ${(props) => {
    return css`
      :root {
        --google-font: ${props.fontFamily};
      }
      body {
        font-family: var(--google-font), sans-serif;
      }
    `;
  }}
`;

export default GlobalStyle;
