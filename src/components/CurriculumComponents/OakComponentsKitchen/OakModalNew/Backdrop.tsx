import { OakBox } from "@oaknational/oak-components";
import { TransitionStatus } from "react-transition-group";
import styled from "styled-components";

import { TRANSITION_DURATION } from "./constants";

type BackdropProps = {
  state: TransitionStatus;
};
export const Backdrop = styled(OakBox)<BackdropProps>`
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  pointer-events: none;
  background: rgba(34, 34, 34, 0.4);
  transition: opacity ${TRANSITION_DURATION}ms ease-in-out;
  will-change: opacity;
  opacity: ${(props) => {
    switch (props.state) {
      case "entering":
        return "1";
      case "entered":
        return "1";
      case "exiting":
        return "0";
      case "exited":
        return "0";
    }
  }};
`;
