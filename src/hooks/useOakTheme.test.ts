import { waitFor, renderHook, act } from "@testing-library/react";

import { getOakGlobals } from "../browser-lib/oak-globals/oakGlobals";
import { LS_KEY_THEME } from "../config/localStorageKeys";
import noop from "../__tests__/__helpers__/noop";

import useLocalStorage from "./useLocalStorage";
import useOakTheme, { THEME_NAMES } from "./useOakTheme";

declare global {
  interface WindowEventMap {
    "test-event": CustomEvent;
  }

  interface HTMLElementEventMap {
    "test-event": CustomEvent;
  }
}

const setDocumentStyleProperty = jest.fn();
document.documentElement.style.setProperty = setDocumentStyleProperty;

const consoleLogSpy = jest.spyOn(console, "log");
const consoleErrorSpy = jest.spyOn(console, "error");
const oakGlobals = getOakGlobals();

describe("useOakTheme()", () => {
  beforeEach(() => {
    consoleErrorSpy.mockImplementation(noop);
    consoleLogSpy.mockImplementation(noop);

    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    oakGlobals.oakThemes?.setTheme(null);
  });

  it("should default to 'default'", () => {
    const {
      result: { current },
    } = renderHook(() => useOakTheme());

    expect(current.name).toBe("default");
  });

  it("should set oakThemes property on window object", () => {
    renderHook(() => useOakTheme());

    expect(oakGlobals).toHaveProperty("oakThemes");
  });

  describe("window.oakThemes", () => {
    it("should have availableThemes property which lists themes", () => {
      expect(oakGlobals.oakThemes?.availableThemes).toEqual(["default", "oak"]);
    });
    it("setTheme() should console.error if theme not valid", async () => {
      act(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        oakGlobals.oakThemes?.setTheme("not a theme");
      });

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          `Theme name must be one of: ${THEME_NAMES.join(", ")}`,
        );
      });
    });
    it("should console.error if local-storage manually changed to invalid theme", async () => {
      renderHook(() => useOakTheme());
      const invalidTheme = "not a theme";
      const { result } = renderHook(() =>
        useLocalStorage(LS_KEY_THEME, "default"),
      );
      act(() => {
        const setTheme = result.current[1];
        setTheme(invalidTheme);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `No theme found for theme name: ${invalidTheme}, falling back to default.`,
      );
    });
    it("setTheme() should change the theme if valid", async () => {
      const { result } = renderHook(() => useOakTheme());

      act(() => {
        oakGlobals.oakThemes?.setTheme("oak");
      });

      expect(result.current.name).toBe("oak");
    });
  });
});
