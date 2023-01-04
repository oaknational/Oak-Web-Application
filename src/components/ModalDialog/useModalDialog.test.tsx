import { renderHook } from "@testing-library/react";
import { OverlayProvider } from "react-aria";
import userEvent from "@testing-library/user-event";

import noop from "../../__tests__/__helpers__/noop";
import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import ModalDialog from "./ModalDialog";
import useModalDialog from "./useModalDialog";

describe("useModalDialog", () => {
  test("returns correct aria titleProps", () => {
    const { result } = renderHook(
      () =>
        useModalDialog({
          size: "fullscreen",
          closeModal: noop,
          isOpen: true,
        }),
      { wrapper: OverlayProvider }
    );

    renderWithTheme(<ModalDialog {...result.current}>Contents</ModalDialog>);

    expect(result.current.titleProps).toMatchObject({
      id: "react-use-id-test-result",
    });
  });
  test("escape calls closeModal()", async () => {
    const closeModal = jest.fn();
    const { result } = renderHook(
      () =>
        useModalDialog({
          size: "fullscreen",
          closeModal,
          isOpen: true,
          isDismissable: true,
          isKeyboardDismissDisabled: true,
        }),
      { wrapper: OverlayProvider }
    );
    renderWithTheme(<ModalDialog {...result.current}>Contents</ModalDialog>);

    const user = userEvent.setup();
    await user.keyboard("{Escape}");

    expect(result.current.closeModal).toHaveBeenCalled();
  });
});
