/**
 * This is our global stylesheet. It's for resets in addition to reset.styles.ts
 * which is taken from a publically available reset. We want to minimise global
 * styles where possible so if you add any styles here please comment with what
 * they are doing and why they belong here (rather than in component specific
 * styles)
 */

import { css } from "styled-components";

const oakStyles = css`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: Lexend, sans-serif;
    font-weight: 300;
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

    /*
     * Remove grey background on tap on ios
     */
    -webkit-tap-highlight-color: transparent;
  }

  button {
    /*
     * some browsers have a small margin by default
     * @see https://github.com/oaknational/Oak-Web-Application/issues/709
     */
    margin: 0;

    /*
     * Remove grey background on tap on ios
     */
    -webkit-tap-highlight-color: transparent;
  }

  /*
  * Inline styling for mathjax equations
  */
  mjx-container {
    display: inline-grid !important;
    margin: 0 !important;
  }
`;

export default oakStyles;
