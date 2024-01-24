import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import { useSignedMuxToken } from "./useSignedVideoToken";

const { mockUseSWR } = vi.hoisted(() => {
  const mockUseSWR = vi.fn<[{ data: unknown; error: unknown }]>(() => ({
    data: null,
    error: null,
  }));

  return { mockUseSWR };
});

vi.mock("swr", () => ({
  __esModule: true,
  default: mockUseSWR,
}));

const reportError = vi.fn();
vi.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

vi.mock("./getSignedVideoToken", () => ({
  __esModule: true,
  default: vi.fn().mockReturnValue(Promise.resolve([])),
}));

vi.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

describe("useSignedMuxToken", () => {
  it("'loading' should default to false on public video", () => {
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

  it("'token' should be null on a public video", () => {
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
  it("'loading' should default to true on signed video", () => {
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
  it("should return correct state on error ", () => {
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
  it("should return correct signed playback token ", () => {
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
  it("should report an error if there is data but no token ", () => {
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
