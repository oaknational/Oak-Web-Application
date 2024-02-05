import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import userEvent from "@testing-library/user-event";

import { PupilViewsVideo } from "./PupilVideo.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import {
  LessonEngineContext,
  LessonEngineContextType,
} from "@/components/PupilComponents/LessonEngineProvider";

jest.mock("@/components/SharedComponents/VideoPlayer/VideoPlayer", () => {
  return () => <span data-testid="video-player" />;
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
            isLegacyLicense={false}
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
            isLegacyLicense={false}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    expect(queryByText("hello there")).not.toBeVisible();

    await userEvent.click(getByText("Show transcript"));

    expect(queryByText("hello there")).toBeVisible();
  });
});

function createLessonEngineContext(
  overrides?: Partial<LessonEngineContextType>,
): NonNullable<LessonEngineContextType> {
  return {
    currentSection: "video",
    completedSections: [],
    sectionResults: {},
    getIsComplete: jest.fn(),
    completeSection: jest.fn(),
    updateCurrentSection: jest.fn(),
    proceedToNextSection: jest.fn(),
    updateQuizResult: jest.fn(),
    ...overrides,
  };
}
