import styled, { css } from "styled-components";
import { OakSvg } from "@oaknational/oak-components";

import { OakColorName } from "@/styles/theme";
import getColorByName from "@/styles/themeHelpers/getColorByName";

export const IconFocusUnderline = styled(OakSvg).attrs({ name: "underline" })<{
  $color: OakColorName;
}>`
  color: ${(props) => getColorByName(props.$color)};
  position: absolute;
  width: 100%;
`;

export const iconFocusUnderline = css`
  ${IconFocusUnderline} {
    display: none;
  }

  :focus ${IconFocusUnderline} {
    display: block;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 8px;
    transform: rotate(-2deg);
    filter: drop-shadow(1px 2px 0 rgb(0 0 0));
  }
`;
