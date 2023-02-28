import { FC, useEffect, useRef } from "react";
import { Transition, TransitionStatus } from "react-transition-group";
import styled from "styled-components";

import { useToastContext, SHOW_DURATION } from "../../context/Toast";
import Card from "../Card";
import Flex from "../Flex";
import BrushBorders from "../SpriteSheet/BrushSvgs/BrushBorders";
import Typography from "../Typography";
import theme from "../../styles/theme";
import Icon from "../Icon";

const TRANSITION_DURATION = 500;

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

/**
 * Toasts display brief, temporary notifications.
 * They are noticeable but do not disrupt the user experience and do not require an action to be taken.
 *
 * ## Usage
 * Toasts should only be used for confirmations, simple notifications,
 * and low-priority alerts that do not need to completely interrupt the user experience.
 */

const Toast: FC = () => {
  const { message, shown, hideToast, role } = useToastContext();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shown) {
      const timer = setTimeout(() => {
        hideToast();
      }, SHOW_DURATION);
      return () => clearTimeout(timer);
    }
  }, [shown, hideToast]);

  return (
    <Transition
      nodeRef={ref}
      timeout={TRANSITION_DURATION}
      in={shown}
      unmountOnExit
    >
      {(state) => (
        <ToastCard
          ref={ref}
          state={state}
          $background="teachersPastelYellow"
          $width={["100%", "auto"]}
          $left={[0, "40%", "50%"]}
          role={role}
        >
          <BrushBorders color="teachersPastelYellow" />
          <Flex $alignItems={"center"}>
            <Icon
              name="tick"
              size={36}
              variant={"brush"}
              $background={"white"}
              $color={"pupilsHighlight"}
            />
            <Typography $color={"black"} $font={"heading-7"} $ml={16}>
              {message}
            </Typography>
          </Flex>
        </ToastCard>
      )}
    </Transition>
  );
};

export default Toast;
