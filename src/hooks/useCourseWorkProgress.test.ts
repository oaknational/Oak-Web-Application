import { act, renderHook, waitFor } from "@testing-library/react";

import { useCourseWorkProgress } from "./useCourseWorkProgress";

import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";
import { mapPupilLessonProgressToSectionResults } from "@/browser-lib/google-classroom/mapPupilLessonProgressToSectionResults";
import { mapToSubmitCourseWorkProgress } from "@/browser-lib/google-classroom/mapToSubmitCourseWorkProgress";

jest.mock("@/browser-lib/google-classroom/googleClassroomApi", () => ({
  __esModule: true,
  default: {
    verifySession: jest.fn(),
    getCourseWorkContext: jest.fn(),
    getCourseWorkProgress: jest.fn(),
    upsertCourseWorkProgress: jest.fn(),
  },
}));

jest.mock(
  "@/browser-lib/google-classroom/mapPupilLessonProgressToSectionResults",
  () => ({
    mapPupilLessonProgressToSectionResults: jest.fn(),
  }),
);

jest.mock(
  "@/browser-lib/google-classroom/mapToSubmitCourseWorkProgress",
  () => ({
    mapToSubmitCourseWorkProgress: jest.fn(),
  }),
);

const mockedGoogleClassroomApi = googleClassroomApi as jest.Mocked<
  typeof googleClassroomApi
>;
const mockedMapPupilLessonProgressToSectionResults =
  mapPupilLessonProgressToSectionResults as jest.MockedFunction<
    typeof mapPupilLessonProgressToSectionResults
  >;
const mockedMapToSubmitCourseWorkProgress =
  mapToSubmitCourseWorkProgress as jest.MockedFunction<
    typeof mapToSubmitCourseWorkProgress
  >;

