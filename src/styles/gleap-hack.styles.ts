import { css } from "styled-components";

const posthogHackStyles = css`
  /* 
   * Hacks to keep gleap button have pointer-events when modals are open
   */
  div[class^="bb-feedback-button"] {
    pointer-events: initial;
  }

  .gleap-frame-container {
    bottom: 66px !important;
  }
`;

export default posthogHackStyles;
