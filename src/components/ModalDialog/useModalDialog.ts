import { useRef } from "react";
import {
  useOverlay,
  usePreventScroll,
  useModal,
  useDialog,
  useKeyboard,
  AriaDialogProps,
  AriaOverlayProps,
  OverlayAria,
  DialogAria,
  KeyboardResult,
  ModalAria,
  useId,
} from "react-aria";

export type DialogModalSize = "fullscreen" | "small";
export type OverlayProps = OverlayAria["overlayProps"] &
  DialogAria["dialogProps"] &
  KeyboardResult["keyboardProps"] &
  ModalAria["modalProps"];
export type UnderlayProps = OverlayAria["underlayProps"];

type UseModalDialogProps = AriaDialogProps &
  AriaOverlayProps & {
    size: DialogModalSize;
    closeModal?: () => void;
    isOpen: boolean;
  };
const useModalDialog = (props: UseModalDialogProps) => {
  const { closeModal, isDismissable, isKeyboardDismissDisabled, isOpen } =
    props;

  const innerRef = useRef<HTMLDivElement>(null);

  const { overlayProps, underlayProps } = useOverlay(props, innerRef);
  const { modalProps } = useModal();
  const { dialogProps } = useDialog(props, innerRef);
  /**
   * useDialog().titleProps wasn't working correctly, so generating our own
   * titleId
   */
  const titleId = useId();

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      switch (e.key) {
        case "Escape":
          if (isDismissable && isKeyboardDismissDisabled && closeModal) {
            closeModal();
          }
          break;

        default:
          e.continuePropagation();
      }
    },
  });

  usePreventScroll({ isDisabled: !isOpen });

  return {
    ...props,
    underlayProps,
    overlayProps: {
      ...overlayProps,
      ...dialogProps,
      ...modalProps,
      ...keyboardProps,
    },
    titleProps: {
      id: titleId,
    },
    innerRef,
  };
};

export default useModalDialog;
