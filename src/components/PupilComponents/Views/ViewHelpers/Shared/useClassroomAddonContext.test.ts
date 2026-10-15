import { act, renderHook, waitFor } from "@testing-library/react";
import { PostSubmissionState } from "@oaknational/google-classroom-addon/types";

import { useClassroomAddonContext } from "./useClassroomAddonContext";

import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";
import { useGoogleClassroomContext } from "@/components/GoogleClassroom/useGoogleClassroomContext";

jest.mock("@/browser-lib/google-classroom/googleClassroomApi", () => ({
  __esModule: true,
  default: {
    getAddOnContext: jest.fn(),
    getPupilLessonProgress: jest.fn(),
    getPostSubmissionState: jest.fn(),
  },
}));
jest.mock("@/components/GoogleClassroom/useGoogleClassroomContext");

const mockedApi = googleClassroomApi as jest.Mocked<typeof googleClassroomApi>;
const mockedUseGoogleClassroomContext =
  useGoogleClassroomContext as jest.MockedFunction<
    typeof useGoogleClassroomContext
  >;

const webContext = {
  isGoogleClassroomContext: false,
  isClassroomAssignment: false,
  classroomAssignmentChecked: true,
  courseId: null,
  itemId: null,
  attachmentId: null,
  googleLoginHint: "",
  clientEnvironment: "web-browser" as const,
  classroomAssignmentId: null,
};

const classroomContext = {
  isGoogleClassroomContext: true,
  isClassroomAssignment: true,
  classroomAssignmentChecked: true,
  courseId: "course-1",
  itemId: "item-1",
  attachmentId: "attachment-1",
  googleLoginHint: "",
  clientEnvironment: "iframe" as const,
  classroomAssignmentId: "course-1:item-1",
};

