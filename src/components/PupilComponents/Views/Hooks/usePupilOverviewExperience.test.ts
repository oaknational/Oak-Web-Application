import { renderHook, act } from "@testing-library/react";

import { usePupilOverviewExperience } from "./usePupilOverviewExperience";

import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { pickAvailableSectionsForLesson } from "@/components/PupilComponents/Views/ViewHelpers";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import { getDefaultLessonProgressState } from "@/context/PupilLessonProgress/pupilLessonProgressHelpers";

let asPath = "/pupils/lessons/lesson-1/overview";
const routerPush = jest.fn();
const routerReplace = jest.fn();
const routerBack = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    asPath,
    push: routerPush,
    replace: routerReplace,
    back: routerBack,
  }),
}));

const track = {
  trackSectionStarted: jest.fn(),
  trackLessonStarted: jest.fn(),
  trackLessonAbandoned: jest.fn(),
  trackContentGuidanceAccepted: jest.fn(),
  trackContentGuidanceDeclined: jest.fn(),
};
jest.mock("@/context/PupilLessonAnalytics/usePupilLessonAnalytics", () => ({
  usePupilLessonAnalytics: () => track,
}));

let isClassroomAssignment: boolean | null = false;
let classroomAssignmentChecked = true;
jest.mock("@/hooks/useAssignmentSearchParams", () => ({
  useAssignmentSearchParams: () => ({
    isClassroomAssignment,
    classroomAssignmentChecked,
  }),
}));

const reviewSections = ["intro", "starter-quiz", "video", "exit-quiz"] as const;

const renderOverview = (
  props: Partial<Parameters<typeof usePupilOverviewExperience>[0]> = {},
) =>
  renderHook(() =>
    usePupilOverviewExperience({
      browseData: lessonBrowseDataFixture({}),
      lessonContent: lessonContentFixture({}),
      backUrl: "/back-url",
      ...props,
    }),
  );

beforeEach(() => {
  jest.clearAllMocks();
  asPath = "/pupils/lessons/lesson-1/overview";
  isClassroomAssignment = false;
  classroomAssignmentChecked = true;
  usePupilLessonProgress.setState(getDefaultLessonProgressState());
  usePupilLessonProgress.getState().initialiseLessonProgress({
    lessonSlug: "lesson-1",
    lessonReviewSections: [...reviewSections],
  });
});

describe("usePupilOverviewExperience", () => {
  it("builds a section item only for sections the lesson has content for", () => {
    const lessonContent = lessonContentFixture({});
    const { result } = renderOverview({ lessonContent });

    // The fixture has no exit quiz, so it is hidden entirely rather than shown
    // disabled with "0 questions".
    expect(result.current.sectionItems.map((item) => item.section)).toEqual(
      pickAvailableSectionsForLesson(lessonContent),
    );
    expect(
      result.current.sectionItems.some((item) => item.section === "exit-quiz"),
    ).toBe(false);
  });

  it("on proceed: tracks lesson + section started and navigates to the next incomplete section", () => {
    const { result } = renderOverview();
    act(() => result.current.handleProceedToNextSectionClick());

    expect(track.trackLessonStarted).toHaveBeenCalledTimes(1);
    expect(track.trackSectionStarted).toHaveBeenCalledTimes(1);
    expect(routerPush).toHaveBeenCalledWith("/pupils/lessons/lesson-1/intro");
    expect(usePupilLessonProgress.getState().lessonStarted).toBe(true);
  });

  it("accepting content guidance dismisses it and tracks acceptance", () => {
    const { result } = renderOverview();
    const args = { contentGuidance: [] } as never;
    act(() => result.current.handleContentGuidanceAccept(args));

    expect(usePupilLessonProgress.getState().contentGuidanceDismissed).toBe(
      true,
    );
    expect(track.trackContentGuidanceAccepted).toHaveBeenCalledWith(args);
  });

  it("declining content guidance replaces with backUrl when not a classroom assignment", () => {
    const { result } = renderOverview();
    const args = { contentGuidance: [] } as never;
    act(() => result.current.handleContentGuidanceDecline(args));

    expect(track.trackContentGuidanceDeclined).toHaveBeenCalledWith(args);
    expect(routerReplace).toHaveBeenCalledWith("/back-url");
  });

  it("declining content guidance posts a close message in a classroom assignment", () => {
    isClassroomAssignment = true;
    const postMessage = jest
      .spyOn(window.parent, "postMessage")
      .mockImplementation(() => {});
    const { result } = renderOverview();
    act(() => result.current.handleContentGuidanceDecline({} as never));

    expect(postMessage).toHaveBeenCalledWith(
      { type: "Classroom", action: "closeIframe" },
      "https://classroom.google.com",
    );
    expect(routerReplace).not.toHaveBeenCalled();
    postMessage.mockRestore();
  });

  it("tracks lesson abandoned on view-all-lessons click when the lesson is incomplete", () => {
    const { result } = renderOverview();
    act(() => result.current.handleViewAllLessonsClick());
    expect(track.trackLessonAbandoned).toHaveBeenCalledTimes(1);
  });

  it("allows content guidance to open immediately for non-classroom lessons", () => {
    usePupilLessonProgress.setState(getDefaultLessonProgressState());
    const { result } = renderOverview();

    expect(result.current.contentGuidanceCanOpen).toBe(true);
  });

  it("waits for lesson progress init before allowing content guidance for classroom assignments", () => {
    isClassroomAssignment = true;
    usePupilLessonProgress.setState(getDefaultLessonProgressState());
    const { result, rerender } = renderOverview();

    expect(result.current.contentGuidanceCanOpen).toBe(false);

    act(() => {
      usePupilLessonProgress.getState().initialiseLessonProgress({
        lessonSlug: lessonBrowseDataFixture({}).lessonSlug,
        lessonReviewSections: [...reviewSections],
      });
    });
    rerender();

    expect(result.current.contentGuidanceCanOpen).toBe(true);
  });

  it("does not allow content guidance to open until classroom assignment check completes", () => {
    classroomAssignmentChecked = false;
    const { result } = renderOverview();

    expect(result.current.contentGuidanceCanOpen).toBe(false);
  });
});
