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

jest.mock("@/node-lib/google-classroom", () => ({
  getOakGoogleClassroomAddon: jest.fn(),
}));
const mockedGetOakGoogleClassroomAddon =
  getOakGoogleClassroomAddon as jest.Mock;

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
    jest.clearAllMocks();
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
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockUpsertPupilLessonProgress).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Authentication required" },
      { status: 401 },
    );
  });

  it("should reject with 400 if body is invalid", async () => {
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
    const mockException = {
      name: "OakGoogleClassroomException",
      message: "Submission is not in an updatable state",
      type: "OakGoogleClassroom",
    };
    mockUpsertPupilLessonProgress.mockRejectedValueOnce(mockException);

    mockRequest = {
      json: async () => mockProgressArgs,
      headers: mockHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(mockException, {
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
