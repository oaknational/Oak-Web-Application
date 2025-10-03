import { renderHook, act } from "@testing-library/react";
import { useFeatureFlagEnabled } from "posthog-js/react";

import { useLesson, UseLessonProps } from "./useLesson";

import { useShare } from "@/pages-helpers/teacher/share/useShare";
import { useTeacherNotes } from "@/pages-helpers/teacher/share/useTeacherNotes";

// Mock all the dependencies
jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: jest.fn(),
}));

jest.mock("@/pages-helpers/teacher/share/useShare", () => ({
  useShare: jest.fn(),
}));

jest.mock("@/pages-helpers/teacher/share/useTeacherNotes", () => ({
  useTeacherNotes: jest.fn(),
}));

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    track: { teacherNoteDialogOpened: jest.fn() },
  })),
}));

describe("useLesson", () => {
  const defaultProps: UseLessonProps = {
    lessonSlug: "test-lesson",
    source: "lesson-browse" as const,
    loginRequired: false,
    geoRestricted: false,
    curriculumTrackingProps: {
      lessonName: "Test Lesson",
      lessonSlug: "test-lesson",
      unitName: "Test Unit",
      unitSlug: "test-unit",
      subjectSlug: "test-subject",
      subjectTitle: "Test Subject",
      keyStageSlug: "test-ks",
      keyStageTitle: "Key stage 4",
      lessonReleaseCohort: "2020-2023",
      lessonReleaseDate: "2020-2023",
    },
  };

  const mockShareReturn = {
    shareUrl: "https://share.example.com",
    browserUrl: "https://browser.example.com",
    shareActivated: true,
    shareIdRef: { current: "test-share-id" },
    shareIdKeyRef: { current: "test-share-key" },
  };

  const mockTeacherNotesReturn = {
    teacherNote: { noteHtml: "<p>Test note</p>" },
    isEditable: true,
    saveTeacherNote: jest.fn(),
    noteSaved: true,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mocks
    (useFeatureFlagEnabled as jest.Mock).mockReturnValue(true);
    (useShare as jest.Mock).mockReturnValue(mockShareReturn);
    (useTeacherNotes as jest.Mock).mockReturnValue(mockTeacherNotesReturn);

    // Create a mock location object
    const mockLocation = {
      href: "https://example.com/test",
      assign: jest.fn(),
      reload: jest.fn(),
      replace: jest.fn(),
    };

    // Override the window.location with the mock object using type casting
    Object.defineProperty(window, "location", {
      value: mockLocation,
      writable: true,
    });

    // mock the history.replaceState method
    jest.spyOn(window.history, "replaceState").mockImplementation(() => {
      return;
    });
  });

  it("should initialize with correct default state", () => {
    const { result } = renderHook(() => useLesson(defaultProps));

    expect(result.current.teacherNotesOpen).toBe(false);
    expect(result.current.teacherNoteHtml).toBeUndefined();
    expect(result.current.isEditable).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should handle feature flag disabled state", () => {
    (useFeatureFlagEnabled as jest.Mock).mockReturnValue(false);

    const { result } = renderHook(() => useLesson(defaultProps));

    expect(result.current.teacherNoteHtml).toBeUndefined();
  });

  it("should handle teacher notes modal state changes", () => {
    const { result } = renderHook(() => useLesson(defaultProps));

    act(() => {
      result.current.setTeacherNotesOpen(true);
    });

    expect(result.current.teacherNotesOpen).toBe(true);
  });

  it("should update browser URL when different from current location", () => {
    const replaceStateSpy = jest.spyOn(window.history, "replaceState");

    renderHook(() => useLesson(defaultProps));

    expect(replaceStateSpy).toHaveBeenCalledWith(
      {},
      "",
      "https://browser.example.com",
    );
  });

  it("should handle error states from teacher notes", () => {
    const mockError = new Error("Test error");
    (useTeacherNotes as jest.Mock).mockReturnValue({
      ...mockTeacherNotesReturn,
      error: mockError,
    });

    const { result } = renderHook(() => useLesson(defaultProps));

    expect(result.current.error).toBe(mockError);
  });

  it("should set lesson path when teacher notes are enabled", () => {
    renderHook(() => useLesson(defaultProps));

    expect(useTeacherNotes).toHaveBeenCalledWith(
      expect.objectContaining({
        lessonPath: "https://example.com/test",
      }),
    );
  });

  it("should handle non-editable teacher notes correctly", () => {
    (useTeacherNotes as jest.Mock).mockReturnValue({
      ...mockTeacherNotesReturn,
      isEditable: false,
    });

    const { result } = renderHook(() => useLesson(defaultProps));

    expect(result.current.teacherNoteHtml).toBe("<p>Test note</p>");
  });

  it("should pass correct props to useShare", () => {
    renderHook(() => useLesson(defaultProps));

    expect(useShare).toHaveBeenCalledWith({
      programmeSlug: undefined,
      source: "lesson-browse-w-note",
      curriculumTrackingProps: defaultProps.curriculumTrackingProps,
      overrideExistingShareId: false,
    });
  });

  describe("Effect behaviors", () => {
    it("should update lessonPath when teacher notes are enabled", () => {
      const { rerender } = renderHook(() => useLesson(defaultProps));

      expect(useTeacherNotes).toHaveBeenCalledWith(
        expect.objectContaining({
          lessonPath: "https://example.com/test",
        }),
      );

      (useFeatureFlagEnabled as jest.Mock).mockReturnValue(false);
      rerender();

      expect(useTeacherNotes).toHaveBeenCalledWith(
        expect.objectContaining({
          lessonPath: null,
        }),
      );
    });

    it("should not update URL if current URL matches browserUrl", () => {
      const replaceStateSpy = jest.spyOn(window.history, "replaceState");
      (useShare as jest.Mock).mockReturnValue({
        ...mockShareReturn,
        browserUrl: "https://example.com/test",
      });

      renderHook(() => useLesson(defaultProps));

      expect(replaceStateSpy).not.toHaveBeenCalled();
    });
  });
});
