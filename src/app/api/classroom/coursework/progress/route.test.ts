/**
 * @jest-environment node
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { GET, POST } from "./route";

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
const mockLoginHint = "pupil@example.com";

type MockHeaders = Pick<Headers, "get">;

const mockAuthHeaders: MockHeaders = {
  get: jest.fn((headerName: string) => {
    if (headerName === "Authorization") return mockAccessToken;
    if (headerName === "X-Oakgc-Session") return mockSession;
    return null;
  }),
};

const mockNoAuthHeaders: MockHeaders = {
  get: jest.fn((_headerName: string) => null),
};

const mockProgressBody = {
  submissionId: "submission-123",
  assignmentToken: "token-abc",
  courseWorkId: "coursework-456",
  courseId: "course-789",
  pupilLoginHint: mockLoginHint,
};

const mockProgressResult = { saved: true };
const mockGetProgressResult = {
  grade: 8,
  numQuestions: 10,
  pupilLoginHint: mockLoginHint,
};

const mockVerifiedSession = {
  session: mockSession,
  token: mockAccessToken,
  loginHint: mockLoginHint,
};

const mockUpsertCourseWorkPupilProgress = jest
  .fn()
  .mockResolvedValue(mockProgressResult);
const mockGetCourseWorkPupilProgress = jest
  .fn()
  .mockResolvedValue(mockGetProgressResult);
const mockVerifyAuthSession = jest.fn().mockResolvedValue(mockVerifiedSession);

const makeGetRequest = (
  params: Record<string, string>,
  headers: MockHeaders = mockAuthHeaders,
) =>
  ({
    nextUrl: {
      searchParams: new URLSearchParams(params),
    },
    headers,
  }) as unknown as NextRequest;

describe("GET /api/classroom/coursework/progress", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetOakGoogleClassroomAddon.mockReturnValue({
      getCourseWorkPupilProgress: mockGetCourseWorkPupilProgress,
      upsertCourseWorkPupilProgress: mockUpsertCourseWorkPupilProgress,
      verifyAuthSession: mockVerifyAuthSession,
    });
  });

  it("should return progress for valid query params", async () => {
    await GET(
      makeGetRequest({
        submissionId: "submission-123",
        assignmentToken: "token-abc",
      }),
    );

    expect(mockVerifyAuthSession).toHaveBeenCalledWith(
      mockSession,
      mockAccessToken,
    );
    expect(mockGetCourseWorkPupilProgress).toHaveBeenCalledWith(
      "submission-123",
      "token-abc",
    );
    expect(NextResponse.json).toHaveBeenCalledWith(mockGetProgressResult, {
      status: 200,
    });
  });

  it("should return 401 when auth headers are missing", async () => {
    await GET(
      makeGetRequest(
        { submissionId: "submission-123", assignmentToken: "token-abc" },
        mockNoAuthHeaders,
      ),
    );

    expect(mockVerifyAuthSession).not.toHaveBeenCalled();
    expect(mockGetCourseWorkPupilProgress).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Authentication required" },
      { status: 401 },
    );
  });

  it("should return 401 when session verification fails", async () => {
    mockVerifyAuthSession.mockResolvedValueOnce(null);

    await GET(
      makeGetRequest({
        submissionId: "submission-123",
        assignmentToken: "token-abc",
      }),
    );

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Authentication required" },
      { status: 401 },
    );
  });

  it("should return 403 when loginHint does not match pupilLoginHint", async () => {
    mockVerifyAuthSession.mockResolvedValueOnce({
      ...mockVerifiedSession,
      loginHint: "other-pupil@example.com",
    });

    await GET(
      makeGetRequest({
        submissionId: "submission-123",
        assignmentToken: "token-abc",
      }),
    );

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Forbidden" },
      { status: 403 },
    );
  });

  it("should allow access when session has no loginHint", async () => {
    mockVerifyAuthSession.mockResolvedValueOnce({
      session: mockSession,
      token: mockAccessToken,
      loginHint: undefined,
    });

    await GET(
      makeGetRequest({
        submissionId: "submission-123",
        assignmentToken: "token-abc",
      }),
    );

    expect(NextResponse.json).toHaveBeenCalledWith(mockGetProgressResult, {
      status: 200,
    });
  });

  it("should return 400 when submissionId is missing", async () => {
    await GET(makeGetRequest({ assignmentToken: "token-abc" }));

    expect(mockGetCourseWorkPupilProgress).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining("submissionId"),
      }),
      { status: 400 },
    );
  });

  it("should return 400 when assignmentToken is missing", async () => {
    await GET(makeGetRequest({ submissionId: "submission-123" }));

    expect(mockGetCourseWorkPupilProgress).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) }),
      { status: 400 },
    );
  });

  it("should return 500 on unexpected errors", async () => {
    mockGetCourseWorkPupilProgress.mockRejectedValueOnce(
      new Error("Firestore unavailable"),
    );

    await GET(
      makeGetRequest({
        submissionId: "submission-123",
        assignmentToken: "token-abc",
      }),
    );

    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        error: "Failed to retrieve progress",
        details: "Firestore unavailable",
      },
      { status: 500 },
    );
  });
});

describe("POST /api/classroom/coursework/progress", () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetOakGoogleClassroomAddon.mockReturnValue({
      getCourseWorkPupilProgress: mockGetCourseWorkPupilProgress,
      upsertCourseWorkPupilProgress: mockUpsertCourseWorkPupilProgress,
      verifyAuthSession: mockVerifyAuthSession,
    });
  });

  it("should upsert progress and return 200", async () => {
    mockRequest = {
      json: async () => mockProgressBody,
      headers: mockAuthHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockUpsertCourseWorkPupilProgress).toHaveBeenCalledWith(
      mockProgressBody,
      mockAccessToken,
      mockSession,
    );
    expect(NextResponse.json).toHaveBeenCalledWith(mockProgressResult, {
      status: 200,
    });
  });

  it("should accept optional quiz and media fields", async () => {
    const bodyWithQuiz = {
      ...mockProgressBody,
      exitQuiz: { grade: 8, numQuestions: 10, isComplete: true },
      starterQuiz: { grade: 5, numQuestions: 5, isComplete: true },
      video: {
        played: true,
        duration: 300,
        timeElapsed: 300,
        isComplete: true,
      },
      intro: { isComplete: true, worksheetDownloaded: true },
    };

    mockRequest = {
      json: async () => bodyWithQuiz,
      headers: mockAuthHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockUpsertCourseWorkPupilProgress).toHaveBeenCalledWith(
      bodyWithQuiz,
      mockAccessToken,
      mockSession,
    );
    expect(NextResponse.json).toHaveBeenCalledWith(mockProgressResult, {
      status: 200,
    });
  });

  it("should return 401 when auth headers are missing", async () => {
    mockRequest = {
      json: async () => mockProgressBody,
      headers: { get: jest.fn(() => null) },
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockUpsertCourseWorkPupilProgress).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Authentication required" },
      { status: 401 },
    );
  });

  it("should return 400 when required body fields are missing", async () => {
    mockRequest = {
      json: async () => ({ submissionId: "submission-123" }),
      headers: mockAuthHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockUpsertCourseWorkPupilProgress).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Invalid request body" }),
      { status: 400 },
    );
  });

  it("should return 500 on unexpected errors", async () => {
    mockUpsertCourseWorkPupilProgress.mockRejectedValueOnce(
      new Error("Database error"),
    );

    mockRequest = {
      json: async () => mockProgressBody,
      headers: mockAuthHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Failed to upsert progress", details: "Database error" },
      { status: 500 },
    );
  });
});
