import styled, { css } from "styled-components";
import { OakSvg } from "@oaknational/oak-components";

import { OakColorName } from "@/styles/theme";
import getColorByName from "@/styles/themeHelpers/getColorByName";

const FocusUnderline = styled(OakSvg).attrs({ name: "underline" })<{
  $color: OakColorName;
}>`
  color: ${(props) => getColorByName(props.$color)};
  position: absolute;
  width: 100%;
`;

export const focusUnderlineStyles = css`
  position: relative;
  display: inline-block;

  ${FocusUnderline} {
    display: none;
  }

  :focus {
    outline: none;
  }

  :focus-visible ${FocusUnderline} {
    position: absolute;
    display: block;
    right: 0;
    left: 0;
    bottom: -3px;
    height: 7px;
    filter: drop-shadow(1px 5px 0 rgb(0 0 0));
  }
`;

export default FocusUnderline;
