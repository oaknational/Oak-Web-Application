import styled, { css } from "styled-components";

import { OakColorName } from "../../styles/theme";
import getColorByName from "../../styles/themeHelpers/getColorByName";
import Svg from "../Svg";

const FocusUnderline = styled(Svg).attrs({ name: "underline-1" })<{
  $color: OakColorName;
}>`
  color: ${(props) => getColorByName(props.$color)};
  position: absolute;
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

  :focus ${FocusUnderline} {
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
