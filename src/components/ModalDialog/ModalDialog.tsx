import { FC, ReactNode, useRef } from "react";
import {
  useOverlay,
  usePreventScroll,
  useModal,
  OverlayProps,
} from "@react-aria/overlays";
import { useDialog } from "@react-aria/dialog";
import { FocusScope } from "@react-aria/focus";
import { AriaDialogProps } from "@react-types/dialog";

type ModalDialogProps = AriaDialogProps &
  OverlayProps & {
    title: string;
    children: ReactNode;
  };
const ModalDialog: FC<ModalDialogProps> = (props) => {
  const { title, children } = props;

  // Handle interacting outside the dialog and pressing
  // the Escape key to close the modal.
  const ref = useRef<HTMLDivElement>(null);
  const { overlayProps, underlayProps } = useOverlay(props, ref);

  // Prevent scrolling while the modal is open, and hide content
  // outside the modal from screen readers.
  usePreventScroll();
  const { modalProps } = useModal();

  // Get props for the dialog and its title
  const { dialogProps, titleProps } = useDialog(props, ref);

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 100,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      {...underlayProps}
    >
      <FocusScope contain restoreFocus autoFocus>
        <div
          {...overlayProps}
          {...dialogProps}
          {...modalProps}
          ref={ref}
          style={{
            background: "white",
            color: "black",
            padding: 30,
          }}
        >
          <h2 {...titleProps} style={{ marginTop: 0 }}>
            {title}
          </h2>
          {children}
        </div>
      </FocusScope>
    </div>
  );
};

export default ModalDialog;
