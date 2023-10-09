import { renderHook } from "@testing-library/react";

import { useSignedMuxToken } from "./useSignedVideoToken";

const mockUseSWR = jest.fn<{ data: unknown; error: unknown }, []>(() => ({
  data: null,
  error: null,
}));

jest.mock("swr", () => ({
  __esModule: true,
  default: (...args: []) => mockUseSWR(...args),
}));

const reportError = jest.fn();
jest.mock("../../common-lib/error-reporter", () => ({
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

jest.mock("../../common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
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
});
