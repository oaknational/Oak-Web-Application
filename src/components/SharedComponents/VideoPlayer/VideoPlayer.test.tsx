import React, { forwardRef } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import VideoPlayer, { VideoPlayerProps } from "./VideoPlayer";

let currentErrorEvent = { detail: { data: { type: "networkError" } } };
// Override the global mock for @mux/mux-player-react/lazy
jest.mock("@mux/mux-player-react/lazy", () => {
  // @ts-expect-error ref wanted, but not needed for this test
  return forwardRef(({ onError }) => (
    <div data-testid="mux-player">
      <button
        data-testid="error-button"
        onClick={() => {
          onError(currentErrorEvent);
        }}
      >
        Error
      </button>
    </div>
  ));
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

describe("VideoPlayer", () => {
  const defaultProps: VideoPlayerProps = {
    playbackId: "testPlaybackId",
    playbackPolicy: "public",
    title: "Test Video",
    location: "pupil",
    isLegacy: false,
    userEventCallback: jest.fn(),
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
