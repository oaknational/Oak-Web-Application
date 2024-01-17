import styled, { css } from "styled-components";

import Svg from "@/components/SharedComponents/Svg";

const NewFocusUnderline = styled(Svg).attrs({ name: "underline-3" })`
  position: absolute;
`;

export const newFocusUnderlineStyles = css`
  position: relative;
  display: inline-block;
  width: fit-content;

  ${NewFocusUnderline} {
    display: none;
  }

  :focus {
    outline: none;
  }

  :focus ${NewFocusUnderline} {
    position: absolute;
    display: block;
    right: 0;
    left: 0;
    bottom: -3px;
    height: 7px;
    width: 100%;
  }
`;

export default NewFocusUnderline;
