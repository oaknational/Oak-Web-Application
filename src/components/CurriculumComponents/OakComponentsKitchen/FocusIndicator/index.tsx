import { OakBox } from "@oaknational/oak-components";
import styled from "styled-components";

const FocusIndicator = styled(OakBox)<{
  disableMouseHover?: boolean;
  subFocus?: boolean;
}>`
  box-shadow: ${(props) =>
    props.subFocus ? `rgb(87, 87, 87) 0px 0px 0px 0.125rem` : "none"};
  z-index: ${(props) => (props.subFocus ? "2" : "")};

  &:has(button:focus-visible) {
    border-radius: 0.25rem;
    z-index: 2;
    box-shadow:
      rgb(255, 229, 85) 0px 0px 0px 0.125rem,
      rgb(87, 87, 87) 0px 0px 0px 0.3rem;
  }

  &:has(button:hover),
  &:has(button:hover:not(:focus-visible, :active)) {
    z-index: 1;
    box-shadow: ${(props) =>
      props.disableMouseHover
        ? ""
        : `rgb(255, 229, 85) 0.125rem 0.125rem 0px;`};
  }
  &:has(button:hover) {
    box-shadow: none;
  }
  &:has(button:active) {
    z-index: 2;
    background: transparent;
    box-shadow:
      rgb(255, 229, 85) 0.125rem 0.125rem 0px,
      rgb(87, 87, 87) 0.25rem 0.25rem 0px;
  }
`;

export default FocusIndicator;
