/**
 * @jest-environment node
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AuthCookieKeys } from "@oaknational/google-classroom-addon/ui";

import { POST } from "./route";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

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

const mockAccessToken = "mock-access-token";
const mockSession = "mock-session-id";

const mockGetAddOnContext = jest.fn().mockResolvedValue({
  studentContext: { submissionId: "submission-123" },
  pupilLoginHint: "123456789",
});

describe("POST /api/classroom/context", () => {
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
      getAddOnContext: mockGetAddOnContext,
    });
  });

  it("should return addon context with submission ID", async () => {
    mockRequest = {
      json: async () => ({
        courseId: "course-123",
        itemId: "item-456",
        attachmentId: "attachment-789",
      }),
      headers: mockHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockGetAddOnContext).toHaveBeenCalledWith(
      "course-123",
      "item-456",
      "attachment-789",
      mockAccessToken,
      mockSession,
    );
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        studentContext: { submissionId: "submission-123" },
        pupilLoginHint: "123456789",
      },
      { status: 200 },
    );
  });

  it("should reject with 401 if headers are missing", async () => {
    mockRequest = {
      json: async () => ({
        courseId: "course-123",
        itemId: "item-456",
        attachmentId: "attachment-789",
      }),
      headers: { get: jest.fn(() => null) },
      cookies: { get: jest.fn(() => undefined) },
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockGetAddOnContext).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Authentication required" },
      { status: 401 },
    );
  });

  it("should accept auth from pupil cookies when headers are missing", async () => {
    mockRequest = {
      json: async () => ({
        courseId: "course-123",
        itemId: "item-456",
        attachmentId: "attachment-789",
      }),
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

    expect(mockGetAddOnContext).toHaveBeenCalledWith(
      "course-123",
      "item-456",
      "attachment-789",
      mockAccessToken,
      mockSession,
    );
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        studentContext: { submissionId: "submission-123" },
        pupilLoginHint: "123456789",
      },
      { status: 200 },
    );
  });

  it("should reject with 400 if body is invalid", async () => {
    mockRequest = {
      json: async () => ({ courseId: "course-123" }), // missing itemId and attachmentId
      headers: mockHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockGetAddOnContext).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Invalid request body" }),
      { status: 400 },
    );
  });

  it("should handle errors", async () => {
    mockGetAddOnContext.mockRejectedValueOnce("API error");
    console.error = jest.fn();

    mockRequest = {
      json: async () => ({
        courseId: "course-123",
        itemId: "item-456",
        attachmentId: "attachment-789",
      }),
      headers: mockHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "API error" },
      { status: 500 },
    );
  });
});
