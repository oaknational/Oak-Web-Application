import { OakFlex } from "@oaknational/oak-components";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";

import { AnimateSlideIn, AnimateSlideInProps } from "./AnimateSlideIn";
import { TRANSITION_DURATION } from "./constants";
import { Backdrop } from "./Backdrop";
import { Dialog } from "./Dialog";
import { ModalContent } from "./Content";

// Duplicated from <https://github.com/oaknational/oak-components/blob/af659cdf62b9feeff27a5f92272f695fb0c476d5/src/animation/usePrefersReducedMotion.ts#L10>
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  return prefersReducedMotion;
}

type OakModalNewProps = {
  animateFrom?: AnimateSlideInProps["direction"];
  open: boolean;
  title: React.ReactNode;
  content: React.ReactNode;
  footer: React.ReactNode;
  onClose: ComponentProps<typeof ModalContent>["onClose"];
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
  const ref = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <CSSTransition
      nodeRef={ref}
      in={open}
      timeout={prefersReducedMotion ? 0 : TRANSITION_DURATION}
      unmountOnExit={false}
    >
      {(animationState) => {
        return (
          <Dialog ref={ref} open={open} onClose={onClose}>
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
    </CSSTransition>
  );
}
