import { css } from "styled-components";

const oakStyles = css`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: sans-serif;
  }

  body,
  #__next {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  a {
    color: inherit;
    text-decoration: none;
    font-family: inherit;
  }

  * {
    box-sizing: border-box;
  }
`;

export default oakStyles;
