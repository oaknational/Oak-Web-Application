import { FC, MutableRefObject, ReactNode, RefObject } from "react";
import { FocusOn } from "react-focus-on";

import Flex from "../Flex";

import { DialogModalSize, OverlayProps, UnderlayProps } from "./useModalDialog";

type ModalDialogProps = {
  underlayProps: UnderlayProps;
  overlayProps: OverlayProps;
  titleProps: { id: string };
  children: ReactNode;
  innerRef: RefObject<HTMLDivElement>;
  size: DialogModalSize;
  returnFocusRef?: MutableRefObject<HTMLButtonElement | null>;
};
const ModalDialog: FC<ModalDialogProps> = (props) => {
  const {
    children,
    size,
    innerRef,
    underlayProps,
    overlayProps,
    titleProps,
    returnFocusRef,
  } = props;

  return (
    <Flex
      $position="fixed"
      $zIndex="modalDialog"
      $cover
      $background="grey40"
      $alignItems="center"
      $justifyContent="center"
      {...underlayProps}
    >
      <FocusOn
        onDeactivation={() => {
          /**
           * @todo shouldn't need to do this, once react-aria OverlayProvider
           * is removed
           * Without the zero-timeout, focus will likely remain on the button/control
           * you used to set isFocusLockDisabled = true
           */
          window.setTimeout(() => returnFocusRef?.current?.focus(), 0);
        }}
      >
        <Flex
          {...overlayProps}
          aria-labelledby={titleProps.id}
          ref={innerRef}
          $background={"white"}
          $color={"black"}
          $pa={[16, 32]}
          $position={size === "fullscreen" ? "absolute" : "relative"}
          $cover={size === "fullscreen" ? true : false}
          $width={size === "small" ? ["100%", 480] : undefined}
          $overflowY="scroll"
          $overflowX="hidden"
        >
          {children}
        </Flex>
      </FocusOn>
    </Flex>
  );
};

export default ModalDialog;
