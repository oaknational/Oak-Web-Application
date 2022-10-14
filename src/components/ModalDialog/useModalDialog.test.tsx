import { renderHook } from "@testing-library/react-hooks";
import { OverlayProvider } from "react-aria";

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
      // @todo this id should not be null
      id: null,
    });
  });
});
