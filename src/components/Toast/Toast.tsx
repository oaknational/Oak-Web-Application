import { FC, useEffect } from "react";
import { Transition, TransitionStatus } from "react-transition-group";
import styled from "styled-components";

import { useToastContext } from "../../context/Toast";
import IconButtonInner from "../Button/IconButtonInner";
import Card from "../Card";
import Flex from "../Flex";
import BrushBorders from "../SpriteSheet/BrushSvgs/BrushBorders";
import Typography from "../Typography";
import theme from "../../styles/theme";

const TRANSITION_DURATION = 500;
const SHOW_DURATION = 3500;

type TransitionProps = {
  state: TransitionStatus;
};

const ToastCard = styled(Card)<TransitionProps>`
  position: absolute;
  transition: transform ${TRANSITION_DURATION}ms ease-in-out;
  transform: ${(props) => {
    switch (props.state) {
      case "entering":
        return `translate3D(0, ${48 + theme.header.height}px, 0)`;
      case "entered":
        return `translate3D(0, ${48 + theme.header.height}px, 0)`;
      case "exiting":
        return "translate3D(0, -100%, 0)";
      case "exited":
        return "translate3D(0, -100%, 0)";
    }
  }};
`;

type ToastProps = {
  role: "alert" | "status";
};

/**
 * Toasts display brief, temporary notifications.
 * They are noticeable but do not disrupt the user experience and do not require an action to be taken.
 *
 * ## Usage
 * Toasts should only be used for confirmations, simple notifications,
 * and low-priority alerts that do not need to completely interrupt the user experience.
 */

const Toast: FC<ToastProps> = ({ role }) => {
  const { message, shown, hideToast } = useToastContext();

  useEffect(() => {
    if (shown) {
      const timer = setTimeout(() => {
        hideToast();
      }, SHOW_DURATION);
      return () => clearTimeout(timer);
    }
  }, [shown, hideToast]);

  return (
    <Transition timeout={TRANSITION_DURATION} in={shown} unmountOnExit>
      {(state) => (
        <ToastCard
          state={state}
          $background="teachersPastelYellow"
          $width={["100%", "auto"]}
          $left={[0, "40%", "50%"]}
          role={role}
        >
          <BrushBorders color="teachersPastelYellow" />
          <Flex $alignItems={"center"}>
            <IconButtonInner
              icon={"Tick"}
              size={"small"}
              variant={"brush"}
              background={"white"}
            />
            <Typography $color={"black"} $fontFamily={"ui"} $ml={16}>
              {message}
            </Typography>
          </Flex>
        </ToastCard>
      )}
    </Transition>
  );
};

export default Toast;
