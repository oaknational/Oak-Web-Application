import { OakBox, OakFlex, OakHeading } from "@oaknational/oak-components";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { CurriculumModalCloseButton } from "../../CurriculumModalCloseButton";

import { usePrevious } from "@/hooks/usePrevious";

const Dialog = styled("dialog")`
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

  ::backdrop {
    padding: 0;
    margin: 0;
    background: none;
  }
`;

/**
 * Singleton overriding of `overflow` and `paddingRight`
 */
let refEl: Element | null = null;
const singletonSet = (el: Element | null, open: boolean) => {
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

type ModalProps = {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
};
export function OakModalNew({ open, children, onClose }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const prevOpen = usePrevious(open);

  useEffect(() => {
    const el = ref.current;
    if (open) {
      singletonSet(el, true);
      if (el) el.showModal();
    } else if (!open && prevOpen) {
      singletonSet(ref.current, false);
      if (el) el.close();
    }
    return () => {
      singletonSet(el, false);
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
    <Dialog
      ref={ref}
      data-testid="modal"
      style={{
        // TODO: This is 'modal-dialog' from oak-components
        zIndex: 320,
      }}
    >
      {children}
    </Dialog>
  );
}

type ModalContentProps = {
  title: React.ReactNode;
  content: React.ReactNode;
  footer: React.ReactNode;
  onClose: () => void;
};
export function ModalContent({
  title,
  content,
  footer,
  onClose,
}: ModalContentProps) {
  return (
    <>
      <OakFlex
        $pa={"inner-padding-m"}
        $position={"relative"}
        $justifyContent={"center"}
        $alignItems={"center"}
        $borderColor={"grey30"}
      >
        {title && (
          <OakHeading tag="h3" $font={"heading-1"} data-testid="modal-title">
            {title}
          </OakHeading>
        )}
        <OakBox $position={"absolute"} $right={"all-spacing-4"}>
          <CurriculumModalCloseButton
            ariaLabel="Close"
            onClose={() => onClose()}
          />
        </OakBox>
      </OakFlex>
      <OakFlex
        data-testid="modal-content"
        $flexShrink={1}
        $overflowY={"auto"}
        $flexGrow={1}
        $flexDirection={"column"}
        $position={"relative"}
        style={{
          scrollbarGutter: "stable",
        }}
      >
        {content}
      </OakFlex>
      <OakFlex
        data-testid="modal-footer"
        $width={"100%"}
        $background={"white"}
        $ph={"inner-padding-m"}
        $pv={"inner-padding-s"}
        $justifyContent={"left"}
        $bt={"border-solid-s"}
        $borderColor={"grey30"}
      >
        {footer}
      </OakFlex>
    </>
  );
}
