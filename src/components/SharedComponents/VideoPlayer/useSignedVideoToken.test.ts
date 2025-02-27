import { act, renderHook } from "@testing-library/react";

import { useSignedMuxToken } from "./useSignedVideoToken";

import { isJwtExpiring } from "@/utils/jwtExpiry";

const mockMutate = jest.fn();
const mockUseSWR = jest.fn<{ data: unknown; error: unknown }, []>(() => ({
  data: null,
  error: null,
  mutate: mockMutate,
}));

jest.mock("swr", () => ({
  __esModule: true,
  default: (...args: []) => mockUseSWR(...args),
}));

const reportError = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

jest.mock("./getSignedVideoToken", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(Promise.resolve([])),
}));

jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

jest.mock("@/utils/jwtExpiry", () => ({
  __esModule: true,
  isJwtExpiring: jest.fn().mockReturnValue(false),
}));

describe("useSignedMuxToken", () => {
  test("'loading' should default to false on public video", () => {
    const { result } = renderHook(() =>
      useSignedMuxToken({
        playbackId: "123",
        playbackPolicy: "public",
        type: "video",
        isLegacy: true,
      }),
    );
    const { loading } = result.current;

    expect(loading).toBe(false);
  });

  test("'token' should be null on a public video", () => {
    const { result } = renderHook(() =>
      useSignedMuxToken({
        playbackId: "123",
        playbackPolicy: "public",
        type: "video",
        isLegacy: true,
      }),
    );
    const { playbackToken } = result.current;

    expect(playbackToken).toBe(null);
  });
  test("'loading' should default to true on signed video", () => {
    const { result } = renderHook(() =>
      useSignedMuxToken({
        playbackId: "123",
        playbackPolicy: "signed",
        type: "video",
        isLegacy: true,
      }),
    );
    const { loading } = result.current;

    expect(loading).toBe(true);
  });
  test("should return correct state on error ", () => {
    mockUseSWR.mockImplementationOnce(() => ({ data: null, error: "error" }));
    const { result } = renderHook(() =>
      useSignedMuxToken({
        playbackId: "123",
        playbackPolicy: "signed",
        type: "video",
        isLegacy: true,
      }),
    );

    expect(result.current).toEqual({
      loading: false,
      playbackToken: null,
      error: "error",
    });
  });
  test("should return correct signed playback token ", () => {
    mockUseSWR.mockImplementationOnce(() => ({
      data: JSON.stringify({ token: "1234" }),
      error: null,
    }));
    const { result } = renderHook(() =>
      useSignedMuxToken({
        playbackId: "123",
        playbackPolicy: "signed",
        type: "video",
        isLegacy: true,
      }),
    );

    expect(result.current).toEqual({
      loading: false,
      playbackToken: "1234",
      error: null,
    });
  });
  test("should report an error if there is data but no token ", () => {
    mockUseSWR.mockImplementationOnce(() => ({
      data: "123",
      error: "error",
    }));

    renderHook(() =>
      useSignedMuxToken({
        playbackId: "123",
        playbackPolicy: "signed",
        type: "video",
        isLegacy: true,
      }),
    );

    expect(reportError).toHaveBeenCalled();
  });

  describe("signed token refreshing", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      mockMutate.mockClear();
      reportError.mockClear();

      jest.spyOn(global, "setInterval");
      jest.spyOn(global, "clearInterval");

      // Mock document and window event listeners
      jest.spyOn(document, "addEventListener").mockImplementation(jest.fn());
      jest.spyOn(document, "removeEventListener").mockImplementation(jest.fn());
      jest.spyOn(window, "addEventListener").mockImplementation(jest.fn());
      jest.spyOn(window, "removeEventListener").mockImplementation(jest.fn());

      // Reset mock for visibilityState
      Object.defineProperty(document, "visibilityState", {
        writable: true,
        value: "hidden",
      });
    });

    afterEach(() => {
      jest.useRealTimers();
      jest.restoreAllMocks();
    });

    test("should set up interval to check token expiry", () => {
      mockUseSWR.mockImplementationOnce(() => ({
        data: JSON.stringify({ token: "1234" }),
        error: null,
        mutate: mockMutate,
      }));

      renderHook(() =>
        useSignedMuxToken({
          playbackId: "123",
          playbackPolicy: "signed",
          type: "video",
          isLegacy: true,
        }),
      );

      // Verify interval was set
      expect(global.setInterval).toHaveBeenCalled();
    });

    test("should not set up interval for public videos", () => {
      renderHook(() =>
        useSignedMuxToken({
          playbackId: "123",
          playbackPolicy: "public",
          type: "video",
          isLegacy: true,
        }),
      );

      // No interval should be set for public videos
      expect(setInterval).not.toHaveBeenCalled();
    });

    test("should refresh token when it's expiring", () => {
      mockUseSWR.mockImplementationOnce(() => ({
        data: JSON.stringify({ token: "1234" }),
        error: null,
        mutate: mockMutate,
      }));

      // Simulate token to be expiring
      jest.mocked(isJwtExpiring).mockReturnValueOnce(true);

      renderHook(() =>
        useSignedMuxToken({
          playbackId: "123",
          playbackPolicy: "signed",
          type: "video",
          isLegacy: true,
        }),
      );

      // Advance time to force the interval to check the token
      act(() => {
        jest.advanceTimersByTime(60 * 1000);
      });

      // The token should now have refreshed
      expect(mockMutate).toHaveBeenCalled();
    });

    test("should check token when document becomes visible", () => {
      mockUseSWR.mockImplementationOnce(() => ({
        data: JSON.stringify({ token: "1234" }),
        error: null,
        mutate: mockMutate,
      }));

      let visibilityHandler: (event: Event) => void;
      jest
        .mocked(document.addEventListener)
        .mockImplementation((event, handler) => {
          if (event === "visibilitychange") {
            visibilityHandler = handler as (event: Event) => void;
          }
        });

      renderHook(() =>
        useSignedMuxToken({
          playbackId: "123",
          playbackPolicy: "signed",
          type: "video",
          isLegacy: true,
        }),
      );

      // Verify listener was added
      expect(document.addEventListener).toHaveBeenCalledWith(
        "visibilitychange",
        expect.any(Function),
      );

      // Initial state - hidden, shouldn't call mutate
      Object.defineProperty(document, "visibilityState", { value: "hidden" });
      act(() => {
        visibilityHandler(new Event("visibilitychange"));
      });
      expect(mockMutate).not.toHaveBeenCalled();

      // Simulate visibility change to visible
      Object.defineProperty(document, "visibilityState", { value: "visible" });

      // The token should not be refreshed if it's not expiring
      act(() => {
        visibilityHandler(new Event("visibilitychange"));
      });
      expect(mockMutate).not.toHaveBeenCalled();

      // Simulate token to be expiring
      jest.mocked(isJwtExpiring).mockReturnValueOnce(true);

      act(() => {
        visibilityHandler(new Event("visibilitychange"));
      });

      // The token should now have refreshed
      expect(mockMutate).toHaveBeenCalled();
    });

    test("should check token on window focus", () => {
      mockUseSWR.mockImplementationOnce(() => ({
        data: JSON.stringify({ token: "1234" }),
        error: null,
        mutate: mockMutate,
      }));

      let focusHandler: (event: Event) => void;
      jest
        .mocked(window.addEventListener)
        .mockImplementation((event, handler) => {
          if (event === "focus") {
            focusHandler = handler as (event: Event) => void;
          }
        });

      renderHook(() =>
        useSignedMuxToken({
          playbackId: "123",
          playbackPolicy: "signed",
          type: "video",
          isLegacy: true,
        }),
      );

      // Verify listener was added
      expect(window.addEventListener).toHaveBeenCalledWith(
        "focus",
        expect.any(Function),
      );

      // The token should not be refreshed if it's not expiring
      act(() => {
        focusHandler(new Event("focus"));
      });
      expect(mockMutate).not.toHaveBeenCalled();

      // Simulate token to be expiring
      jest.mocked(isJwtExpiring).mockReturnValueOnce(true);

      act(() => {
        focusHandler(new Event("focus"));
      });

      // The token should now have refreshed
      expect(mockMutate).toHaveBeenCalled();
    });

    test("should check token when coming online", () => {
      let onlineHandler: (event: Event) => void;
      mockUseSWR.mockImplementationOnce(() => ({
        data: JSON.stringify({ token: "1234" }),
        error: null,
        mutate: mockMutate,
      }));

      jest
        .mocked(window.addEventListener)
        .mockImplementation((event, handler) => {
          if (event === "online") {
            onlineHandler = handler as (event: Event) => void;
          }
        });

      renderHook(() =>
        useSignedMuxToken({
          playbackId: "123",
          playbackPolicy: "signed",
          type: "video",
          isLegacy: true,
        }),
      );

      expect(window.addEventListener).toHaveBeenCalledWith(
        "online",
        expect.any(Function),
      );

      // The token should not be refreshed if it's not expiring
      act(() => {
        onlineHandler(new Event("online"));
      });
      expect(mockMutate).not.toHaveBeenCalled();

      // Simulate token to be expiring
      jest.mocked(isJwtExpiring).mockReturnValueOnce(true);

      act(() => {
        onlineHandler(new Event("online"));
      });

      // The token should now have refreshed
      expect(mockMutate).toHaveBeenCalled();
    });

    test("should clean up event listeners and interval on unmount", () => {
      let visibilityHandler, focusHandler, onlineHandler;
      mockUseSWR.mockImplementationOnce(() => ({
        data: JSON.stringify({ token: "1234" }),
        error: null,
        mutate: mockMutate,
      }));

      jest
        .mocked(document.addEventListener)
        .mockImplementation((event, handler) => {
          if (event === "visibilitychange") visibilityHandler = handler;
        });

      jest
        .mocked(window.addEventListener)
        .mockImplementation((event, handler) => {
          if (event === "focus") focusHandler = handler;
          if (event === "online") onlineHandler = handler;
        });

      const { unmount } = renderHook(() =>
        useSignedMuxToken({
          playbackId: "123",
          playbackPolicy: "signed",
          type: "video",
          isLegacy: true,
        }),
      );

      // Unmount the hook
      unmount();

      // Verify cleanup
      expect(global.clearInterval).toHaveBeenCalled();
      expect(document.removeEventListener).toHaveBeenCalledWith(
        "visibilitychange",
        visibilityHandler,
      );
      expect(window.removeEventListener).toHaveBeenCalledWith(
        "focus",
        focusHandler,
      );
      expect(window.removeEventListener).toHaveBeenCalledWith(
        "online",
        onlineHandler,
      );
    });
  });
});
