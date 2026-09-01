import { renderHook, act } from "@testing-library/react";

import { useCookieFlag } from "./useCookieFlag";

describe("useCookieFlag()", () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("initial state", () => {
    const { result } = renderHook(() =>
      useCookieFlag("key", { activeFlags: [], flags: [] }),
    );
    expect(result.current[0]).toBe(false);
  });

  describe("get value from cookie", () => {
    test("when '1' true", () => {
      const { result } = renderHook(() =>
        useCookieFlag("key", { activeFlags: [], flags: [] }),
      );
      expect(result.current[0]).toBe(true);
    });

    test("any other value false", () => {
      const { result } = renderHook(() =>
        useCookieFlag("key", { activeFlags: [], flags: [] }),
      );
      expect(result.current[0]).toBe(false);
    });
  });

  describe("set value", () => {
    test("when true", () => {
      const { result, rerender } = renderHook(() =>
        useCookieFlag("key", { activeFlags: [], flags: [] }),
      );
      act(() => {
        const setState = result.current[1];
        setState(true);
      });

      rerender();
      console.log("?????");

      expect(result.current[0]).toBe(true);
    });
  });
});
