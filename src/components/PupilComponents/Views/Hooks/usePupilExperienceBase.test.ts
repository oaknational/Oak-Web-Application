import { renderHook, act } from "@testing-library/react";

import { usePupilExperienceBase } from "./usePupilExperienceBase";

let asPath = "/pupils/lessons/lesson-1/overview";
const routerPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({ asPath, push: routerPush }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  asPath = "/pupils/lessons/lesson-1/overview";
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
});
