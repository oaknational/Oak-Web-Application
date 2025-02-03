import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { fireEvent } from "@testing-library/dom";

import { PupilViewsVideo } from "./PupilVideo.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { LessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";
import { VideoPlayerProps } from "@/components/SharedComponents/VideoPlayer/VideoPlayer";
import { trackingEvents } from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";

const MockBrowseData = lessonBrowseDataFixture({});
const usePupilAnalyticsMock = {
  track: Object.fromEntries(trackingEvents.map((event) => [event, vi.fn()])),
  identify: vi.fn(),
  posthogDistinctId: "123",
};

vi.mock(
  "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics",
  () => {
    return {
      usePupilAnalytics: () => usePupilAnalyticsMock,
    };
  },
);

const useTrackSectionStartedMock = {
  trackSectionStarted: vi.fn(),
};

vi.mock("@/hooks/useTrackSectionStarted", () => {
  return {
    useTrackSectionStarted: () => useTrackSectionStartedMock,
  };
});

const useGetVideoTrackingDataMock = {
  getVideoTrackingData: vi.fn(),
};

vi.mock("@/hooks/useGetVideoTrackingData", () => {
  return {
    useGetVideoTrackingData: () => useGetVideoTrackingDataMock,
  };
});

const VideoPlayerMock = ({ userEventCallback }: Partial<VideoPlayerProps>) => {
  if (userEventCallback) {
    userEventCallback({
      event: "play",
      timeElapsed: 0,
      duration: 0,
      muted: false,
    });
  }
  return <span data-testid="video-player" />;
};

vi.mock("@/components/SharedComponents/VideoPlayer/VideoPlayer", () => ({
  default: ({ userEventCallback }: Partial<VideoPlayerProps>) => (
    <VideoPlayerMock userEventCallback={userEventCallback} />
  ),
}));

