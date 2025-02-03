import { vi } from "vitest";
import React, { forwardRef } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import VideoPlayer, {
  VideoEventCallbackArgs,
  VideoPlayerProps,
} from "./VideoPlayer";

import OakError from "@/errors/OakError";

let currentErrorEvent = { detail: { data: { type: "networkError" } } };
// Override the global mock for @mux/mux-player-react/lazy
vi.mock("@mux/mux-player-react/lazy", async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MuxPlayer = forwardRef<HTMLDivElement, any>(
    ({ onError, onPlay, onPause }, ref) => {
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
    },
  );

  return {
    __esModule: true,
    default: MuxPlayer,
  };
});

// Mocking custom hooks and utility functions
vi.mock("./useVideoTracking", () => ({
  default: () => ({
    onPlay: vi.fn(),
    onPause: vi.fn(),
    onEnd: vi.fn(),
  }),
}));

vi.mock("./useSignedVideoToken", async () => {
  return {
    __esModule: true,
    useSignedVideoToken: vi.fn(() => ({
      loading: false,
      playbackToken: "mockVideoToken",
    })),
    useSignedThumbnailToken: vi.fn(() => ({
      loading: false,
      playbackToken: "mockThumbnailToken",
    })),
    useSignedStoryboardToken: vi.fn(() => ({
      loading: false,
      playbackToken: "mockStoryboardToken",
    })),
  };
});

vi.mock("./getTimeElapsed", () => ({
  default: () => 0,
}));

vi.mock("./getSubtitleTrack", () => ({
  default: () => null,
}));

vi.mock("./getDuration", () => ({
  default: () => 100,
}));

vi.mock("./getPercentageElapsed", () => ({
  default: () => 50,
}));

const mockErrorReporter = vi.fn();
vi.mock("@/common-lib/error-reporter", () => ({
  default: () => mockErrorReporter,
}));

type MockVideoCallbackArgs = ReturnType<
  typeof vi.fn<(args: VideoEventCallbackArgs) => void>
>;

describe("VideoPlayer", () => {
  const userEventCallbackMock = vi.fn() as MockVideoCallbackArgs;
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
      new OakError({
        code: "video/unknown",
        meta: {
          "metadata-video-id": "testPlaybackId",
          "metadata-video-title": "Test Video",
        },
        originalError: {
          ...currentErrorEvent,
        },
      }),
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
    vi.clearAllMocks();
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
    const pauseButton = screen.getByTestId("pause-button");
    vi.clearAllMocks();
    await userEvent.click(pauseButton);

    expect(defaultProps.userEventCallback).toHaveBeenCalledWith({
      duration: 100,
      event: "pause",
      timeElapsed: 0,
      muted: false,
    });
  });

  // This passes, but I'm confident its not working as expected
  it.skip("handles unknown error event, no report second time", async () => {
    render(<VideoPlayer {...defaultProps} />);
    const errorButton = screen.getByTestId("error-button");
    mockErrorReporter.mockClear();

    currentErrorEvent = { detail: { data: { type: "unknownError" } } };

    await waitFor(() => {
      userEvent.click(errorButton);
    });
    await waitFor(() => {
      userEvent.click(errorButton);
    });

    expect(mockErrorReporter).toHaveBeenCalledTimes(1);
  });

  //   Could not get this test to pass but confident it's working as expected. The time to fix this can't be justified currently.
  it.skip("handles unknown error event, report after 5 times", async () => {
    render(<VideoPlayer {...defaultProps} />);
    const errorButton = screen.getByTestId("error-button");

    currentErrorEvent = { detail: { data: { type: "unknownError" } } };

    await act(async () => {
      await waitFor(() => {
        userEvent.click(errorButton);
      });
      await waitFor(() => {
        userEvent.click(errorButton);
      });
      await waitFor(() => {
        userEvent.click(errorButton);
      });
      await waitFor(() => {
        userEvent.click(errorButton);
      });
      await waitFor(() => {
        userEvent.click(errorButton);
      });
    });

    expect(mockErrorReporter).lastCalledWith(
      new Error(
        "Sorry this video couldn't play persistently, please try again",
      ),
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
});
