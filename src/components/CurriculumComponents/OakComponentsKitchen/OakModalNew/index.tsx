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

  ::backdrop {
    padding: 0;
    margin: 0;
  }
`;

type ModalProps = {
  title: React.ReactNode;
  content: React.ReactNode;
  footer: React.ReactNode;
  open: boolean;
  onClose: () => void;
};
export function OakModalNew({
  title,
  content,
  footer,
  open,
  onClose,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const prevOpen = usePrevious(open);

  useEffect(() => {
    if (ref.current) {
      if (open) {
        document.body.style.overflow = "hidden";
        if (!prevOpen) ref.current.showModal();
      } else {
        document.body.style.overflow = "";
        if (prevOpen) ref.current.close();
      }
    }
  }, [ref, open, prevOpen]);

  return (
    <Dialog ref={ref} data-testid="modal">
      <OakFlex $flexDirection={"column"} $background={"white"} $height={"100%"}>
        <OakFlex
          $pa={"inner-padding-m"}
          $position={"relative"}
          $justifyContent={"center"}
          $alignItems={"center"}
          $borderColor={"grey30"}
        >
          <OakHeading tag="h3" $font={"heading-1"} data-testid="modal-title">
            {title}
          </OakHeading>
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
      </OakFlex>
    </Dialog>
  );
}
