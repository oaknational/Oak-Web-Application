import { act, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import useLocalStorage from "./useLocalStorage";
import useTheme, {
  LS_KEY_THEME,
  themeNames,
  WindowOakThemes,
} from "./useTheme";

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

const consoleErrorSpy = jest.spyOn(console, "error");

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
    it("setTheme() should console.error if theme not valid", async () => {
      renderHook(() => useTheme());
      jest.clearAllMocks();
      act(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.oakThemes?.setTheme("not a theme");
      });

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          `Theme name must be one of: ${themeNames.join(", ")}`
        );
        expect(documentStyleSetPropertySpy).not.toHaveBeenCalled();
      });
    });
    it("should console.error if local-storage manually changed to invalid theme", async () => {
      renderHook(() => useTheme());
      jest.clearAllMocks();

      const invalidTheme = "not a theme";
      const { result } = renderHook(() =>
        useLocalStorage(LS_KEY_THEME, "default")
      );
      act(() => {
        const setTheme = result.current[1];
        setTheme(invalidTheme);
      });

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          `No theme found for theme name: ${invalidTheme}`
        );
      });
    });
    it("setTheme() should change the theme if valid", async () => {
      renderHook(() => useTheme());
      jest.clearAllMocks();

      act(() => {
        window.oakThemes?.setTheme("aus");
      });

      await waitFor(() => {
        expect(documentStyleSetPropertySpy).toHaveBeenCalledWith(
          `--color-teachers-primary`,
          "lightgreen"
        );
      });
    });
  });
});
