import { css } from "styled-components";

const posthogHackStyles = css`
  /* 
   * Styles for Posthog survey
   * These styles help manage z-index conflicts with PostHog surveys
   * https://www.notion.so/oaknationalacademy/Popup-survey-cannot-be-dismissed-when-lot-picker-is-open-mobile-17426cc4e1b180d184b5c34608e88846?pvs=4
   */
  div[class^="PostHogSurvey"] {
    z-index: 298 !important;
  }
`;

export default posthogHackStyles;
