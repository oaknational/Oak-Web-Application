import { renderHook, act, waitFor } from "@testing-library/react";

import { useCookieFlag } from "./useCookieFlag";

describe("useCookieFlag()", () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("initial state", () => {
    // eslint-disable-next-line compat/compat
    const cookieStore = new CookieStore();
    const { result } = renderHook(() =>
      useCookieFlag("key", { activeFlags: [], flags: [], cookieStore }),
    );
    expect(result.current[0]).toBe(false);
  });

  describe("get value from cookie", () => {
    test("when '1' true", async () => {
      // eslint-disable-next-line compat/compat
      const cookieStore = new CookieStore();
      jest
        .mocked(cookieStore.getAll)
        .mockResolvedValue([{ name: "oak-flag-key", value: "1" }]);
      const { result } = renderHook(() =>
        useCookieFlag("key", {
          activeFlags: ["key"],
          flags: ["key"],
          cookieStore,
        }),
      );
      await waitFor(() => {
        expect(result.current[0]).toBe(true);
      });
    });

    test("any other value false", () => {
      // eslint-disable-next-line compat/compat
      const cookieStore = new CookieStore();
      const { result } = renderHook(() =>
        useCookieFlag("key", { activeFlags: [], flags: [], cookieStore }),
      );
      expect(result.current[0]).toBe(false);
    });
  });

  describe("set value", () => {
    test("when true", async () => {
      // eslint-disable-next-line compat/compat
      const cookieStore = new CookieStore();
      const { result, rerender } = renderHook(() =>
        useCookieFlag("key", { activeFlags: [], flags: [], cookieStore }),
      );
      act(() => {
        const setState = result.current[1];
        setState(true);
      });

      rerender();
      await waitFor(() => {
        expect(result.current[0]).toBe(true);
      });
    });
  });
});
