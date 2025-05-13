import { OakFlex } from "@oaknational/oak-components";
import { ComponentProps } from "react";
import { Transition } from "react-transition-group";

import { AnimateSlideIn, AnimateSlideInProps } from "./AnimateSlideIn";
import { TRANSITION_DURATION } from "./constants";
import { Backdrop } from "./Backdrop";
import { Dialog } from "./Dialog";
import { ModalContent } from "./Content";

type OakModalNewProps = {
  animateFrom?: AnimateSlideInProps["direction"];
  open: boolean;
  title: React.ReactNode;
  content: React.ReactNode;
  footer: React.ReactNode;
  onClose: () => void;
  modalWidth?: ComponentProps<typeof OakFlex>["width"];
};
export function OakModalNew({
  open,
  onClose,
  title,
  content,
  footer,
  animateFrom = "right",
  modalWidth = "100%",
}: OakModalNewProps) {
  return (
    <Transition in={open} timeout={TRANSITION_DURATION} unmountOnExit={false}>
      {(animationState) => {
        return (
          <Dialog open={open} onClose={onClose}>
            <Backdrop state={animationState} $zIndex="modal-dialog" />
            <AnimateSlideIn
              direction={animateFrom}
              data-testid={"sidebar-modal"}
              $position="fixed"
              $top="all-spacing-0"
              $right="all-spacing-0"
              $height="100%"
              $width={modalWidth}
              $maxWidth="100%"
              $background={"white"}
              state={animationState}
              $zIndex="modal-dialog"
            >
              <OakFlex
                $flexDirection={"column"}
                $minWidth={"100%"}
                $flexGrow={1}
              >
                <ModalContent
                  title={title}
                  content={content}
                  footer={footer}
                  onClose={onClose}
                />
              </OakFlex>
            </AnimateSlideIn>
          </Dialog>
        );
      }}
    </Transition>
  );
}
