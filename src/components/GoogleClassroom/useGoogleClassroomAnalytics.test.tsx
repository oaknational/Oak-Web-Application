import { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react";

import {
  GoogleClassroomAnalyticsProvider,
  useGoogleClassroomAnalytics,
} from "./useGoogleClassroomAnalytics";

import type { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import useAnalytics from "@/context/Analytics/useAnalytics";

const trackMock = {
  browseRefined: jest.fn(),
  classroomLessonSelected: jest.fn(),
  classroomLessonPreviewed: jest.fn(),
  classroomAddOnOpened: jest.fn(),
  classroomSignInStarted: jest.fn(),
  classroomSignInCompleted: jest.fn(),
  classroomLessonsAttached: jest.fn(),
};

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(
    () =>
      new URLSearchParams("courseId=course-1&itemId=item-1&login_hint=hint-1"),
  ),
}));

jest.mock("@oaknational/google-classroom-addon/ui", () => ({
  useGoogleClassroomAddonStore: jest.fn().mockReturnValue(null),
}));

jest.mock("@/browser-lib/google-classroom/getClientEnvironment", () => ({
  __esModule: true,
  getClientEnvironment: jest.fn(() => "web-browser"),
}));

const mockUseAnalytics = useAnalytics as jest.MockedFunction<
  typeof useAnalytics
>;

const wrapper = ({ children }: { children: ReactNode }) => (
  <GoogleClassroomAnalyticsProvider>
    {children}
  </GoogleClassroomAnalyticsProvider>
);

const lesson = {
  lessonSlug: "lesson-a",
  unitSlug: "unit-a",
  isLegacy: false,
  lessonData: {
    title: "Lesson A",
    lessonReleaseDate: "2024-01-01",
  },
} as const;

const legacyLesson = {
  lessonSlug: "legacy-lesson",
  unitSlug: "legacy-unit",
  isLegacy: true,
  lessonData: {
    title: "Legacy Lesson",
    lessonReleaseDate: null,
  },
} as const;

