import { OakBox, OakFlex, OakHeading } from "@oaknational/oak-components";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { CurriculumModalCloseButton } from "../../CurriculumModalCloseButton";

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
  onChangeOpen: (isOpen: boolean) => void;
};
export function OakModalNew({
  title,
  content,
  footer,
  open,
  onChangeOpen,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (ref.current) {
      if (open) {
        document.body.style.overflow = "hidden";
        ref.current.showModal();
      } else {
        document.body.style.overflow = "";
        ref.current.close();
      }
    }
  }, [ref, open]);

  return (
    <Dialog ref={ref}>
      <OakFlex $flexDirection={"column"} $background={"white"} $height={"100%"}>
        <OakFlex
          $pa={"inner-padding-m"}
          $position={"relative"}
          $justifyContent={"center"}
          $alignItems={"center"}
          $bb={"border-solid-s"}
          $borderColor={"grey30"}
        >
          <OakHeading tag="h1">{title}</OakHeading>
          <OakBox $position={"absolute"} $right={"all-spacing-4"}>
            <CurriculumModalCloseButton
              ariaLabel="Close"
              onClose={() => onChangeOpen(false)}
            />
          </OakBox>
        </OakFlex>
        <OakFlex
          $flexShrink={1}
          $overflowY={"auto"}
          $flexGrow={1}
          $flexDirection={"column"}
        >
          {content}
        </OakFlex>
        <OakFlex
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