describe(PupilViewsVideo, () => {
  it("renders a video player", () => {
    const { queryByTestId } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsVideo
            videoMuxPlaybackId="123"
            videoWithSignLanguageMuxPlaybackId="234"
            lessonTitle="Introduction to The Canterbury Tales"
            transcriptSentences={[]}
            isLegacy={false}
            browseData={MockBrowseData}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    expect(queryByTestId("video-player")).toBeInTheDocument();
  });

  it("allows the transcript to be toggled open", async () => {
    const { queryByText, getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsVideo
            videoMuxPlaybackId="123"
            videoWithSignLanguageMuxPlaybackId="234"
            lessonTitle="Introduction to The Canterbury Tales"
            transcriptSentences={["hello there"]}
            isLegacy={false}
            browseData={MockBrowseData}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    expect(queryByText("hello there")).not.toBeVisible();

    await userEvent.click(getByText("Show transcript"));

    expect(queryByText("hello there")).toBeVisible();
  });

  it('completes the section when "I\'ve finished the video" is clicked', async () => {
    const completeActivity = vi.fn();
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider
          value={createLessonEngineContext({ completeActivity })}
        >
          <PupilViewsVideo
            videoMuxPlaybackId="123"
            videoWithSignLanguageMuxPlaybackId="234"
            lessonTitle="Introduction to The Canterbury Tales"
            transcriptSentences={["hello there"]}
            isLegacy={false}
            browseData={MockBrowseData}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    await userEvent.click(getByText("I've finished the video"));

    expect(completeActivity).toHaveBeenCalled();
  });

  it('sets the current section to "overview" when the back button is clicked', async () => {
    const updateCurrentSection = vi.fn();
    const { getByLabelText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider
          value={createLessonEngineContext({ updateCurrentSection })}
        >
          <PupilViewsVideo
            videoMuxPlaybackId="123"
            videoWithSignLanguageMuxPlaybackId="234"
            lessonTitle="Introduction to The Canterbury Tales"
            transcriptSentences={["hello there"]}
            isLegacy={false}
            browseData={MockBrowseData}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    await userEvent.click(getByLabelText("Back"));

    expect(updateCurrentSection).toHaveBeenCalledWith("overview");
  });

  it("displays a message when there is no video ", async () => {
    const updateCurrentSection = vi.fn();
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider
          value={createLessonEngineContext({ updateCurrentSection })}
        >
          <PupilViewsVideo
            videoMuxPlaybackId={undefined}
            lessonTitle="Introduction to The Canterbury Tales"
            transcriptSentences={["hello there"]}
            isLegacy
            browseData={MockBrowseData}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    expect(
      getByText("This lesson does not contain a video"),
    ).toBeInTheDocument();
  });

  it('toggles the sign language version when "Show sign language" is clicked', async () => {
    const { getByText, queryByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsVideo
            videoMuxPlaybackId="123"
            videoWithSignLanguageMuxPlaybackId="234"
            lessonTitle="Introduction to The Canterbury Tales"
            transcriptSentences={["hello there"]}
            isLegacy={false}
            browseData={MockBrowseData}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    await userEvent.click(getByText("Show sign language"));

    expect(queryByText("Hide sign language")).toBeInTheDocument();
  });

  it("updates the section result when the video plays", () => {
    const updateSectionResult = vi.fn();

    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider
          value={createLessonEngineContext({ updateSectionResult })}
        >
          <PupilViewsVideo
            videoMuxPlaybackId="123"
            videoWithSignLanguageMuxPlaybackId="234"
            lessonTitle="Introduction to The Canterbury Tales"
            transcriptSentences={["hello there"]}
            isLegacy={false}
            browseData={MockBrowseData}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    expect(updateSectionResult).toHaveBeenCalledWith({
      played: true,
      duration: 0,
      timeElapsed: 0,
      muted: false,
      signedOpened: false,
      transcriptOpened: false,
    });
  });
  it("sends tracking data when a video is completed", () => {
    const lessonActivityCompletedLessonVideo = vi.fn();

    vi.spyOn(
      usePupilAnalyticsMock.track,
      "lessonActivityCompletedLessonVideo",
    ).mockImplementation(lessonActivityCompletedLessonVideo);

    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsVideo
            videoMuxPlaybackId="123"
            videoWithSignLanguageMuxPlaybackId="234"
            lessonTitle="Introduction to The Canterbury Tales"
            transcriptSentences={["hello there"]}
            isLegacy={false}
            browseData={MockBrowseData}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    fireEvent.click(getByRole("link", { name: /I've finished the video/i }));

    expect(lessonActivityCompletedLessonVideo).toHaveBeenCalled();
  });
  it("sends abandoned event data when backbutton clicked", () => {
    const lessonActivityAbandonedLessonVideo = vi.fn();

    vi.spyOn(
      usePupilAnalyticsMock.track,
      "lessonActivityAbandonedLessonVideo",
    ).mockImplementation(lessonActivityAbandonedLessonVideo);

    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsVideo
            videoMuxPlaybackId="123"
            videoWithSignLanguageMuxPlaybackId="234"
            lessonTitle="Introduction to The Canterbury Tales"
            transcriptSentences={["hello there"]}
            isLegacy={false}
            browseData={MockBrowseData}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    fireEvent.click(getByRole("link", { name: /Back/i }));
    expect(lessonActivityAbandonedLessonVideo).toHaveBeenCalledTimes(1);
  });
  it("calls trackSectionStarted when video is complete and when continue lesson button is pressed", () => {
    const trackSectionStarted = vi.fn();
    vi.spyOn(
      useTrackSectionStartedMock,
      "trackSectionStarted",
    ).mockImplementation(trackSectionStarted);
    const context = createLessonEngineContext({
      currentSection: "video",
      sectionResults: {
        video: {
          isComplete: true,
          played: true,
          duration: 0,
          timeElapsed: 0,
          muted: false,
          signedOpened: false,
          transcriptOpened: false,
        },
      },
    });

    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={context}>
          <PupilViewsVideo
            videoMuxPlaybackId="123"
            videoWithSignLanguageMuxPlaybackId="234"
            lessonTitle="Introduction to The Canterbury Tales"
            transcriptSentences={["hello there"]}
            isLegacy={false}
            browseData={MockBrowseData}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    fireEvent.click(getByRole("link", { name: /Continue lesson/i }));
    expect(trackSectionStarted).toHaveBeenCalledTimes(1);
  });
});