describe("useGoogleClassroomAnalytics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    mockUseAnalytics.mockReturnValue({
      track: trackMock as unknown as TrackFns,
      identify: jest.fn(),
      alias: jest.fn(),
      posthogDistinctId: null,
    });
  });

  it("builds browseRefined payloads for subject selection", () => {
    const { result } = renderHook(() => useGoogleClassroomAnalytics(), {
      wrapper,
    });

    act(() => {
      result.current.trackSubjectSelected({
        programmeFields: {
          subjectSlug: "maths",
        } as never,
      });
    });

    expect(trackMock.browseRefined).toHaveBeenCalledWith(
      expect.objectContaining({
        platform: "google-classroom",
        product: "teacher lesson resources",
        analyticsUseCase: "Teacher",
        componentType: "subject_card",
        filterType: "Subject filter",
        filterValue: "maths",
        googleLoginHint: "hint-1",
        clientEnvironment: "web-browser",
      }),
    );
  });

  it("builds browseRefined payloads for year selection", () => {
    const { result } = renderHook(() => useGoogleClassroomAnalytics(), {
      wrapper,
    });

    act(() => {
      result.current.trackYearSelected({
        yearSlug: "year-7",
      });
    });

    expect(trackMock.browseRefined).toHaveBeenCalledWith(
      expect.objectContaining({
        componentType: "year_group_button",
        filterType: "Year filter",
        filterValue: "year-7",
      }),
    );
  });

  it("builds browseRefined payloads for option selection", () => {
    const { result } = renderHook(() => useGoogleClassroomAnalytics(), {
      wrapper,
    });

    act(() => {
      result.current.trackOptionSelected("examboard", {
        factorSlug: "aqa",
      });
    });

    expect(trackMock.browseRefined).toHaveBeenCalledWith(
      expect.objectContaining({
        componentType: "programme_card",
        filterType: "Exam board filter",
        filterValue: "aqa",
        activeFilters: {
          tier: undefined,
          examboard: "aqa",
          pathway: undefined,
        },
      }),
    );
  });

  it("builds browseRefined payloads for unit selection", () => {
    const { result } = renderHook(() => useGoogleClassroomAnalytics(), {
      wrapper,
    });

    act(() => {
      result.current.trackUnitSelected({
        unitSlug: "algebra-1",
      });
    });

    expect(trackMock.browseRefined).toHaveBeenCalledWith(
      expect.objectContaining({
        componentType: "unit_card",
        filterType: "Unit filter",
        filterValue: "algebra-1",
      }),
    );
  });

  it("builds lesson selected payloads from lesson context", () => {
    const { result } = renderHook(() => useGoogleClassroomAnalytics(), {
      wrapper,
    });

    act(() => {
      result.current.trackLessonSelected({
        lesson: lesson as never,
        unitData: { title: "Unit A" } as never,
        programmeFields: {
          year: "Year 7",
          yearSlug: "year-7",
          subject: "Maths",
          subjectSlug: "maths",
          tierDescription: "Higher",
          examboard: "AQA",
          pathway: "combined-higher",
        } as never,
      });
    });

    expect(trackMock.classroomLessonSelected).toHaveBeenCalledWith(
      expect.objectContaining({
        lessonName: "Lesson A",
        lessonSlug: "lesson-a",
        lessonReleaseCohort: "2023-2026",
        lessonReleaseDate: "2024-01-01",
        unitName: "Unit A",
        unitSlug: "unit-a",
        yearGroupName: "Year 7",
        subjectSlug: "maths",
        googleLoginHint: "hint-1",
        clientEnvironment: "web-browser",
      }),
    );
  });

  it("builds lesson previewed payloads with legacy and unreleased fallbacks", () => {
    const { result } = renderHook(() => useGoogleClassroomAnalytics(), {
      wrapper,
    });

    act(() => {
      result.current.trackLessonPreviewed({
        lesson: legacyLesson as never,
      });
    });

    expect(trackMock.classroomLessonPreviewed).toHaveBeenCalledWith(
      expect.objectContaining({
        lessonName: "Legacy Lesson",
        lessonReleaseCohort: "2020-2023",
        lessonReleaseDate: "unreleased",
      }),
    );
  });

  it("builds classroomAddOnOpened payloads", () => {
    const { result } = renderHook(() => useGoogleClassroomAnalytics(), {
      wrapper,
    });

    act(() => {
      result.current.trackAddOnOpened({
        analyticsUseCase: "Teacher",
      });
    });

    expect(trackMock.classroomAddOnOpened).toHaveBeenCalledWith(
      expect.objectContaining({
        platform: "google-classroom",
        product: "google classroom addon",
        analyticsUseCase: "Teacher",
        componentType: "page view",
        clientEnvironment: "web-browser",
      }),
    );
  });

  it("tracks classroomAddOnOpened only once until the session flag is cleared", () => {
    const { result } = renderHook(() => useGoogleClassroomAnalytics(), {
      wrapper,
    });

    act(() => {
      expect(
        result.current.trackAddOnOpenedOnce({
          analyticsUseCase: "Pupil",
        }),
      ).toBe(true);
    });

    act(() => {
      expect(
        result.current.trackAddOnOpenedOnce({
          analyticsUseCase: "Pupil",
        }),
      ).toBe(false);
    });

    expect(trackMock.classroomAddOnOpened).toHaveBeenCalledTimes(1);
    expect(trackMock.classroomAddOnOpened).toHaveBeenCalledWith(
      expect.objectContaining({
        analyticsUseCase: "Pupil",
      }),
    );
  });

  it("builds classroomSignInStarted payloads", () => {
    const { result } = renderHook(() => useGoogleClassroomAnalytics(), {
      wrapper,
    });

    act(() => {
      result.current.trackSignInStarted({
        analyticsUseCase: "Teacher",
      });
    });

    expect(trackMock.classroomSignInStarted).toHaveBeenCalledWith(
      expect.objectContaining({
        analyticsUseCase: "Teacher",
        googleLoginHint: "hint-1",
        clientEnvironment: "web-browser",
      }),
    );
  });

  it("builds classroomSignInCompleted payloads", () => {
    const { result } = renderHook(() => useGoogleClassroomAnalytics(), {
      wrapper,
    });

    act(() => {
      result.current.trackSignInCompleted({
        analyticsUseCase: "Pupil",
        subscribeToNewsletter: null,
      });
    });

    expect(trackMock.classroomSignInCompleted).toHaveBeenCalledWith(
      expect.objectContaining({
        analyticsUseCase: "Pupil",
        subscribeToNewsletter: null,
        googleLoginHint: "hint-1",
      }),
    );
  });

  it("builds classroomLessonsAttached payloads using store fallbacks", () => {
    const { result } = renderHook(() => useGoogleClassroomAnalytics(), {
      wrapper,
    });

    act(() => {
      result.current.trackLessonAttached({
        lessonName: "Lesson A",
        unitName: "Unit A",
        courseId: "",
        itemId: "",
        gradeSyncEnabled: true,
      });
    });

    expect(trackMock.classroomLessonsAttached).toHaveBeenCalledWith(
      expect.objectContaining({
        lessonName: "Lesson A",
        unitName: "Unit A",
        courseId: "course-1",
        itemId: "item-1",
        gradeSyncEnabled: true,
        googleLoginHint: "hint-1",
        clientEnvironment: "web-browser",
      }),
    );
  });

  it("preserves add-on opened state for sign-in navigation until the next clear", () => {
    const { result } = renderHook(() => useGoogleClassroomAnalytics(), {
      wrapper,
    });

    act(() => {
      result.current.trackAddOnOpenedOnce({
        analyticsUseCase: "Pupil",
      });
      result.current.markAddOnNavigation();
      result.current.clearAddOnOpenedFlag();
    });

    act(() => {
      expect(
        result.current.trackAddOnOpenedOnce({
          analyticsUseCase: "Pupil",
        }),
      ).toBe(false);
      result.current.clearAddOnOpenedFlag();
    });

    act(() => {
      expect(
        result.current.trackAddOnOpenedOnce({
          analyticsUseCase: "Pupil",
        }),
      ).toBe(true);
    });

    expect(trackMock.classroomAddOnOpened).toHaveBeenCalledTimes(2);
  });
});
