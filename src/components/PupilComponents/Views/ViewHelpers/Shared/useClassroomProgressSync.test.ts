import { renderHook, act, waitFor } from "@testing-library/react";

import { useClassroomProgressSync } from "./useClassroomProgressSync";

import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";

jest.mock("@/browser-lib/google-classroom/googleClassroomApi", () => ({
  __esModule: true,
  default: {
    submitPupilProgress: jest.fn().mockResolvedValue({
      progress: {},
      status: "PERSISTED",
    }),
  },
}));
jest.mock("@/browser-lib/google-classroom/mapToSubmitPupilProgress", () => ({
  mapToSubmitPupilProgress: jest.fn((_context, sectionResults) => ({
    sectionResults,
  })),
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

  it("submits progress on each in-progress result update (e.g. per quiz question)", async () => {
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

    await waitFor(() =>
      expect(mockedApi.submitPupilProgress).toHaveBeenCalledTimes(2),
    );
  });

  it("submits progress when a section completes", async () => {
    renderHook(() => useClassroomProgressSync(classroomArgs));

    act(() => {
      usePupilLessonProgress.getState().completeSection("intro");
    });

    await waitFor(() =>
      expect(mockedApi.submitPupilProgress).toHaveBeenCalledTimes(1),
    );
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

  it("reuses an in-flight request for identical progress", async () => {
    let resolveRequest:
      | ((value: { progress: never; status: "PERSISTED" }) => void)
      | undefined;
    mockedApi.submitPupilProgress.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );
    renderHook(() => useClassroomProgressSync(classroomArgs));
    const sectionResults = {
      intro: { isComplete: true },
    };

    const first = usePupilLessonProgress
      .getState()
      .submitClassroomProgress(sectionResults);
    const second = usePupilLessonProgress
      .getState()
      .submitClassroomProgress(sectionResults);
    await waitFor(() =>
      expect(mockedApi.submitPupilProgress).toHaveBeenCalledTimes(1),
    );

    resolveRequest?.({ progress: {} as never, status: "PERSISTED" });
    await expect(Promise.all([first, second])).resolves.toEqual([
      expect.objectContaining({ status: "PERSISTED" }),
      expect.objectContaining({ status: "PERSISTED" }),
    ]);
  });

  it("does not repeat the awaited completion when the store publishes it", async () => {
    renderHook(() => useClassroomProgressSync(classroomArgs));
    const sectionResults = {
      intro: { isComplete: true },
    };

    await usePupilLessonProgress
      .getState()
      .submitClassroomProgress(sectionResults);
    act(() => {
      usePupilLessonProgress.getState().completeSection("intro");
    });

    await waitFor(() =>
      expect(mockedApi.submitPupilProgress).toHaveBeenCalledTimes(1),
    );
  });

  it("serializes distinct progress writes", async () => {
    let resolveFirst:
      | ((value: { progress: never; status: "PERSISTED" }) => void)
      | undefined;
    mockedApi.submitPupilProgress.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFirst = resolve;
      }),
    );
    renderHook(() => useClassroomProgressSync(classroomArgs));

    const first = usePupilLessonProgress
      .getState()
      .submitClassroomProgress({ intro: { isComplete: false } });
    const second = usePupilLessonProgress
      .getState()
      .submitClassroomProgress({ intro: { isComplete: true } });

    await waitFor(() =>
      expect(mockedApi.submitPupilProgress).toHaveBeenCalledTimes(1),
    );
    resolveFirst?.({ progress: {} as never, status: "PERSISTED" });
    await first;
    await second;
    expect(mockedApi.submitPupilProgress).toHaveBeenCalledTimes(2);
  });

  it("marks the lesson read-only and stops queued writes", async () => {
    mockedApi.submitPupilProgress.mockResolvedValueOnce({
      progress: {} as never,
      status: "READ_ONLY",
    });
    renderHook(() => useClassroomProgressSync(classroomArgs));

    const first = usePupilLessonProgress
      .getState()
      .submitClassroomProgress({ intro: { isComplete: false } });
    const second = usePupilLessonProgress
      .getState()
      .submitClassroomProgress({ intro: { isComplete: true } });

    await expect(first).resolves.toEqual(
      expect.objectContaining({ status: "READ_ONLY" }),
    );
    await expect(second).resolves.toEqual(
      expect.objectContaining({ status: "READ_ONLY" }),
    );
    expect(usePupilLessonProgress.getState().isReadOnly).toBe(true);
    expect(mockedApi.submitPupilProgress).toHaveBeenCalledTimes(1);
  });

  it("retries an identical write after a failure", async () => {
    mockedApi.submitPupilProgress.mockRejectedValueOnce(
      new Error("temporary failure"),
    );
    renderHook(() => useClassroomProgressSync(classroomArgs));
    const sectionResults = {
      intro: { isComplete: true },
    };

    await expect(
      usePupilLessonProgress.getState().submitClassroomProgress(sectionResults),
    ).rejects.toThrow("temporary failure");
    await expect(
      usePupilLessonProgress.getState().submitClassroomProgress(sectionResults),
    ).resolves.toEqual(expect.objectContaining({ status: "PERSISTED" }));
    expect(mockedApi.submitPupilProgress).toHaveBeenCalledTimes(2);
  });

  it("does not let a stale assignment request block or lock the new assignment", async () => {
    let resolveFirst:
      | ((value: { progress: never; status: "READ_ONLY" }) => void)
      | undefined;
    mockedApi.submitPupilProgress
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveFirst = resolve;
        }),
      )
      .mockResolvedValueOnce({
        progress: {} as never,
        status: "PERSISTED",
      });

    const { rerender } = renderHook(
      (args: typeof classroomArgs) => useClassroomProgressSync(args),
      { initialProps: classroomArgs },
    );
    const first = usePupilLessonProgress
      .getState()
      .submitClassroomProgress({ intro: { isComplete: false } });
    await waitFor(() =>
      expect(mockedApi.submitPupilProgress).toHaveBeenCalledTimes(1),
    );

    rerender({
      ...classroomArgs,
      courseId: "course-2",
      itemId: "item-2",
      attachmentId: "attachment-2",
      submissionId: "submission-2",
    });
    const second = usePupilLessonProgress
      .getState()
      .submitClassroomProgress({ intro: { isComplete: true } });

    await waitFor(() =>
      expect(mockedApi.submitPupilProgress).toHaveBeenCalledTimes(2),
    );
    await expect(second).resolves.toEqual(
      expect.objectContaining({ status: "PERSISTED" }),
    );

    resolveFirst?.({ progress: {} as never, status: "READ_ONLY" });
    await expect(first).rejects.toThrow("classroom progress context changed");
    expect(usePupilLessonProgress.getState().isReadOnly).toBe(false);
  });
});
