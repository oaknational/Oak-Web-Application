import { css } from "styled-components";

const oakStyles = css`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: sans-serif;
    font-family: ABeeZee, sans-serif;
    line-height: 1.4;
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
`;

export default oakStyles;
