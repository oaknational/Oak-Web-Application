import { TransitionStatus } from "react-transition-group";
import styled from "styled-components";
import { OakFlex } from "@oaknational/oak-components";

import { TRANSITION_DURATION } from "./constants";

export type AnimateSlideInProps = {
  state: TransitionStatus;
  direction: "bottom" | "right";
};

export const AnimateSlideIn = styled(OakFlex)<AnimateSlideInProps>`
  transition: transform ${TRANSITION_DURATION}ms ease-in-out;
  will-change: transform;
  transform: ${(props) => {
    switch (props.state) {
      case "entering":
        return "translate3D(0, 0, 0)";
      case "entered":
        return "translate3D(0, 0, 0)";
      case "exiting":
        if (props.direction === "right") {
          return "translate3D(100%, 0, 0)";
        } else {
          return "translate3D(0, 100%, 0)";
        }
      case "exited":
        if (props.direction === "right") {
          return "translate3D(100%, 0, 0)";
        } else {
          return "translate3D(0, 100%, 0)";
        }
    }
  }};
`;
