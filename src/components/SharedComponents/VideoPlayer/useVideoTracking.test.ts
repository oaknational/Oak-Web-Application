import { act, renderHook } from "@testing-library/react";

import useVideoTracking, { VideoTrackingGetState } from "./useVideoTracking";

const videoStarted = jest.fn();
const videoPlayed = jest.fn();
const videoPaused = jest.fn();
const videoFinished = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
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
  videoPlaybackId: ["12mux67"],
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
      result.current.onPlay(true);
    });
    act(() => {
      result.current.onPlay(false);
    });
    expect(videoStarted).toHaveBeenCalledTimes(1);
  });
  test("calls track.videoPlayed", () => {
    const { result } = renderHook(() => useVideoTracking({ getState }));
    act(() => {
      result.current.onPlay(true);
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
  it("calls tracking with mux asset id and cloudinary url", () => {
    const { result } = renderHook(() =>
      useVideoTracking({
        getState,
        cloudinaryUrl: "https://example.com/video.mp4",
        muxAssetId: "mux12345",
      }),
    );
    act(() => result.current.onPlay(true));
    expect(videoPlayed).toHaveBeenCalledWith({
      ...eventProps,
      cloudinaryUrl: "https://example.com/video.mp4",
      muxAssetId: "mux12345",
    });
  });
  test("calls correct number of times when a sequence is run", () => {
    const { result } = renderHook(() => useVideoTracking({ getState }));
    act(() => {
      result.current.onPlay(true);
    });
    act(() => {
      result.current.onPause();
    });
    act(() => {
      result.current.onPlay(false);
    });
    act(() => {
      result.current.onPause();
    });
    expect(videoStarted).toHaveBeenCalledTimes(1);
    expect(videoPlayed).toHaveBeenCalledTimes(2);
    expect(videoPaused).toHaveBeenCalledTimes(2);
  });
});
