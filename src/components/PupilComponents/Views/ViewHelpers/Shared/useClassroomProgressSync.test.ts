import { renderHook, act } from "@testing-library/react";

import { useClassroomProgressSync } from "./useClassroomProgressSync";

import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";

jest.mock("@/browser-lib/google-classroom/googleClassroomApi", () => ({
  __esModule: true,
  default: {
    submitPupilProgress: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock("@/browser-lib/google-classroom/mapToSubmitPupilProgress", () => ({
  mapToSubmitPupilProgress: jest.fn(() => ({ mocked: "payload" })),
}));

const mockedApi = googleClassroomApi as jest.Mocked<typeof googleClassroomApi>;

const classroomArgs = {
  courseId: "course-1",
  itemId: "item-1",
  attachmentId: "attachment-1",
  submissionId: "submission-1",
  pupilLoginHint: "pupil-hint",
  isReadOnly: false,
  isReady: true,
};

describe("useClassroomProgressSync", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePupilLessonProgress.getState().resetLessonProgress();
    usePupilLessonProgress.getState().initialiseLessonProgress({
      lessonSlug: "lesson-1",
      lessonReviewSections: ["intro", "starter-quiz", "video", "exit-quiz"],
    });
  });

  it("submits progress on each in-progress result update (e.g. per quiz question)", () => {
    renderHook(() => useClassroomProgressSync(classroomArgs));

    act(() => {
      usePupilLessonProgress
        .getState()
        .updateSectionInProgressResult("starter-quiz", {
          grade: 1,
          numQuestions: 6,
        });
    });
    act(() => {
      usePupilLessonProgress
        .getState()
        .updateSectionInProgressResult("starter-quiz", {
          grade: 2,
          numQuestions: 6,
        });
    });

    expect(mockedApi.submitPupilProgress).toHaveBeenCalledTimes(2);
  });

  it("submits progress when a section completes", () => {
    renderHook(() => useClassroomProgressSync(classroomArgs));

    act(() => {
      usePupilLessonProgress.getState().completeSection("intro");
    });

    expect(mockedApi.submitPupilProgress).toHaveBeenCalledTimes(1);
  });

  it("does not submit when the assignment is read-only", () => {
    renderHook(() =>
      useClassroomProgressSync({ ...classroomArgs, isReadOnly: true }),
    );

    act(() => {
      usePupilLessonProgress.getState().completeSection("intro");
    });

    expect(mockedApi.submitPupilProgress).not.toHaveBeenCalled();
  });

  it("does not submit for non-Classroom pupils (no submission id)", () => {
    renderHook(() =>
      useClassroomProgressSync({ ...classroomArgs, submissionId: null }),
    );

    act(() => {
      usePupilLessonProgress.getState().completeSection("intro");
    });

    expect(mockedApi.submitPupilProgress).not.toHaveBeenCalled();
  });

  it("does not submit before the add-on context is ready", () => {
    renderHook(() =>
      useClassroomProgressSync({ ...classroomArgs, isReady: false }),
    );

    act(() => {
      usePupilLessonProgress.getState().completeSection("intro");
    });

    expect(mockedApi.submitPupilProgress).not.toHaveBeenCalled();
  });
});
