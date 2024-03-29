import styled, { css } from "styled-components";

import { OakColorName } from "@/styles/theme";
import getColorByName from "@/styles/themeHelpers/getColorByName";
import Svg from "@/components/SharedComponents/Svg";

export const HomePageTabFocusUnderline = styled(Svg).attrs({
  name: "underline-1",
})<{
  $color: OakColorName;
}>`
  color: ${(props) => getColorByName(props.$color)};
  position: absolute;
`;

export const newIconFocusUnderline = css`
  ${HomePageTabFocusUnderline} {
    display: none;
  }

  :focus ${HomePageTabFocusUnderline} {
    display: block;
    top: 100%;
    left: 0;
    width: 100%;
    height: 8px;
    transform: rotate(-2deg);
    filter: drop-shadow(1px 2px 0 rgb(0 0 0));
  }
`;
