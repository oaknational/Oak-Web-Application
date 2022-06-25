import { waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";

import { LS_KEY_THEME } from "../config/localStorageKeys";

import useLocalStorage from "./useLocalStorage";
import useOakTheme, { THEME_NAMES, WindowOakThemes } from "./useOakTheme";

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

const consoleErrorSpy = jest.spyOn(console, "error");

describe("useOakTheme()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.oakThemes?.setTheme(null);
  });

  it("should default to 'default'", () => {
    const {
      result: { current },
    } = renderHook(() => useOakTheme());

    expect(current.name).toBe("default");
  });

  it("should set oakThemes property on window object", () => {
    renderHook(() => useOakTheme());

    expect(window).toHaveProperty("oakThemes");
  });

  describe("window.oakThemes", () => {
    it("should have availableThemes property which lists themes", () => {
      expect(window.oakThemes?.availableThemes).toEqual([
        "default",
        "aus",
        "placeholder",
      ]);
    });
    it("setTheme() should console.error if theme not valid", async () => {
      act(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.oakThemes?.setTheme("not a theme");
      });

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          `Theme name must be one of: ${THEME_NAMES.join(", ")}`
        );
      });
    });
    it("should console.error if local-storage manually changed to invalid theme", async () => {
      renderHook(() => useOakTheme());
      const invalidTheme = "not a theme";
      const { result } = renderHook(() =>
        useLocalStorage(LS_KEY_THEME, "default")
      );
      act(() => {
        const setTheme = result.current[1];
        setTheme(invalidTheme);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `No theme found for theme name: ${invalidTheme}, falling back to default.`
      );
    });
    it("setTheme() should change the theme if valid", async () => {
      const { result } = renderHook(() => useOakTheme());

      act(() => {
        window.oakThemes?.setTheme("aus");
      });

      expect(result.current.name).toBe("aus");
    });
  });
});