describe("useClassroomAddonContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("short-circuits for non-Classroom pupils without calling the add-on API", async () => {
    mockedUseGoogleClassroomContext.mockReturnValue(webContext);

    const { result } = renderHook(() => useClassroomAddonContext());

    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(result.current.submissionId).toBeNull();
    expect(result.current.isReadOnly).toBe(false);
    expect(result.current.initialSectionResults).toEqual({});
    expect(mockedApi.getAddOnContext).not.toHaveBeenCalled();
  });

  it("resolves the add-on context, hydrates progress and read-only state for a Classroom assignment", async () => {
    mockedUseGoogleClassroomContext.mockReturnValue(classroomContext);
    mockedApi.getAddOnContext.mockResolvedValue({
      studentContext: { submissionId: "submission-1" },
      pupilLoginHint: "pupil-hint",
      teacherLoginHint: "teacher-hint",
    });
    mockedApi.getPupilLessonProgress.mockResolvedValue({
      intro: { isComplete: true },
    } as never);
    mockedApi.getPostSubmissionState.mockResolvedValue({
      submissionState: PostSubmissionState.RETURNED,
    });

    const { result, rerender } = renderHook(() => useClassroomAddonContext());

    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(result.current.submissionId).toBe("submission-1");
    expect(result.current.pupilLoginHint).toBe("pupil-hint");
    expect(result.current.teacherLoginHint).toBe("teacher-hint");
    expect(result.current.clientEnvironment).toBe("iframe");
    expect(result.current.isReadOnly).toBe(true);
    expect(result.current.initialSectionResults).toEqual({
      intro: { isComplete: true },
    });
    expect(mockedApi.getPostSubmissionState).toHaveBeenCalledTimes(1);
    expect(mockedApi.getPostSubmissionState).toHaveBeenCalledWith({
      courseId: "course-1",
      itemId: "item-1",
      attachmentId: "attachment-1",
      submissionId: "submission-1",
    });

    rerender();
    expect(mockedApi.getPostSubmissionState).toHaveBeenCalledTimes(1);
  });

  it("stays usable when the add-on context fails to resolve", async () => {
    mockedUseGoogleClassroomContext.mockReturnValue(classroomContext);
    mockedApi.getAddOnContext.mockResolvedValue(null);

    const { result } = renderHook(() => useClassroomAddonContext());

    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(result.current.submissionId).toBeNull();
    expect(result.current.initialSectionResults).toEqual({});
    expect(mockedApi.getPupilLessonProgress).not.toHaveBeenCalled();
  });

  it("shares concurrent submission-state refreshes", async () => {
    mockedUseGoogleClassroomContext.mockReturnValue(classroomContext);
    mockedApi.getAddOnContext.mockResolvedValue({
      studentContext: { submissionId: "submission-1" },
      pupilLoginHint: "pupil-hint",
    });
    mockedApi.getPupilLessonProgress.mockResolvedValue(null);
    mockedApi.getPostSubmissionState.mockResolvedValueOnce({
      submissionState: PostSubmissionState.CREATED,
    });
    const { result } = renderHook(() => useClassroomAddonContext());
    await waitFor(() => expect(result.current.isReady).toBe(true));

    let resolveRefresh:
      | ((value: { submissionState: PostSubmissionState }) => void)
      | undefined;
    mockedApi.getPostSubmissionState.mockReset();
    mockedApi.getPostSubmissionState.mockReturnValue(
      new Promise((resolve) => {
        resolveRefresh = resolve;
      }),
    );

    let first: Promise<boolean>;
    let second: Promise<boolean>;
    act(() => {
      first = result.current.refreshReadOnly();
      second = result.current.refreshReadOnly();
    });

    expect(mockedApi.getPostSubmissionState).toHaveBeenCalledTimes(1);
    let refreshResults: boolean[] = [];
    await act(async () => {
      resolveRefresh?.({
        submissionState: PostSubmissionState.RETURNED,
      });
      refreshResults = await Promise.all([first!, second!]);
    });
    expect(refreshResults).toEqual([true, true]);
    await waitFor(() => expect(result.current.isReadOnly).toBe(true));
  });

  it("hydrates a new assignment when the Classroom context changes", async () => {
    let currentContext = classroomContext;
    mockedUseGoogleClassroomContext.mockImplementation(() => currentContext);
    mockedApi.getAddOnContext
      .mockResolvedValueOnce({
        studentContext: { submissionId: "submission-1" },
        pupilLoginHint: "pupil-1",
      })
      .mockResolvedValueOnce({
        studentContext: { submissionId: "submission-2" },
        pupilLoginHint: "pupil-2",
      });
    mockedApi.getPupilLessonProgress
      .mockResolvedValueOnce({
        intro: { isComplete: true },
      } as never)
      .mockResolvedValueOnce({
        video: { isComplete: true },
      } as never);
    mockedApi.getPostSubmissionState.mockResolvedValue({
      submissionState: PostSubmissionState.CREATED,
    });

    const { result, rerender } = renderHook(() => useClassroomAddonContext());
    await waitFor(() =>
      expect(result.current.submissionId).toBe("submission-1"),
    );

    currentContext = {
      ...classroomContext,
      courseId: "course-2",
      itemId: "item-2",
      attachmentId: "attachment-2",
      classroomAssignmentId: "course-2:item-2",
    };
    rerender();

    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(result.current.submissionId).toBe("submission-2");
    expect(result.current.pupilLoginHint).toBe("pupil-2");
    expect(result.current.initialSectionResults).toEqual({
      video: { isComplete: true },
    });
    expect(mockedApi.getAddOnContext).toHaveBeenCalledTimes(2);
  });

  it("ignores hydration that resolves after the assignment changes", async () => {
    let currentContext = classroomContext;
    mockedUseGoogleClassroomContext.mockImplementation(() => currentContext);
    let resolveFirstContext:
      | ((value: {
          studentContext: { submissionId: string };
          pupilLoginHint: string;
        }) => void)
      | undefined;
    mockedApi.getAddOnContext
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveFirstContext = resolve;
        }),
      )
      .mockResolvedValueOnce({
        studentContext: { submissionId: "submission-2" },
        pupilLoginHint: "pupil-2",
      });
    mockedApi.getPupilLessonProgress.mockResolvedValue({
      video: { isComplete: true },
    } as never);
    mockedApi.getPostSubmissionState.mockResolvedValue({
      submissionState: PostSubmissionState.CREATED,
    });

    const { result, rerender } = renderHook(() => useClassroomAddonContext());
    await waitFor(() =>
      expect(mockedApi.getAddOnContext).toHaveBeenCalledTimes(1),
    );

    currentContext = {
      ...classroomContext,
      courseId: "course-2",
      itemId: "item-2",
      attachmentId: "attachment-2",
      classroomAssignmentId: "course-2:item-2",
    };
    rerender();
    await waitFor(() =>
      expect(result.current.submissionId).toBe("submission-2"),
    );

    await act(async () => {
      resolveFirstContext?.({
        studentContext: { submissionId: "stale-submission" },
        pupilLoginHint: "stale-pupil",
      });
    });

    expect(result.current.submissionId).toBe("submission-2");
    expect(result.current.pupilLoginHint).toBe("pupil-2");
    expect(result.current.initialSectionResults).toEqual({
      video: { isComplete: true },
    });
  });
});
