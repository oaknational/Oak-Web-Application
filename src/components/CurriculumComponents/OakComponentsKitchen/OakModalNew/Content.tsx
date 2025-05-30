import { OakBox, OakFlex, OakHeading } from "@oaknational/oak-components";

import { CurriculumModalCloseButton } from "../../CurriculumModalCloseButton";

export type CloseAction = "close_button" | undefined;

type ModalContentProps = {
  title: React.ReactNode;
  content: React.ReactNode;
  footer: React.ReactNode;
  onClose: (action?: CloseAction) => void;
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
        <OakBox
          $position={"absolute"}
          $right={"all-spacing-4"}
          $top={"all-spacing-4"}
          $zIndex={"in-front"}
        >
          <CurriculumModalCloseButton
            ariaLabel="Close"
            onClose={() => onClose("close_button")}
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
      {footer && (
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
      )}
    </>
  );
}
