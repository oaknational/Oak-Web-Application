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
  const actual = jest.requireActual("@/node-lib/google-classroom");
  return {
    getOakGoogleClassroomAddon: jest.fn(),
    createClassroomErrorReporter: jest.fn(() => reporterMock),
    isOakGoogleClassroomException: jest.fn(() => false),
    createCourseWorkBodySchema: actual.createCourseWorkBodySchema,
    __mockReportError: reporterMock,
  };
});

const mockedGetOakGoogleClassroomAddon =
  getOakGoogleClassroomAddon as jest.Mock;

const mockAccessToken = "mock-access-token";
const mockSession = "mock-session-id";

const mockBody = {
  courseId: "course-123",
  title: "Introduction to Algebra",
  lessonSlug: "intro-to-algebra",
  programmeSlug: "maths-primary",
  unitSlug: "algebra-unit-1",
  maxPoints: 10,
};

const mockCreateCourseWork = jest.fn().mockResolvedValue({
  courseId: "course-123",
  title: "Introduction to Algebra",
});

const mockHeaders = {
  get: jest.fn((headerName: string) => {
    if (headerName === "Authorization") return mockAccessToken;
    if (headerName === "X-Oakgc-Session") return mockSession;
    return null;
  }),
};

describe("POST /api/classroom/coursework/create", () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetOakGoogleClassroomAddon.mockReturnValue({
      createCourseWork: mockCreateCourseWork,
    });
  });

  it("should create coursework and return 201", async () => {
    mockRequest = {
      json: async () => mockBody,
      headers: mockHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockCreateCourseWork).toHaveBeenCalledWith(
      mockBody,
      mockAccessToken,
      mockSession,
    );
    expect(NextResponse.json).toHaveBeenCalledWith(
      { courseId: "course-123", title: "Introduction to Algebra" },
      { status: 201 },
    );
  });

  it("should apply the default maxPoints of 10 when omitted", async () => {
    const { maxPoints: _, ...bodyWithoutPoints } = mockBody;
    mockRequest = {
      json: async () => bodyWithoutPoints,
      headers: mockHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockCreateCourseWork).toHaveBeenCalledWith(
      expect.objectContaining({ maxPoints: 10 }),
      mockAccessToken,
      mockSession,
    );
  });

  it("should return 401 when auth headers are missing", async () => {
    mockRequest = {
      json: async () => mockBody,
      headers: { get: jest.fn(() => null) },
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockCreateCourseWork).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Authentication required" },
      { status: 401 },
    );
  });

  it("should return 400 when required body fields are missing", async () => {
    mockRequest = {
      json: async () => ({ courseId: "course-123" }),
      headers: mockHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockCreateCourseWork).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Invalid request body" }),
      { status: 400 },
    );
  });

  it("should return 400 when title is an empty string", async () => {
    mockRequest = {
      json: async () => ({ ...mockBody, title: "" }),
      headers: mockHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockCreateCourseWork).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Invalid request body" }),
      { status: 400 },
    );
  });

  it("should return 500 on unexpected errors", async () => {
    mockCreateCourseWork.mockRejectedValueOnce(new Error("Network failure"));

    mockRequest = {
      json: async () => mockBody,
      headers: mockHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        error: "Failed to create CourseWork",
        details: "Network failure",
      },
      { status: 500 },
    );
  });
});
