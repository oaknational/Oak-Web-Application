import { FC, ReactNode, RefObject } from "react";
import { FocusScope } from "react-aria";

import Flex from "../Flex";

import { DialogModalSize, OverlayProps, UnderlayProps } from "./useModalDialog";

type ModalDialogProps = {
  underlayProps: UnderlayProps;
  overlayProps: OverlayProps;
  children: ReactNode;
  innerRef: RefObject<HTMLDivElement>;
  size: DialogModalSize;
};
const ModalDialog: FC<ModalDialogProps> = (props) => {
  const { children, size, innerRef, underlayProps, overlayProps } = props;

  return (
    <Flex
      $position="fixed"
      $zIndex="modalDialog"
      $cover
      $background="grey4"
      $alignItems="center"
      $justifyContent="center"
      {...underlayProps}
    >
      <FocusScope contain restoreFocus autoFocus>
        <Flex
          {...overlayProps}
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
      </FocusScope>
    </Flex>
  );
};

export default ModalDialog;
