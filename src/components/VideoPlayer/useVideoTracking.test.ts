import { act, renderHook } from "@testing-library/react-hooks";

import useVideoTracking from "./useVideoTracking";

const videoStarted = jest.fn();
const videoPlayed = jest.fn();
const videoPaused = jest.fn();
const videoFinished = jest.fn();

jest.mock("../../context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      videoStarted: (...args: []) => videoStarted(...args),
      videoPlayed: (...args: []) => videoPlayed(...args),
      videoPaused: (...args: []) => videoPaused(...args),
      videoFinished: (...args: []) => videoFinished(...args),
    },
  }),
}));

const video = {
  duration: 234,
  slug: "something",
  captioned: true,
};
const state = {
  muted: false,
  timeElapsed: 211,
};

describe("useVideoTracking", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("calls track.videoStarted only once", () => {
    const { result } = renderHook(() => useVideoTracking({ video, state }));
    act(() => {
      result.current.onPlay();
    });
    act(() => {
      result.current.onPlay();
    });
    expect(videoStarted).toHaveBeenCalledTimes(1);
  });
  test("calls track.videoPlayed", () => {
    const { result } = renderHook(() => useVideoTracking({ video, state }));
    act(() => {
      result.current.onPlay();
    });
    expect(videoPlayed).toHaveBeenCalled();
  });
  test("calls track.videoPaused", () => {
    const { result } = renderHook(() => useVideoTracking({ video, state }));
    act(() => {
      result.current.onPause();
    });
    expect(videoPaused).toHaveBeenCalled();
  });
  test("calls track.videoFinished", () => {
    const { result } = renderHook(() => useVideoTracking({ video, state }));
    result.current.onEnd();
    expect(videoFinished).toHaveBeenCalled();
  });
  test("calls correct number of times when a sequence is run", () => {
    const { result } = renderHook(() => useVideoTracking({ video, state }));
    act(() => {
      result.current.onPlay();
    });
    act(() => {
      result.current.onPause();
    });
    act(() => {
      result.current.onPlay();
    });
    act(() => {
      result.current.onPause();
    });
    expect(videoStarted).toHaveBeenCalledTimes(1);
    expect(videoPlayed).toHaveBeenCalledTimes(2);
    expect(videoPaused).toHaveBeenCalledTimes(2);
  });
});
