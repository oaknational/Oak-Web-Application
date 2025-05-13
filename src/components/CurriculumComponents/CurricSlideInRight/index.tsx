import { TransitionStatus } from "react-transition-group";
import styled from "styled-components";
import { OakBox, OakFlex } from "@oaknational/oak-components";

export type TransitionProps = {
  state: TransitionStatus;
  direction: "bottom" | "right";
};
export const transitionDuration = 250;

const CurricSlideInRight = styled(OakFlex)<TransitionProps>`
  transition: transform ${transitionDuration}ms ease-in-out;
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

export const Backdrop = styled(OakBox)<TransitionProps>`
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  pointer-events: none;
  background: rgba(34, 34, 34, 0.4);
  transition: opacity ${transitionDuration}ms ease-in-out;
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

export default CurricSlideInRight;
