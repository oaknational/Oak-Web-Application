import { OakBox } from "@oaknational/oak-components";
import styled from "styled-components";

const FocusIndicator = styled(OakBox)<{
  disableMouseHover?: boolean;
  subFocus?: boolean;
}>`
  border-radius: 0.25rem;
  box-shadow: ${(props) =>
    props.subFocus ? `rgb(87, 87, 87) 0px 0px 0px 0.125rem` : "none"};
  z-index: ${(props) => (props.subFocus ? "2" : "")};

  &:focus-visible {
    z-index: 2;
    box-shadow:
      rgb(255, 229, 85) 0px 0px 0px 0.125rem,
      rgb(87, 87, 87) 0px 0px 0px 0.3rem;
  }

  &:has(button:hover),
  &:has(button:hover:not(:focus, :active)) {
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
    box-shadow:
      rgb(255, 229, 85) 0.125rem 0.125rem 0px,
      rgb(87, 87, 87) 0.25rem 0.25rem 0px;
  }
`;

export default FocusIndicator;
