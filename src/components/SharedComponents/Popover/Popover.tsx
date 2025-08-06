import * as React from "react";
import styled from "styled-components";
import { useOverlay, DismissButton } from "react-aria";
import { FocusOn } from "react-focus-on";

import { zIndexMap } from "@/styles/utils/zIndex";

interface PopoverProps {
  popoverRef?: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  focusOn?: boolean;
}

const Wrapper = styled.div`
  position: absolute;
  top: 100%;
  z-index: ${zIndexMap.modalDialog};
  width: 100%;
  background: white;
`;

export function Popover(props: PopoverProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { popoverRef = ref, isOpen, onClose, children, focusOn = true } = props;

  // Handle events that should cause the popup to close,
  // e.g. blur, clicking outside, or pressing the escape key.
  const { overlayProps } = useOverlay(
    {
      isOpen,
      onClose,
      shouldCloseOnBlur: true,
      isDismissable: false,
    },
    popoverRef,
  );

  // Add a hidden <DismissButton> component at the end of the popover
  // to allow screen reader users to dismiss the popup easily.
  return (
    <FocusOn enabled={focusOn}>
      <Wrapper {...overlayProps} ref={popoverRef}>
        {children}
        <DismissButton onDismiss={onClose} />
      </Wrapper>
    </FocusOn>
  );
}
