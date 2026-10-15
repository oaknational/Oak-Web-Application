import { renderHook, act } from "@testing-library/react";

import { usePupilExperienceBase } from "./usePupilExperienceBase";

import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import { getDefaultLessonProgressState } from "@/context/PupilLessonProgress/pupilLessonProgressHelpers";

let asPath = "/pupils/lessons/lesson-1/overview";
const routerPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({ asPath, push: routerPush }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  asPath = "/pupils/lessons/lesson-1/overview";
  usePupilLessonProgress.setState(getDefaultLessonProgressState());
  usePupilLessonProgress.getState().setRefreshReadOnly(async () => false);
});

describe("usePupilExperienceBase", () => {
  it("builds a section href on the current route", () => {
    const { result } = renderHook(() => usePupilExperienceBase());
    expect(result.current.getSectionHref("video")).toBe(
      "/pupils/lessons/lesson-1/video",
    );
  });

  it("drops the section query param but preserves the rest", () => {
    asPath = "/pupils/lessons/lesson-1/overview?section=foo&assignment=123";
    const { result } = renderHook(() => usePupilExperienceBase());
    expect(result.current.getSectionHref("intro")).toBe(
      "/pupils/lessons/lesson-1/intro?assignment=123",
    );
  });

  it("works on a shared-variant route (route-agnostic)", () => {
    asPath = "/pupils/lessons/lesson-1/shared/quizzes-only/overview";
    const { result } = renderHook(() => usePupilExperienceBase());
    expect(result.current.getSectionHref("exit-quiz")).toBe(
      "/pupils/lessons/lesson-1/shared/quizzes-only/exit-quiz",
    );
  });

  it("navigates to a section via router.push", () => {
    const { result } = renderHook(() => usePupilExperienceBase());
    act(() => result.current.goToSection("starter-quiz"));
    expect(routerPush).toHaveBeenCalledWith(
      "/pupils/lessons/lesson-1/starter-quiz",
    );
  });

  it("redirects to review when the current progress state is read-only", () => {
    usePupilLessonProgress.getState().setReadOnly(true);

    renderHook(() => usePupilExperienceBase());

    expect(routerPush).toHaveBeenCalledWith("/pupils/lessons/lesson-1/review");
  });

  it("allows progression immediately from cached writable state without refreshing", () => {
    const refreshReadOnly = jest.fn(
      () => new Promise<boolean>(() => undefined),
    );
    usePupilLessonProgress.getState().setRefreshReadOnly(refreshReadOnly);

    const { result } = renderHook(() => usePupilExperienceBase());
    let canProgress: boolean | undefined;
    act(() => {
      canProgress = result.current.ensureCanProgress();
    });

    expect(refreshReadOnly).not.toHaveBeenCalled();
    expect(canProgress).toBe(true);
    expect(routerPush).not.toHaveBeenCalled();
  });

  it("blocks progression immediately from cached read-only state", () => {
    const refreshReadOnly = jest.fn(
      () => new Promise<boolean>(() => undefined),
    );
    usePupilLessonProgress.getState().setRefreshReadOnly(refreshReadOnly);

    const { result } = renderHook(() => usePupilExperienceBase());
    act(() => usePupilLessonProgress.getState().setReadOnly(true));
    routerPush.mockClear();

    let canProgress: boolean | undefined;
    act(() => {
      canProgress = result.current.ensureCanProgress();
    });

    expect(refreshReadOnly).not.toHaveBeenCalled();
    expect(canProgress).toBe(false);
    expect(routerPush).toHaveBeenCalledWith("/pupils/lessons/lesson-1/review");
  });
});
