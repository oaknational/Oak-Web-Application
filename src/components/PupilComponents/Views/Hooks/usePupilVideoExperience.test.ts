import { renderHook, act } from "@testing-library/react";

import { usePupilVideoExperience } from "./usePupilVideoExperience";

import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import { getDefaultLessonProgressState } from "@/context/PupilLessonProgress/pupilLessonProgressHelpers";

let asPath = "/pupils/lessons/lesson-1/video";
const routerPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({ asPath, push: routerPush }),
}));

const track = {
  trackSectionStarted: jest.fn(),
  trackLessonStarted: jest.fn(),
  trackLessonCompleted: jest.fn(),
  trackVideoCompleted: jest.fn(),
  trackVideoAbandoned: jest.fn(),
};
jest.mock("@/context/PupilLessonAnalytics/usePupilLessonAnalytics", () => ({
  usePupilLessonAnalytics: () => track,
}));

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

const renderVideo = (
  props: Partial<Parameters<typeof usePupilVideoExperience>[0]> = {},
) =>
  renderHook(() =>
    usePupilVideoExperience({
      browseData: lessonBrowseDataFixture({}),
      lessonContent: lessonContentFixture({}),
      additionalFiles: null,
      ...props,
    }),
  );

beforeEach(() => {
  jest.clearAllMocks();
  asPath = "/pupils/lessons/lesson-1/video";
  usePupilLessonProgress.setState(getDefaultLessonProgressState());
  usePupilLessonProgress.getState().initialiseLessonProgress({
    lessonSlug: "lesson-1",
    lessonReviewSections: [...reviewSections],
  });
});

describe("usePupilVideoExperience", () => {
  it("defaults the proceed label before the video is complete", () => {
    const { result } = renderVideo();
    expect(result.current.proceedLabel).toBe("I've finished the video");
  });

  it("on first proceed: completes the video section, tracks completion, and navigates", () => {
    const { result } = renderVideo();
    act(() => result.current.handleProceed());

    expect(
      usePupilLessonProgress.getState().sectionResults.video?.isComplete,
    ).toBe(true);
    expect(track.trackVideoCompleted).toHaveBeenCalledTimes(1);
    expect(routerPush).toHaveBeenCalledWith(
      "/pupils/lessons/lesson-1/overview",
    );
  });

  it("back to overview tracks video abandoned when incomplete and navigates", () => {
    const { result } = renderVideo();
    act(() => result.current.handleBackToOverview());

    expect(track.trackVideoAbandoned).toHaveBeenCalledTimes(1);
    expect(usePupilLessonProgress.getState().lessonStarted).toBe(true);
    expect(routerPush).toHaveBeenCalledWith(
      "/pupils/lessons/lesson-1/overview",
    );
  });

  it("toggling sign language flips the flag and records it on the video result", () => {
    const { result } = renderVideo();
    act(() => result.current.handleSignLanguageToggle());

    expect(result.current.signLanguageOn).toBe(true);
    expect(
      usePupilLessonProgress.getState().sectionResults.video?.signedOpened,
    ).toBe(true);
  });

  it("opening the transcript records it on the video result", () => {
    const { result } = renderVideo();
    act(() => result.current.handleTranscriptToggled({ isOpen: true }));

    expect(
      usePupilLessonProgress.getState().sectionResults.video?.transcriptOpened,
    ).toBe(true);
  });

  it("additional files download starts the download", () => {
    const { result } = renderVideo();
    act(() => result.current.handleAdditionalFilesDownload());
    expect(startAdditionalFilesDownload).toHaveBeenCalledTimes(1);
  });

  it("persists the video result on a non-playing event", () => {
    const { result } = renderVideo();
    act(() =>
      result.current.handleVideoEvent({
        event: "pause",
        timeElapsed: 12,
        duration: 100,
        muted: true,
      }),
    );

    const videoResult = usePupilLessonProgress.getState().sectionResults.video;
    expect(videoResult?.played).toBe(true);
    expect(videoResult?.duration).toBe(100);
    expect(videoResult?.muted).toBe(true);
    expect(videoResult?.timeElapsed).toBe(12);
  });

  it("flushes the accumulated video result to the store on completion (PUPIL-1770)", () => {
    const { result } = renderVideo();
    act(() =>
      result.current.handleVideoEvent({
        event: "playing",
        timeElapsed: 5,
        duration: 200,
        muted: false,
      }),
    );
    expect(
      usePupilLessonProgress.getState().sectionResults.video?.duration,
    ).not.toBe(200);

    act(() => result.current.handleProceed());

    const video = usePupilLessonProgress.getState().sectionResults.video;
    expect(video?.isComplete).toBe(true);
    expect(video?.played).toBe(true);
    expect(video?.duration).toBe(200);
  });
});
