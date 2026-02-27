import { ok } from "assert";

import React, { forwardRef } from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import VideoPlayer, {
  VideoEventCallbackArgs,
  VideoPlayerProps,
} from "./VideoPlayer";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

// Custom elements that simulate MuxPlayer's shadow DOM structure for autofocus tests.
// findPlayButtonInShadowRoots recursively searches shadow roots for media-play-button.
if (!customElements.get("media-play-button")) {
  customElements.define(
    "media-play-button",
    class extends HTMLElement {
      connectedCallback() {
        this.setAttribute("data-testid", "shadow-play-button");
      }
    },
  );
}
if (!customElements.get("media-controller-mock")) {
  customElements.define(
    "media-controller-mock",
    class extends HTMLElement {
      connectedCallback() {
        if (!this.shadowRoot) {
          const shadow = this.attachShadow({ mode: "open" });
          shadow.appendChild(document.createElement("media-play-button"));
        }
      }
    },
  );
}
if (!customElements.get("mux-player-mock")) {
  customElements.define(
    "mux-player-mock",
    class extends HTMLElement {
      connectedCallback() {
        if (!this.shadowRoot) {
          const shadow = this.attachShadow({ mode: "open" });
          shadow.appendChild(document.createElement("media-controller-mock"));
        }
      }
    },
  );
}

let currentErrorEvent = { detail: { data: { type: "networkError" } } };
// Override the global mock for @mux/mux-player-react/lazy
jest.mock("@mux/mux-player-react/lazy", () => {
  // @ts-expect-error - MuxPlayer mock
  return forwardRef(({ onError, onPlay, onPause }, ref) => {
    return React.createElement(
      "mux-player-mock",
      { ref, "data-testid": "mux-player" },
      <button
        data-testid="error-button"
        onClick={() => onError(currentErrorEvent)}
      >
        Error
      </button>,
      <button data-testid="play-button" onClick={onPlay}>
        Play
      </button>,
      <button data-testid="pause-button" onClick={onPause}>
        Pause
      </button>,
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
    renderWithTheme(<VideoPlayer {...defaultProps} />);
    const errorButton = screen.getByTestId("error-button");
    mockErrorReporter.mockClear();

    await userEvent.click(errorButton);

    expect(mockErrorReporter).not.toHaveBeenCalled();
  });

  it("handles and reports unknown error event", async () => {
    renderWithTheme(<VideoPlayer {...defaultProps} />);
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
    renderWithTheme(<VideoPlayer {...defaultProps} />);
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
    renderWithTheme(<VideoPlayer {...defaultProps} />);
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

  it("focuses the play button when autoFocusPlayButton is true", () => {
    jest.useFakeTimers();
    renderWithTheme(<VideoPlayer {...defaultProps} autoFocusPlayButton />);

    const muxPlayer = screen.getByTestId("mux-player");
    const mediaController = muxPlayer.shadowRoot?.querySelector(
      "media-controller-mock",
    );
    const shadowPlayButton = mediaController?.shadowRoot?.querySelector(
      "[data-testid='shadow-play-button']",
    );
    ok(shadowPlayButton instanceof HTMLElement);

    expect(shadowPlayButton).toBeInTheDocument();

    const focusSpy = jest.spyOn(shadowPlayButton, "focus");

    jest.advanceTimersByTime(100);

    expect(focusSpy).toHaveBeenCalled();

    focusSpy.mockRestore();
    jest.useRealTimers();
  });
});
