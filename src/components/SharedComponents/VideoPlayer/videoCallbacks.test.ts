import MuxPlayerElement from "@mux/mux-player";

import { onPause, onPlay, onTimeUpdate } from "./videoCallbacks";

const mockSetVideoIsPlaying = jest.fn();
const mockTrackOnPlay = jest.fn();
const mockUserEventCallback = jest.fn();
const mockTrackOnPause = jest.fn();
const mockSetEndTracked = jest.fn();
const mockTrackOnEnd = jest.fn();

const mockUseRef = {
  current: {
    classList: { add: jest.fn(), remove: jest.fn() },
    currentTime: 0,
    muted: false,
    duration: 100,
  } as unknown as MuxPlayerElement,
};

describe("Video callbacks", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("onPlay sets video is playing", () => {
    onPlay({
      mediaElRef: mockUseRef,
      setVideoIsPlaying: mockSetVideoIsPlaying,
      trackOnPlay: mockTrackOnPlay,
      userEventCallback: mockUserEventCallback,
      playingClassname: "playing",
    });
    expect(mockSetVideoIsPlaying).toHaveBeenCalledWith(true);
  });
  test("onPlay calls trackOnPlay with isVideoStart", () => {
    onPlay({
      mediaElRef: mockUseRef,
      setVideoIsPlaying: mockSetVideoIsPlaying,
      trackOnPlay: mockTrackOnPlay,
      userEventCallback: mockUserEventCallback,
      playingClassname: "playing",
    });
    expect(mockTrackOnPlay).toHaveBeenCalledWith(true);
  });
  test("calls trackOnPlay with false if video is not at start", () => {
    mockUseRef.current.currentTime = 10;
    onPlay({
      mediaElRef: mockUseRef,
      setVideoIsPlaying: mockSetVideoIsPlaying,
      trackOnPlay: mockTrackOnPlay,
      userEventCallback: mockUserEventCallback,
      playingClassname: "playing",
    });
    expect(mockTrackOnPlay).toHaveBeenCalledWith(false);
  });
  test("onPause calls trackOnPause", () => {
    onPause({
      mediaElRef: mockUseRef,
      setVideoIsPlaying: mockSetVideoIsPlaying,
      trackOnPause: mockTrackOnPause,
      userEventCallback: mockUserEventCallback,
      playingClassname: "playing",
    });
    expect(mockTrackOnPause).toHaveBeenCalled();
  });
  test("onPause does not call trackOnPause if video is finished", () => {
    mockUseRef.current.currentTime = 100;
    onPause({
      mediaElRef: mockUseRef,
      setVideoIsPlaying: mockSetVideoIsPlaying,
      trackOnPause: mockTrackOnPause,
      userEventCallback: mockUserEventCallback,
      playingClassname: "playing",
    });
    expect(mockTrackOnPause).not.toHaveBeenCalled();
  });
  test('onTimeUpdate calls userEventCallback with "end" event if video is 90% played', () => {
    const playbackId = "testPlaybackId";
    const endTracked = "";

    mockUseRef.current.currentTime = 90;

    onTimeUpdate({
      mediaElRef: mockUseRef,
      setEndTracked: mockSetEndTracked,
      trackOnEnd: mockTrackOnEnd,
      userEventCallback: mockUserEventCallback,
      playbackId,
      endTracked,
      playingClassname: "playing",
    });

    expect(mockTrackOnEnd).toHaveBeenCalled();
    expect(mockSetEndTracked).toHaveBeenCalledWith(playbackId);
    expect(mockUserEventCallback).toHaveBeenCalledWith({
      event: "end",
      duration: 100,
      timeElapsed: 90,
      muted: false,
    });
  });
});
