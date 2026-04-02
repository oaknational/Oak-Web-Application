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
const mockGetPostSubmissionState = jest.fn();

describe("GET /api/classroom/submission", () => {
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
      getPostSubmissionState: mockGetPostSubmissionState,
    });
  });

  it("should return the pupil submission state", async () => {
    mockGetPostSubmissionState.mockResolvedValue("CREATED");

    const mockRequest = {
      headers: mockHeaders,
      url: "http://localhost/api/classroom/submission?courseId=course-123&itemId=item-456&attachmentId=attachment-789&submissionId=submission-012",
    } as unknown as NextRequest;

    await GET(mockRequest);

    expect(mockGetPostSubmissionState).toHaveBeenCalledWith(
      {
        courseId: "course-123",
        itemId: "item-456",
        attachmentId: "attachment-789",
        submissionId: "submission-012",
      },
      mockAccessToken,
      mockSession,
    );
    expect(NextResponse.json).toHaveBeenCalledWith(
      { submissionState: "CREATED" },
      { status: 200 },
    );
  });

  it("should reject with 401 if headers are missing", async () => {
    const mockRequest = {
      headers: { get: jest.fn(() => null) },
      url: "http://localhost/api/classroom/submission?courseId=course-123&itemId=item-456&attachmentId=attachment-789&submissionId=submission-012",
    } as unknown as NextRequest;

    await GET(mockRequest);

    expect(mockGetPostSubmissionState).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Authentication required" },
      { status: 401 },
    );
  });

  it("should reject with 400 if query params are missing", async () => {
    const mockRequest = {
      headers: mockHeaders,
      url: "http://localhost/api/classroom/submission",
    } as unknown as NextRequest;

    await GET(mockRequest);

    expect(mockGetPostSubmissionState).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "submissionId, attachmentId, itemId and courseId required",
      }),
      { status: 400 },
    );
  });

  it("should handle errors", async () => {
    mockGetPostSubmissionState.mockRejectedValueOnce("API error");

    const mockRequest = {
      headers: mockHeaders,
      url: "http://localhost/api/classroom/submission?courseId=course-123&itemId=item-456&attachmentId=attachment-789&submissionId=submission-012",
    } as unknown as NextRequest;

    await GET(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "API error" },
      { status: 500 },
    );
  });
});
