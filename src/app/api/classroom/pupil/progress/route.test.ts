/**
 * @jest-environment node
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { GET } from "./route";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

jest.mock("next/server", () => {
  class MockNextResponse {}
  (MockNextResponse as unknown as { json: jest.Mock }).json = jest.fn(
    () => new MockNextResponse(),
  );
  return { NextResponse: MockNextResponse };
});

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
const mockGetPupilLessonProgress = jest.fn();

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

describe("GET /api/classroom/pupil/progress", () => {
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
      getPupilLessonProgress: mockGetPupilLessonProgress,
      upsertPupilLessonProgress: mockUpsertPupilLessonProgress,
    });
  });
  it("should fetch pupil lesson progress", async () => {
    const mockPayload = { lessonProgress: null, submissionState: "NEW" };
    mockGetPupilLessonProgress.mockResolvedValue(mockPayload);

    const mockRequest = {
      headers: mockHeaders,
      url: "http://localhost/api/classroom/pupil/progress?submissionId=sub-1&courseId=course-1&itemId=item-1&attachmentId=attachment-1",
    } as unknown as NextRequest;

    await GET(mockRequest);

    expect(mockGetPupilLessonProgress).toHaveBeenCalledWith(
      "sub-1",
      "attachment-1",
      "item-1",
    );
    expect(NextResponse.json).toHaveBeenCalledWith(mockPayload);
  });

  it("should reject with 400 if required query params are missing", async () => {
    const mockRequest = {
      headers: mockHeaders,
      url: "http://localhost/api/classroom/pupil/progress",
    } as unknown as NextRequest;

    await GET(mockRequest);

    expect(mockGetPupilLessonProgress).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "submissionId, attachmentId and itemId required",
      }),
      { status: 400 },
    );
  });

  it("should reject with 401 if auth headers are missing", async () => {
    const mockMissingAuthHeaders = {
      get: jest.fn(() => null),
    };

    const mockRequest = {
      headers: mockMissingAuthHeaders,
      url: "http://localhost/api/classroom/pupil/progress?submissionId=sub-1&courseId=course-1&itemId=item-1&attachmentId=attachment-1",
    } as unknown as NextRequest;

    await GET(mockRequest);

    expect(mockGetPupilLessonProgress).not.toHaveBeenCalled();
    expect(mockUpsertPupilLessonProgress).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(String),
      }),
      { status: 401 },
    );
  });
});
