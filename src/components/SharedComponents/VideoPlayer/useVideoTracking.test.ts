import { act, renderHook } from "@testing-library/react";

import useVideoTracking, { VideoTrackingGetState } from "./useVideoTracking";

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

const eventProps = {
  durationSeconds: 234,
  isCaptioned: true,
  isMuted: false,
  timeElapsedSeconds: 211,
  videoLocation: "webinar",
  videoPlaybackId: "12mux67",
  videoTitle: "Top video",
};
const getState: VideoTrackingGetState = () => ({
  duration: 234,
  slug: "something",
  captioned: true,
  title: "Top video",
  playbackId: "12mux67",
  muted: false,
  timeElapsed: 211,
  location: "webinar",
});

describe("useVideoTracking", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("calls track.videoStarted only once", () => {
    const { result } = renderHook(() => useVideoTracking({ getState }));
    act(() => {
      result.current.onPlay();
    });
    act(() => {
      result.current.onPlay();
    });
    expect(videoStarted).toHaveBeenCalledTimes(1);
  });
  test("calls track.videoPlayed", () => {
    const { result } = renderHook(() => useVideoTracking({ getState }));
    act(() => {
      result.current.onPlay();
    });

    expect(videoPlayed).toHaveBeenCalledWith(eventProps);
  });
  test("calls track.videoPaused", () => {
    const { result } = renderHook(() => useVideoTracking({ getState }));
    act(() => {
      result.current.onPause();
    });
    expect(videoPaused).toHaveBeenCalledWith(eventProps);
  });
  test("calls track.videoFinished", () => {
    const { result } = renderHook(() => useVideoTracking({ getState }));
    result.current.onEnd();
    expect(videoFinished).toHaveBeenCalledWith(eventProps);
  });
  test("calls correct number of times when a sequence is run", () => {
    const { result } = renderHook(() => useVideoTracking({ getState }));
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
