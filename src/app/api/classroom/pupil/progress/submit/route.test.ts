/**
 * @jest-environment node
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  ErrorSeverity,
  ExceptionType,
  OakGoogleClassroomException,
} from "@oaknational/google-classroom-addon/server";
import { AuthCookieKeys } from "@oaknational/google-classroom-addon/ui";

import { POST } from "./route";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

jest.mock("@oaknational/google-classroom-addon/types", () => ({
  upsertPupilLessonProgressArgsSchema: {
    safeParse: jest.fn((body: unknown) => ({
      success: true,
      data: body,
    })),
  },
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

jest.mock("@/node-lib/google-classroom", () => {
  const actual = jest.requireActual<
    typeof import("@/node-lib/google-classroom")
  >("@/node-lib/google-classroom");
  const reporterMock = jest.fn();
  return {
    ...actual,
    getOakGoogleClassroomAddon: jest.fn(),
    createClassroomErrorReporter: jest.fn(() => reporterMock),
    isOakGoogleClassroomException: jest.fn(() => false),
    __mockReportError: reporterMock,
  };
});
const mockedGetOakGoogleClassroomAddon =
  getOakGoogleClassroomAddon as jest.Mock;
const { isOakGoogleClassroomException: mockedIsOakGoogleClassroomException } =
  jest.requireMock("@/node-lib/google-classroom");

const mockUpsertArgsSafeParse = jest.mocked(
  jest.requireMock("@oaknational/google-classroom-addon/types")
    .upsertPupilLessonProgressArgsSchema.safeParse,
);

const mockAccessToken = "mock-access-token";
const mockSession = "mock-session-id";

const mockProgressArgs = {
  submissionId: "submission-123",
  attachmentId: "attachment-456",
  courseId: "course-789",
  itemId: "item-012",
  pupilLoginHint: "123456789",
  exitQuiz: { grade: 4, numQuestions: 6, isComplete: true },
};

const mockUpsertPupilLessonProgress = jest.fn().mockResolvedValue({
  ...mockProgressArgs,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
});

describe("POST /api/classroom/pupil/progress/submit", () => {
  let mockRequest: NextRequest;

  const mockHeaders = {
    get: jest.fn((headerName: string) => {
      if (headerName === "Authorization") return mockAccessToken;
      if (headerName === "x-oakgc-session") return mockSession;
      return null;
    }),
  };

  beforeEach(() => {
    mockUpsertPupilLessonProgress.mockClear();
    mockUpsertArgsSafeParse.mockImplementation((body: unknown) => ({
      success: true,
      data: body,
    }));
    mockedGetOakGoogleClassroomAddon.mockReturnValue({
      upsertPupilLessonProgress: mockUpsertPupilLessonProgress,
    });
  });

  it("should submit pupil lesson progress", async () => {
    mockRequest = {
      json: async () => mockProgressArgs,
      headers: mockHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockUpsertPupilLessonProgress).toHaveBeenCalledWith(
      mockProgressArgs,
      mockAccessToken,
      mockSession,
    );
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        submissionId: "submission-123",
      }),
      { status: 200 },
    );
  });

  it("should reject with 401 if headers are missing", async () => {
    mockRequest = {
      json: async () => mockProgressArgs,
      headers: { get: jest.fn(() => null) },
      cookies: { get: jest.fn(() => undefined) },
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockUpsertPupilLessonProgress).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Authentication required" },
      { status: 401 },
    );
  });

  it("should accept auth from pupil cookies when headers are missing", async () => {
    mockRequest = {
      json: async () => mockProgressArgs,
      headers: { get: jest.fn(() => null) },
      cookies: {
        get: jest.fn((name: string) => {
          if (name === AuthCookieKeys.PupilAccessToken) {
            return { name, value: mockAccessToken };
          }
          if (name === AuthCookieKeys.PupilSession) {
            return { name, value: mockSession };
          }
          return undefined;
        }),
      },
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockUpsertPupilLessonProgress).toHaveBeenCalledWith(
      mockProgressArgs,
      mockAccessToken,
      mockSession,
    );
  });

  it("should reject with 400 if body is invalid", async () => {
    mockUpsertArgsSafeParse.mockReturnValueOnce({
      success: false,
      error: { flatten: () => ({ fieldErrors: {} }) },
    });

    mockRequest = {
      json: async () => ({ submissionId: "sub-123" }), // missing required fields
      headers: mockHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockUpsertPupilLessonProgress).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Invalid request body" }),
      { status: 400 },
    );
  });

  it("should return 403 for OakGoogleClassroomException", async () => {
    const mockError = new OakGoogleClassroomException(
      "Submission is not in an updatable state",
      ExceptionType.OakGoogleClassroom,
      {
        code: "invalid_submission_state",
        shouldRetry: false,
        severity: ErrorSeverity.Error,
      },
    );
    mockUpsertPupilLessonProgress.mockRejectedValueOnce(mockError);
    mockedIsOakGoogleClassroomException.mockReturnValueOnce(true);

    mockRequest = {
      json: async () => mockProgressArgs,
      headers: mockHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(mockError.toObject(), {
      status: 403,
    });
  });

  it("should handle generic errors with 500", async () => {
    mockUpsertPupilLessonProgress.mockRejectedValueOnce("Unknown error");
    console.error = jest.fn();

    mockRequest = {
      json: async () => mockProgressArgs,
      headers: mockHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Unknown error" },
      { status: 500 },
    );
  });
});
