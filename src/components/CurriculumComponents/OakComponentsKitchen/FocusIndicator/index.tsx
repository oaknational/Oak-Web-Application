import { OakBox } from "@oaknational/oak-components";
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
    props.subFocus ? `rgb(87, 87, 87) 0px 0px 0px 0.125rem` : "none"};
  z-index: ${(props) => (props.subFocus ? "2" : "")};

  &:has(
      a${isJSDOM() ? "" : ":focus-visible"},
        button${isJSDOM() ? "" : ":focus-visible"}
    ) {
    border-radius: 0.25rem;
    z-index: 2;
    box-shadow:
      rgb(255, 229, 85) 0px 0px 0px 0.125rem,
      rgb(87, 87, 87) 0px 0px 0px 0.3rem;
  }

  &:has(a:hover, button:hover),
  &:has(button:hover:not(:active${isJSDOM() ? "" : ", :focus-visible"})) {
    z-index: 1;
    background-color: ${(props) => (props.disableMouseHover ? "" : `#f2f2f2;`)};
  }
  &:has(a:hover, button:hover) {
    box-shadow: ${(props) =>
      props.subFocus ? `rgb(87, 87, 87) 0px 0px 0px 0.125rem` : "none"};
  }
  &:has(a:active, button:active) {
    z-index: 2;
    box-shadow: ${(props) =>
      props.disableActive
        ? ""
        : "rgb(255, 229, 85) 0.125rem 0.125rem 0px, rgb(87, 87, 87) 0.25rem 0.25rem 0px;"};
  }
`;

export default FocusIndicator;
