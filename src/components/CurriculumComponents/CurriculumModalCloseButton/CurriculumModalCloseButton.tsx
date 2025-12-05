import React, { FC } from "react";
import styled from "styled-components";
import {
  OakBox,
  oakBoxCss,
  OakBoxProps,
  OakTertiaryInvertedButton,
} from "@oaknational/oak-components";

type CurriculumModalCloseButtonProps = OakBoxProps & {
  onClose: () => void;
  ariaLabel?: string;
};

const CurriculumModalCloseButtonBox = styled(OakBox)<OakBoxProps>`
  ${oakBoxCss}
`;
export const CurriculumModalCloseButton: FC<
  CurriculumModalCloseButtonProps
> = ({ onClose, ariaLabel = "Close subject modal", ...boxProps }) => {
  return (
    <CurriculumModalCloseButtonBox {...boxProps}>
      <OakTertiaryInvertedButton
        iconName="cross"
        onClick={onClose}
        data-testid="close-modal-button"
        aria-label={ariaLabel}
      />
    </CurriculumModalCloseButtonBox>
  );
};
