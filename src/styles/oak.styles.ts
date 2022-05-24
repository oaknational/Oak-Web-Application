import { css } from "styled-components";

const oakStyles = css`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: sans-serif;
  }

  /* stylelint-disable */
  body,
  #__next {
    /* stylelint-enable */
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
    font-family: ABeeZee, sans-serif;
    line-height: 1.4;
  }
`;

export default oakStyles;
