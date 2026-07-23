import { renderHook, waitFor } from "@testing-library/react";
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
});
