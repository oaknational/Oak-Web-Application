import { renderHook, act } from "@testing-library/react";

import { usePupilReviewExperience } from "./usePupilReviewExperience";

import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import { getDefaultLessonProgressState } from "@/context/PupilLessonProgress/pupilLessonProgressHelpers";

let asPath = "/pupils/lessons/lesson-1/review";
const routerPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({ asPath, push: routerPush }),
}));

const track = {
  trackLessonSummaryReviewed: jest.fn(),
  trackActivityResultsShared: jest.fn(),
};
jest.mock("@/context/PupilLessonAnalytics/usePupilLessonAnalytics", () => ({
  usePupilLessonAnalytics: () => track,
}));

const logAttempt = jest.fn(() => "attempt-1");
jest.mock("@/hooks/useOakPupil", () => ({
  useOakPupil: () => ({ logAttempt }),
}));

jest.mock("@/hooks/useAssignmentSearchParams", () => ({
  useAssignmentSearchParams: () => ({
    isClassroomAssignment: false,
    classroomAssignmentChecked: true,
  }),
}));

const writeText = jest.fn();

const reviewSections = ["intro", "starter-quiz", "video", "exit-quiz"] as const;

const renderReview = () =>
  renderHook(() =>
    usePupilReviewExperience({
      browseData: lessonBrowseDataFixture({}),
      lessonContent: lessonContentFixture({}),
    }),
  );

const completeLesson = () => {
  usePupilLessonProgress.setState({
    isLessonComplete: true,
    sectionResults: {
      intro: { isComplete: true },
      "starter-quiz": { isComplete: true, grade: 1, numQuestions: 1 },
      video: { isComplete: true },
      "exit-quiz": { isComplete: true, grade: 1, numQuestions: 1 },
    },
  } as never);
};

beforeEach(() => {
  jest.clearAllMocks();
  asPath = "/pupils/lessons/lesson-1/review";
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
  usePupilLessonProgress.setState(getDefaultLessonProgressState());
  usePupilLessonProgress.getState().initialiseLessonProgress({
    lessonSlug: "lesson-1",
    lessonReviewSections: [...reviewSections],
  });
});

describe("usePupilReviewExperience", () => {
  it("redirects to overview when the lesson is not complete", () => {
    renderReview();
    expect(routerPush).toHaveBeenCalledWith(
      "/pupils/lessons/lesson-1/overview",
    );
  });

  it("does not redirect an incomplete read-only assignment away from review", () => {
    usePupilLessonProgress.getState().setReadOnly(true);

    renderReview();

    expect(routerPush).not.toHaveBeenCalled();
  });

  it("logs an attempt and tracks the summary when the lesson is complete", () => {
    completeLesson();
    renderReview();

    expect(logAttempt).toHaveBeenCalledWith(expect.anything(), true);
    expect(track.trackLessonSummaryReviewed).toHaveBeenCalledTimes(1);
    expect(routerPush).not.toHaveBeenCalled();
  });

  it("copy link logs a shareable attempt, writes to the clipboard, and tracks sharing", () => {
    completeLesson();
    const { result } = renderReview();

    act(() => result.current.handleCopyLink());

    expect(logAttempt).toHaveBeenCalledWith(expect.anything(), false);
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(track.trackActivityResultsShared).toHaveBeenCalledTimes(1);
    expect(result.current.isAttemptingShare).toBe("shared");
  });

  it("go to overview navigates to the overview section", () => {
    completeLesson();
    const { result } = renderReview();

    act(() => result.current.handleGoToOverview());
    expect(routerPush).toHaveBeenCalledWith(
      "/pupils/lessons/lesson-1/overview",
    );
  });
});
