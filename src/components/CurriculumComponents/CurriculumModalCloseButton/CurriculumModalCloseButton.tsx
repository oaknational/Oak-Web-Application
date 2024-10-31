import React, { FC } from "react";

import Box from "@/components/SharedComponents/Box";
import IconButton from "@/components/SharedComponents/Button/IconButton";

type CurriculumModalCloseButtonProps = {
  onClose: () => void;
};

export const CurriculumModalCloseButton: FC<
  CurriculumModalCloseButtonProps
> = ({ onClose }) => {
  return (
    <Box $position={"absolute"} $top={[16, 32]} $right={[16, 32]}>
      <IconButton
        variant="minimal"
        icon="cross"
        onClick={onClose}
        aria-label="close subject modal"
        size="small"
        data-testid="close-modal-button"
      />
    </Box>
  );
};
