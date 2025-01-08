import { FC, useEffect, useRef } from "react";
import { Transition, TransitionStatus } from "react-transition-group";
import styled from "styled-components";

import { OakTypography, OakFlex, OakIcon } from "@oaknational/oak-components";
import { useToastContext, SHOW_DURATION } from "@/context/Toast";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import theme from "@/styles/theme";
import Card from "@/components/SharedComponents/Card";

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
          $background="lemon50"
          $width={["100%", "auto"]}
          $left={[0, "40%", "50%"]}
          role={role}
        >
          <BrushBorders color="lemon50" />
          <OakFlex $alignItems={"center"}>
            <OakIcon
              iconName="tick"
              $width={"space-between-m2"}
              $background={"white"}
            />
            <OakTypography
              $color={"black"}
              $font={"heading-7"}
              $ml="space-between-s"
            >
              {message}
            </OakTypography>
          </OakFlex>
        </ToastCard>
      )}
    </Transition>
  );
};

export default Toast;
