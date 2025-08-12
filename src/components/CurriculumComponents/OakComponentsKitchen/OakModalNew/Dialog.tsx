import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import styled from "styled-components";

import { usePrevious } from "@/hooks/usePrevious";

const DialogBase = styled("dialog")`
  border: none;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  background: none;
  display: block;

  :not([open]) {
    pointer-events: none;
  }

  &::backdrop {
    padding: 0;
    margin: 0;
    background: none;
  }
`;

/**
 * Singleton way of setting body state, so multiple modals don't conflict
 */
let refEl: Element | null = null;
const setBodyState = (el: Element | null, open: boolean) => {
  if (open) {
    const scrollBarWidth = window.innerWidth - document.body.offsetWidth;
    document.body.style.paddingRight = `${scrollBarWidth}px`;
    document.body.style.overflow = "hidden";
  } else if (!open && el === refEl) {
    document.body.style.paddingRight = "0px";
    document.body.style.overflow = "";
  }
  refEl = el;
};

type DialogProps = {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
};
export const Dialog = forwardRef(
  (
    { open, children, onClose }: DialogProps,
    passedRef: ForwardedRef<HTMLDialogElement>,
  ) => {
    const ref = useRef<HTMLDialogElement>(null);

    // See <https://www.carlrippon.com/using-a-forwarded-ref-internally/>
    useImperativeHandle<HTMLDialogElement | null, HTMLDialogElement | null>(
      passedRef,
      () => ref.current,
    );

    const prevOpen = usePrevious(open);

    useEffect(() => {
      const el = ref.current;
      if (open) {
        setBodyState(el, true);
        if (el) el.showModal();
      } else if (!open && prevOpen) {
        setBodyState(ref.current, false);
        if (el) el.close();
      }
      return () => {
        setBodyState(el, false);
      };
    }, [ref, open, prevOpen]);

    useEffect(() => {
      if (ref.current) {
        const el = ref.current;

        const onBackdropClose = (e: Event) => {
          if (e.target instanceof Element && e.target.nodeName === "DIALOG") {
            onClose();
          }
        };

        el.addEventListener("close", onClose);
        el.addEventListener("click", onBackdropClose);

        return () => {
          el.removeEventListener("close", onClose);
          el.removeEventListener("click", onBackdropClose);
        };
      }
    }, [ref, onClose]);

    return (
      <DialogBase
        ref={ref}
        data-testid="modal"
        style={{
          // TODO: This is 'modal-dialog' from oak-components
          zIndex: 320,
        }}
      >
        {children}
      </DialogBase>
    );
  },
);
