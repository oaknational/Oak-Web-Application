/**
 * @jest-environment node
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { GET } from "./route";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

jest.mock("@/node-lib/google-classroom", () => {
  const reporterMock = jest.fn();
  return {
    getOakGoogleClassroomAddon: jest.fn(),
    createClassroomErrorReporter: jest.fn(() => reporterMock),
    isOakGoogleClassroomException: jest.fn(() => false),
    __mockReportError: reporterMock,
  };
});

const mockedGetOakGoogleClassroomAddon =
  getOakGoogleClassroomAddon as jest.Mock;

const mockAccessToken = "mock-access-token";
const mockSession = "mock-session-id";

const mockCourseWork = {
  courseWorkId: "coursework-456",
  courseId: "course-789",
  lessonSlug: "intro-to-algebra",
  programmeSlug: "maths-primary",
  unitSlug: "algebra-unit-1",
};

const mockGetClassroomCourseWork = jest.fn().mockResolvedValue(mockCourseWork);
const mockGetStudentSubmissionId = jest
  .fn()
  .mockResolvedValue("submission-123");

const makeRequest = (
  params: Record<string, string>,
  headers: Record<string, string | null> = {},
) =>
  ({
    nextUrl: {
      searchParams: new URLSearchParams(params),
    },
    headers: {
      get: jest.fn((name: string) => headers[name] ?? null),
    },
  }) as unknown as NextRequest;

describe("GET /api/classroom/coursework/context", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetOakGoogleClassroomAddon.mockReturnValue({
      getClassroomCourseWork: mockGetClassroomCourseWork,
      getStudentSubmissionId: mockGetStudentSubmissionId,
    });
  });

  it("returns context with submissionId when pupil is authenticated", async () => {
    await GET(
      makeRequest(
        { assignmentToken: "token-abc" },
        { Authorization: mockAccessToken, "X-Oakgc-Session": mockSession },
      ),
    );

    expect(mockGetClassroomCourseWork).toHaveBeenCalledWith("token-abc");
    expect(mockGetStudentSubmissionId).toHaveBeenCalledWith(
      "course-789",
      "coursework-456",
      mockAccessToken,
      mockSession,
    );
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        courseWorkId: "coursework-456",
        courseId: "course-789",
        lessonSlug: "intro-to-algebra",
        programmeSlug: "maths-primary",
        unitSlug: "algebra-unit-1",
        submissionId: "submission-123",
      },
      { status: 200 },
    );
  });

  it("returns context without submissionId when pupil is unauthenticated", async () => {
    await GET(makeRequest({ assignmentToken: "token-abc" }));

    expect(mockGetStudentSubmissionId).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ submissionId: undefined }),
      { status: 200 },
    );
  });

  it("returns context without submissionId when submission lookup fails", async () => {
    mockGetStudentSubmissionId.mockRejectedValueOnce(
      new Error("Classroom API error"),
    );

    await GET(
      makeRequest(
        { assignmentToken: "token-abc" },
        { Authorization: mockAccessToken, "X-Oakgc-Session": mockSession },
      ),
    );

    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ submissionId: undefined }),
      { status: 200 },
    );
  });

  it("returns 404 when the assignment is not found", async () => {
    mockGetClassroomCourseWork.mockResolvedValueOnce(null);

    await GET(makeRequest({ assignmentToken: "token-abc" }));

    expect(mockGetStudentSubmissionId).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Assignment not found" },
      { status: 404 },
    );
  });

  it("returns 400 when assignmentToken is missing", async () => {
    await GET(makeRequest({}));

    expect(mockGetClassroomCourseWork).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Missing assignmentToken query parameter" },
      { status: 400 },
    );
  });

  it("returns 500 on unexpected errors", async () => {
    mockGetClassroomCourseWork.mockRejectedValueOnce(new Error("DB timeout"));

    await GET(makeRequest({ assignmentToken: "token-abc" }));

    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        error: "Failed to resolve coursework context",
        details: "DB timeout",
      },
      { status: 500 },
    );
  });
});
