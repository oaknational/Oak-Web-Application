import { renderHook } from "@testing-library/react";
import { OverlayProvider } from "react-aria";
import userEvent from "@testing-library/user-event";

import BioCardListModalDialog from "./BioCardListModalDialog";
import useBioCardListModalDialog from "./useBioCardListModalDialog";

import noop from "@/__tests__/__helpers__/noop";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("useBioCardListModalDialog", () => {
  test("returns correct aria titleProps", () => {
    const { result } = renderHook(
      () =>
        useBioCardListModalDialog({
          size: "fullscreen",
          closeModal: noop,
          isOpen: true,
        }),
      { wrapper: OverlayProvider },
    );

    renderWithTheme(
      <BioCardListModalDialog {...result.current}>
        Contents
      </BioCardListModalDialog>,
    );

    expect(result.current.titleProps).toMatchObject({
      id: "react-use-id-test-result",
    });
  });
  test("escape calls closeModal()", async () => {
    const closeModal = vi.fn();
    const { result } = renderHook(
      () =>
        useBioCardListModalDialog({
          size: "fullscreen",
          closeModal,
          isOpen: true,
          isDismissable: true,
          isKeyboardDismissDisabled: true,
        }),
      { wrapper: OverlayProvider },
    );
    renderWithTheme(
      <BioCardListModalDialog {...result.current}>
        Contents
      </BioCardListModalDialog>,
    );

    const user = userEvent.setup();
    await user.keyboard("{Escape}");

    expect(result.current.closeModal).toHaveBeenCalled();
  });
});
