import React, { FC } from "react";
import styled from "styled-components";
import { OakBox, oakBoxCss, OakBoxProps } from "@oaknational/oak-components";

import IconButton from "@/components/SharedComponents/Button/IconButton";

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
      <IconButton
        variant="minimal"
        icon="cross"
        onClick={onClose}
        aria-label={ariaLabel}
        size="large"
        data-testid="close-modal-button"
      />
    </CurriculumModalCloseButtonBox>
  );
};
