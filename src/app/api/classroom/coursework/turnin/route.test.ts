/**
 * @jest-environment node
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { POST } from "./route";

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

const mockAuthHeaders = {
  get: jest.fn((headerName: string) => {
    if (headerName === "Authorization") return mockAccessToken;
    if (headerName === "X-Oakgc-Session") return mockSession;
    return null;
  }),
};

const mockGetClassroomCourseWork = jest.fn().mockResolvedValue({
  courseWorkId: "coursework-456",
  courseId: "course-789",
});
const mockGetStudentSubmissionId = jest
  .fn()
  .mockResolvedValue("submission-123");
const mockTurnInCourseWorkSubmission = jest.fn().mockResolvedValue(undefined);

describe("POST /api/classroom/coursework/turnin", () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetOakGoogleClassroomAddon.mockReturnValue({
      getClassroomCourseWork: mockGetClassroomCourseWork,
      getStudentSubmissionId: mockGetStudentSubmissionId,
      turnInCourseWorkSubmission: mockTurnInCourseWorkSubmission,
    });
  });

  it("should turn in the assignment and return 200", async () => {
    mockRequest = {
      json: async () => ({ assignmentToken: "token-abc" }),
      headers: mockAuthHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockGetClassroomCourseWork).toHaveBeenCalledWith("token-abc");
    expect(mockGetStudentSubmissionId).toHaveBeenCalledWith(
      "course-789",
      "coursework-456",
      mockAccessToken,
      mockSession,
    );
    expect(mockTurnInCourseWorkSubmission).toHaveBeenCalledWith(
      "course-789",
      "coursework-456",
      "submission-123",
      "token-abc",
      mockAccessToken,
      mockSession,
    );
    expect(NextResponse.json).toHaveBeenCalledWith(
      { success: true },
      { status: 200 },
    );
  });

  it("should return 404 when the assignment is not found", async () => {
    mockGetClassroomCourseWork.mockResolvedValueOnce(null);

    mockRequest = {
      json: async () => ({ assignmentToken: "token-abc" }),
      headers: mockAuthHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockGetStudentSubmissionId).not.toHaveBeenCalled();
    expect(mockTurnInCourseWorkSubmission).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Assignment not found" },
      { status: 404 },
    );
  });

  it("should return 401 when auth headers are missing", async () => {
    mockRequest = {
      json: async () => ({ assignmentToken: "token-abc" }),
      headers: { get: jest.fn(() => null) },
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockGetClassroomCourseWork).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Authentication required" },
      { status: 401 },
    );
  });

  it("should return 400 when assignmentToken is missing", async () => {
    mockRequest = {
      json: async () => ({}),
      headers: mockAuthHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockGetClassroomCourseWork).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Invalid request body" }),
      { status: 400 },
    );
  });

  it("should return 500 on unexpected errors", async () => {
    mockGetClassroomCourseWork.mockRejectedValueOnce(new Error("API failure"));

    mockRequest = {
      json: async () => ({ assignmentToken: "token-abc" }),
      headers: mockAuthHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Failed to turn in assignment", details: "API failure" },
      { status: 500 },
    );
  });
});
