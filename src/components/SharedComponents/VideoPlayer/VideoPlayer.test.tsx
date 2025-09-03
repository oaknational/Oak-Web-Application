import React, { forwardRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import VideoPlayer, {
  VideoEventCallbackArgs,
  VideoPlayerProps,
} from "./VideoPlayer";

let currentErrorEvent = { detail: { data: { type: "networkError" } } };
// Override the global mock for @mux/mux-player-react/lazy
jest.mock("@mux/mux-player-react/lazy", () => {
  // @ts-expect-error - MuxPlayer mock
  return forwardRef(({ onError, onPlay, onPause }, ref) => {
    ref; // This prevents warning about ref not being used
    return (
      <div data-testid="mux-player">
        <button
          data-testid="error-button"
          onClick={() => {
            onError(currentErrorEvent);
          }}
        >
          Error
        </button>
        <button data-testid="play-button" onClick={onPlay}>
          Play
        </button>
        <button data-testid="pause-button" onClick={onPause}>
          Pause
        </button>
      </div>
    );
  });
});

// Mocking custom hooks and utility functions
jest.mock("./useVideoTracking", () =>
  jest.fn(() => ({
    onPlay: jest.fn(),
    onPause: jest.fn(),
    onEnd: jest.fn(),
  })),
);
jest.mock("./useSignedVideoToken", () => ({
  useSignedVideoToken: jest.fn(() => ({
    loading: false,
    playbackToken: "mockVideoToken",
  })),
  useSignedThumbnailToken: jest.fn(() => ({
    loading: false,
    playbackToken: "mockThumbnailToken",
  })),
  useSignedStoryboardToken: jest.fn(() => ({
    loading: false,
    playbackToken: "mockStoryboardToken",
  })),
}));
jest.mock("./getTimeElapsed", () => jest.fn(() => 0));
jest.mock("./getSubtitleTrack", () => jest.fn(() => null));
jest.mock("./getDuration", () => jest.fn(() => 100));
jest.mock("./getPercentageElapsed", () => jest.fn(() => 50));

const mockErrorReporter = jest.fn();
jest.mock("@/common-lib/error-reporter", () =>
  jest.fn(() => mockErrorReporter),
);

type MockVideoCallbackArgs = jest.Mock<void, [VideoEventCallbackArgs]>;

describe("VideoPlayer", () => {
  const userEventCallbackMock = jest.fn() as MockVideoCallbackArgs;
  const defaultProps: VideoPlayerProps = {
    playbackId: "testPlaybackId",
    playbackPolicy: "public",
    title: "Test Video",
    location: "pupil",
    isLegacy: false,
    userEventCallback: userEventCallbackMock,
  };

  it("handles and doesn't report network error event", async () => {
    render(<VideoPlayer {...defaultProps} />);
    const errorButton = screen.getByTestId("error-button");
    mockErrorReporter.mockClear();

    await userEvent.click(errorButton);

    expect(mockErrorReporter).not.toHaveBeenCalled();
  });

  it("handles and reports unknown error event", async () => {
    render(<VideoPlayer {...defaultProps} />);
    const errorButton = screen.getByTestId("error-button");
    mockErrorReporter.mockClear();

    currentErrorEvent = { detail: { data: { type: "unknownError" } } };

    await userEvent.click(errorButton);

    expect(mockErrorReporter).toHaveBeenCalledWith(
      new Error("Sorry this video couldn't play, please try again"),
      {
        captioned: false,
        duration: 100,
        location: "pupil",
        muted: false,
        playbackId: "testPlaybackId",
        timeElapsed: 0,
        title: "Test Video",
      },
    );
  });

  it("handles and reports onPlay event", async () => {
    render(<VideoPlayer {...defaultProps} />);
    const playButton = screen.getByTestId("play-button");
    jest.clearAllMocks();
    await userEvent.click(playButton);

    expect(defaultProps.userEventCallback).toHaveBeenCalledWith({
      duration: 100,
      event: "play",
      timeElapsed: 0,
      muted: false,
    });
  });

  it("handles and reports onPause event", async () => {
    render(<VideoPlayer {...defaultProps} />);
    const playButton = screen.getByTestId("play-button");
    await userEvent.click(playButton);
    setTimeout(async () => {
      const pauseButton = screen.getByTestId("pause-button");
      await userEvent.click(pauseButton);

      expect(defaultProps.userEventCallback).toHaveBeenCalledWith({
        duration: 100,
        event: "pause",
        timeElapsed: 0,
        muted: false,
      });
    }, 100);
  });
});
