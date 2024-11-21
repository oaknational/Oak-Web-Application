import React, { FC } from "react";
import styled from "styled-components";

import Box, { box, BoxProps } from "@/components/SharedComponents/Box";
import IconButton from "@/components/SharedComponents/Button/IconButton";

type CurriculumModalCloseButtonProps = BoxProps & {
  onClose: () => void;
  ariaLabel?: string;
};

const CurriculumModalCloseButtonBox = styled(Box)<BoxProps>`
  ${box}
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
