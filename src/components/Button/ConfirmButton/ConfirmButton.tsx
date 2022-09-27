import { FC } from "react";
import { Transition, TransitionStatus } from "react-transition-group";
import styled from "styled-components";

import IconButton, { IconButtonProps } from "../IconButton";
import IconButtonInner from "../IconButtonInner";

const TRANSITION_DURATION = 500;

type TransitionProps = {
  state: TransitionStatus;
};

const AnimatedButton = styled(IconButton)<TransitionProps>`
  [name="${(props) => props.icon}"] {
    transition: all ${TRANSITION_DURATION}ms ease-in-out;
    opacity: ${(props) => {
      switch (props.state) {
        case "entering":
          return "0";
        case "entered":
          return "0";
        case "exiting":
          return "1";
        case "exited":
          return "1";
      }
    }};
    transform: ${(props) => {
      switch (props.state) {
        case "entering":
          return "rotate(90deg)";
        case "entered":
          return "rotate(90deg)";
        case "exiting":
          return "rotate(0deg)";
        case "exited":
          return "rotate(0deg)";
      }
    }};
  }
`;

const AnimatedTick = styled.div<TransitionProps>`
  position: absolute;
  transition: opacity ${TRANSITION_DURATION}ms ease-in-out;
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

type ConfirmButtonProps = {
  animate: boolean;
};

const ConfirmButton: FC<IconButtonProps & ConfirmButtonProps> = (props) => {
  const { icon, animate } = props;

  return (
    <Transition timeout={TRANSITION_DURATION} in={animate}>
      {(state) => (
        <AnimatedButton {...props} icon={icon} state={state}>
          <AnimatedTick state={state}>
            <IconButtonInner
              icon={"Tick"}
              size={"small"}
              background={"failure"}
              variant={"minimal"}
              iconColorOverride={"white"}
            />
          </AnimatedTick>
        </AnimatedButton>
      )}
    </Transition>
  );
};

export default ConfirmButton;
