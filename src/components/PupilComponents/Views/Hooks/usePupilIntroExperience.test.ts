import { renderHook, act } from "@testing-library/react";

import { usePupilIntroExperience } from "./usePupilIntroExperience";

import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import { getDefaultLessonProgressState } from "@/context/PupilLessonProgress/pupilLessonProgressHelpers";

let asPath = "/pupils/lessons/lesson-1/intro";
const routerPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({ asPath, push: routerPush }),
}));

const track = {
  trackSectionStarted: jest.fn(),
  trackLessonStarted: jest.fn(),
  trackLessonCompleted: jest.fn(),
  trackIntroCompleted: jest.fn(),
  trackIntroAbandoned: jest.fn(),
  trackWorksheetDownloaded: jest.fn(),
};
jest.mock("@/context/PupilLessonAnalytics/usePupilLessonAnalytics", () => ({
  usePupilLessonAnalytics: () => track,
}));

const startDownload = jest.fn(() => Promise.resolve(true));
jest.mock(
  "@/components/PupilComponents/Views/ViewHelpers/Intro/useWorksheetDownload",
  () => ({
    useWorksheetDownload: () => ({ startDownload, isDownloading: false }),
  }),
);

const startAdditionalFilesDownload = jest.fn();
jest.mock(
  "@/components/PupilComponents/Views/ViewHelpers/Intro/useAdditionalFilesDownload",
  () => ({
    useAdditionalFilesDownload: () => ({
      startAdditionalFilesDownload,
      isAdditionalFilesDownloading: false,
    }),
  }),
);

const reviewSections = ["intro", "starter-quiz", "video", "exit-quiz"] as const;

const renderIntro = (
  props: Partial<Parameters<typeof usePupilIntroExperience>[0]> = {},
) =>
  renderHook(() =>
    usePupilIntroExperience({
      browseData: lessonBrowseDataFixture({}),
      lessonContent: lessonContentFixture({}),
      hasWorksheet: true,
      additionalFiles: null,
      ...props,
    }),
  );

beforeEach(() => {
  jest.clearAllMocks();
  asPath = "/pupils/lessons/lesson-1/intro";
  usePupilLessonProgress.setState(getDefaultLessonProgressState());
  usePupilLessonProgress.getState().initialiseLessonProgress({
    lessonSlug: "lesson-1",
    lessonReviewSections: [...reviewSections],
  });
});

describe("usePupilIntroExperience", () => {
  it("on first proceed: completes the intro section, tracks completion, and navigates to overview", () => {
    const { result } = renderIntro();
    act(() => result.current.handleProceed());

    expect(track.trackIntroCompleted).toHaveBeenCalledTimes(1);
    expect(
      usePupilLessonProgress.getState().sectionResults.intro?.isComplete,
    ).toBe(true);
    expect(routerPush).toHaveBeenCalledWith(
      "/pupils/lessons/lesson-1/overview",
    );
  });

  it("when intro already complete: navigates to the next incomplete section", () => {
    usePupilLessonProgress.setState({
      sectionResults: {
        ...usePupilLessonProgress.getState().sectionResults,
        intro: { isComplete: true, worksheetAvailable: false },
      },
    } as never);
    const { result } = renderIntro();
    act(() => result.current.handleProceed());

    expect(routerPush).toHaveBeenCalledWith(
      "/pupils/lessons/lesson-1/starter-quiz",
    );
  });

  it("back to overview tracks intro abandoned when incomplete and navigates", () => {
    const { result } = renderIntro();
    act(() => result.current.handleBackToOverview());

    expect(track.trackIntroAbandoned).toHaveBeenCalledTimes(1);
    expect(routerPush).toHaveBeenCalledWith(
      "/pupils/lessons/lesson-1/overview",
    );
  });

  it("worksheet download updates progress, downloads, and tracks on success", async () => {
    const { result } = renderIntro();
    await act(async () => {
      await result.current.handleWorksheetDownload();
    });

    expect(
      usePupilLessonProgress.getState().sectionResults.intro
        ?.worksheetDownloaded,
    ).toBe(true);
    expect(startDownload).toHaveBeenCalledTimes(1);
    expect(track.trackWorksheetDownloaded).toHaveBeenCalledTimes(1);
  });

  it("worksheet download does not track when the download fails", async () => {
    startDownload.mockResolvedValueOnce(false);
    const { result } = renderIntro();
    await act(async () => {
      await result.current.handleWorksheetDownload();
    });

    expect(startDownload).toHaveBeenCalledTimes(1);
    expect(track.trackWorksheetDownloaded).not.toHaveBeenCalled();
  });

  it("additional files download updates progress and starts the download", () => {
    const { result } = renderIntro();
    act(() => result.current.handleAdditionalFilesDownload());

    expect(
      usePupilLessonProgress.getState().sectionResults.intro?.filesDownloaded,
    ).toBe(true);
    expect(startAdditionalFilesDownload).toHaveBeenCalledTimes(1);
  });
});
