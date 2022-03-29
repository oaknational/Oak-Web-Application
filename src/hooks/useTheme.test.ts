import { waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import useTheme, { WindowOakThemes } from "./useTheme";

declare global {
  interface WindowEventMap {
    "test-event": CustomEvent;
  }

  interface HTMLElementEventMap {
    "test-event": CustomEvent;
  }
  interface Window {
    oakThemes?: WindowOakThemes;
  }
}

const setDocumentStyleProperty = jest.fn();
document.documentElement.style.setProperty = setDocumentStyleProperty;

const documentStyleSetPropertySpy = jest.spyOn(
  document.documentElement.style,
  "setProperty"
);

describe("useTheme()", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call setProperty with default theme values", () => {
    renderHook(() => useTheme());

    expect(documentStyleSetPropertySpy).toHaveBeenCalledWith(
      `--color-teachers-primary`,
      "#5C3CCB"
    );
  });

  it("should set oakThemes property on window object", () => {
    renderHook(() => useTheme());

    expect(window).toHaveProperty("oakThemes");
  });

  describe("window.oakThemes", () => {
    it("should have availableThemes property which lists themes", () => {
      renderHook(() => useTheme());

      expect(window.oakThemes?.availableThemes).toEqual(["default", "aus"]);
    });
    it("should have functioning setTheme() method", async () => {
      renderHook(() => useTheme());

      // Clear mocks to test setTheme() functionality
      jest.clearAllMocks();

      window.oakThemes?.setTheme("aus");

      waitFor(() => {
        expect(documentStyleSetPropertySpy).toHaveBeenCalledWith(
          `--color-teachers-primary`,
          "lightgreen"
        );
      });
    });
  });
});
