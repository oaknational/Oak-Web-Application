import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import userEvent from "@testing-library/user-event";

import { PupilViewsVideo } from "./PupilVideo.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { LessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";
import { VideoPlayerProps } from "@/components/SharedComponents/VideoPlayer/VideoPlayer";

const VideoPlayerMock = ({ userEventCallback }: Partial<VideoPlayerProps>) => {
  if (userEventCallback) {
    userEventCallback({ event: "play", timeElapsed: 0, duration: 0 });
  }
  return <span data-testid="video-player" />;
};

jest.mock("@/components/SharedComponents/VideoPlayer/VideoPlayer", () => {
  return ({ userEventCallback }: Partial<VideoPlayerProps>) => (
    <VideoPlayerMock userEventCallback={userEventCallback} />
  );
});

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
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    expect(queryByText("hello there")).not.toBeVisible();

    await userEvent.click(getByText("Show transcript"));

    expect(queryByText("hello there")).toBeVisible();
  });

  it('completes the section when "I\'ve finished the video" is clicked', async () => {
    const completeSection = jest.fn();
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider
          value={createLessonEngineContext({ completeSection })}
        >
          <PupilViewsVideo
            videoMuxPlaybackId="123"
            videoWithSignLanguageMuxPlaybackId="234"
            lessonTitle="Introduction to The Canterbury Tales"
            transcriptSentences={["hello there"]}
            isLegacy={false}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    await userEvent.click(getByText("I've finished the video"));

    expect(completeSection).toHaveBeenCalled();
  });

  it('sets the current section to "overview" when the back button is clicked', async () => {
    const updateCurrentSection = jest.fn();
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
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    await userEvent.click(getByLabelText("Back"));

    expect(updateCurrentSection).toHaveBeenCalledWith("overview");
  });

  it("displays a message when there is no video ", async () => {
    const updateCurrentSection = jest.fn();
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
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    await userEvent.click(getByText("Show sign language"));

    expect(queryByText("Hide sign language")).toBeInTheDocument();
  });

  it("updates the section result when the video plays", () => {
    const updateSectionResult = jest.fn();

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
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    expect(updateSectionResult).toHaveBeenCalledWith({
      played: true,
      duration: 0,
      timeElapsed: 0,
    });
  });
});
