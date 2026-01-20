import {
  OakBox,
  oakDefaultTheme,
  oakDropShadowTokens,
} from "@oaknational/oak-components";
import styled from "styled-components";

function isJSDOM() {
  return globalThis?.navigator?.userAgent?.includes("jsdom/");
}

const FocusIndicator = styled(OakBox)<{
  disableMouseHover?: boolean;
  subFocus?: boolean;
  disableActive?: boolean;
}>`
  box-shadow: ${(props) =>
    props.subFocus
      ? `${oakDropShadowTokens["drop-shadow-centered-grey"]}`
      : "none"};
  z-index: ${(props) => (props.subFocus ? "2" : "")};

  &:has(
      a${isJSDOM() ? "" : ":focus-visible"},
        button${isJSDOM() ? "" : ":focus-visible"}
    ) {
    border-radius: ${(props) => props.$borderRadius ?? "0.25em;"};
    z-index: 2;
    box-shadow: ${oakDropShadowTokens["drop-shadow-centered-lemon"]},
      ${oakDropShadowTokens["drop-shadow-centered-grey"]};
  }

  &:has(a:hover, button:hover),
  &:has(button:hover:not(:active${isJSDOM() ? "" : ", :focus-visible"})) {
    z-index: 1;
    background-color: ${(props) =>
      props.disableMouseHover
        ? ""
        : `${oakDefaultTheme.uiColors["bg-neutral"]};`};
  }
  &:has(a:hover, button:hover) {
    box-shadow: ${(props) =>
      props.subFocus
        ? oakDropShadowTokens["drop-shadow-centered-grey"]
        : "none"};
  }
  &:has(a:active, button:active) {
    z-index: 2;
    box-shadow: ${(props) =>
      props.disableActive
        ? ""
        : `${oakDropShadowTokens["drop-shadow-lemon"]}, ${oakDropShadowTokens["drop-shadow-grey"]};`};
  }
`;

export default FocusIndicator;