describe("useCourseWorkProgress", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGoogleClassroomApi.verifySession.mockReturnValue(
      jest.fn().mockResolvedValue({
        authenticated: true,
        loginHint: "pupil@test.com",
        session: "session-1",
        token: "token-1",
      }),
    );
    mockedGoogleClassroomApi.getCourseWorkContext.mockResolvedValue({
      submissionId: "submission-1",
      courseWorkId: "coursework-1",
      courseId: "course-1",
      lessonSlug: "lesson-slug",
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
    });
    mockedGoogleClassroomApi.getCourseWorkProgress.mockResolvedValue(null);
    mockedGoogleClassroomApi.hasTeacherCookies.mockResolvedValue(false);
    mockedGoogleClassroomApi.upsertCourseWorkProgress.mockResolvedValue(
      undefined,
    );
    mockedMapPupilLessonProgressToSectionResults.mockReturnValue({});
    mockedMapToSubmitCourseWorkProgress.mockReturnValue({} as never);
  });

  it("hydrates to ready and restores mapped progress", async () => {
    const savedProgress = {
      starterQuiz: { grade: 3, numQuestions: 5 },
    } as never;
    const mappedProgress = {
      "starter-quiz": { grade: 3, numQuestions: 5, isComplete: true },
    };

    mockedGoogleClassroomApi.getCourseWorkProgress.mockResolvedValue(
      savedProgress,
    );
    mockedMapPupilLessonProgressToSectionResults.mockReturnValue(
      mappedProgress,
    );

    const { result } = renderHook(() =>
      useCourseWorkProgress({
        assignmentToken: "assignment-token",
        isGoogleClassroomAssignment: false,
      }),
    );

    expect(result.current.status).toBe("loading");

    await waitFor(() => {
      expect(result.current.status).toBe("ready");
    });

    expect(mockedMapPupilLessonProgressToSectionResults).toHaveBeenCalledWith(
      savedProgress,
    );
    expect(result.current.initialSectionResults).toEqual(mappedProgress);
  });

  it("moves to sign_in_required when the pupil is not authenticated", async () => {
    mockedGoogleClassroomApi.verifySession.mockReturnValue(
      jest.fn().mockResolvedValue({
        authenticated: false,
        session: undefined,
        token: undefined,
      }),
    );

    const { result } = renderHook(() =>
      useCourseWorkProgress({
        assignmentToken: "assignment-token",
        isGoogleClassroomAssignment: false,
      }),
    );

    await waitFor(() => {
      expect(result.current.status).toBe("sign_in_required");
    });

    expect(result.current.isPupilSignInRequired).toBe(true);
  });

  it("degrades to inactive without a preview message when a pupil has no submissionId", async () => {
    mockedGoogleClassroomApi.getCourseWorkContext.mockResolvedValue({
      courseWorkId: "coursework-1",
      courseId: "course-1",
      lessonSlug: "lesson-slug",
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
    });
    // hasTeacherCookies returns false — this is a pupil, not a teacher

    const { result } = renderHook(() =>
      useCourseWorkProgress({
        assignmentToken: "assignment-token",
        isGoogleClassroomAssignment: false,
      }),
    );

    await waitFor(() => {
      expect(result.current.status).toBe("inactive");
    });

    expect(result.current.errorMessage).toBeNull();
    expect(result.current.previewMessage).toBeNull();
  });

  it("degrades to inactive with a preview message when a teacher has no submissionId", async () => {
    mockedGoogleClassroomApi.getCourseWorkContext.mockResolvedValue({
      courseWorkId: "coursework-1",
      courseId: "course-1",
      lessonSlug: "lesson-slug",
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
    });
    mockedGoogleClassroomApi.hasTeacherCookies.mockResolvedValue(true);

    const { result } = renderHook(() =>
      useCourseWorkProgress({
        assignmentToken: "assignment-token",
        isGoogleClassroomAssignment: false,
      }),
    );

    await waitFor(() => {
      expect(result.current.status).toBe("inactive");
    });

    expect(result.current.errorMessage).toBeNull();
    expect(result.current.previewMessage).toBe(
      "You're viewing this lesson in preview mode. Progress won't sync to Google Classroom.",
    );
  });

  it("silently degrades to inactive when the verified session is missing a loginHint", async () => {
    mockedGoogleClassroomApi.verifySession.mockReturnValue(
      jest.fn().mockResolvedValue({
        authenticated: true,
        loginHint: undefined,
        session: "session-1",
        token: "token-1",
      }),
    );

    const { result } = renderHook(() =>
      useCourseWorkProgress({
        assignmentToken: "assignment-token",
        isGoogleClassroomAssignment: false,
      }),
    );

    await waitFor(() => {
      expect(result.current.status).toBe("inactive");
    });

    expect(result.current.errorMessage).toBeNull();
  });

  it("moves to error when hydration fails", async () => {
    mockedGoogleClassroomApi.getCourseWorkContext.mockRejectedValueOnce(
      new Error("Context unavailable"),
    );

    const { result } = renderHook(() =>
      useCourseWorkProgress({
        assignmentToken: "assignment-token",
        isGoogleClassroomAssignment: false,
      }),
    );

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });

    expect(result.current.errorMessage).toBe(
      "We couldn't load your assignment progress. You can still view the lesson, but progress won't sync.",
    );
  });

  it("returns false and sets an error when saveProgress is called before ready", async () => {
    mockedGoogleClassroomApi.verifySession.mockReturnValue(
      jest.fn(() => new Promise(() => {})),
    );

    const { result } = renderHook(() =>
      useCourseWorkProgress({
        assignmentToken: "assignment-token",
        isGoogleClassroomAssignment: false,
      }),
    );

    let didSave = true;
    await act(async () => {
      didSave = await result.current.saveProgress({
        intro: { isComplete: true },
      });
    });

    expect(didSave).toBe(false);
    expect(result.current.errorMessage).toBe(
      "Assignment progress isn't ready yet. Please try again.",
    );
  });

  it("saves progress when the coursework flow is ready", async () => {
    const savePayload = {
      submissionId: "submission-1",
      courseWorkId: "coursework-1",
    } as never;
    mockedMapToSubmitCourseWorkProgress.mockReturnValue(savePayload);

    const { result } = renderHook(() =>
      useCourseWorkProgress({
        assignmentToken: "assignment-token",
        isGoogleClassroomAssignment: false,
      }),
    );

    await waitFor(() => {
      expect(result.current.status).toBe("ready");
    });

    let didSave = false;
    await act(async () => {
      didSave = await result.current.saveProgress({
        intro: { isComplete: true },
      });
    });

    expect(didSave).toBe(true);
    expect(mockedMapToSubmitCourseWorkProgress).toHaveBeenCalledWith(
      expect.objectContaining({ submissionId: "submission-1" }),
      { intro: { isComplete: true } },
    );
    expect(
      mockedGoogleClassroomApi.upsertCourseWorkProgress,
    ).toHaveBeenCalledWith(savePayload);
  });
});
