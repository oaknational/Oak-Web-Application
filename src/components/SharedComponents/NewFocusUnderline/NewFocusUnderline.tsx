import styled, { css } from "styled-components";
import { OakSvg } from "@oaknational/oak-components";

const NewFocusUnderline = styled(OakSvg).attrs({
  name: "underline-3",
  color: "black",
})`
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
