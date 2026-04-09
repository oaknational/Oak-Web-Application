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

const mockCourses = [
  { id: "course-1", name: "Maths Year 7", section: "Period 1" },
  { id: "course-2", name: "Maths Year 8" },
];

const mockListCourses = jest.fn().mockResolvedValue(mockCourses);

const mockAuthHeaders = {
  get: jest.fn((name: string) => {
    if (name === "Authorization") return mockAccessToken;
    if (name === "X-Oakgc-Session") return mockSession;
    return null;
  }),
};

describe("GET /api/classroom/coursework/courses", () => {
  let mockRequest: Partial<NextRequest>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetOakGoogleClassroomAddon.mockReturnValue({
      listCourses: mockListCourses,
    });
  });

  it("returns the list of courses", async () => {
    mockRequest = { headers: mockAuthHeaders };

    await GET(mockRequest as NextRequest);

    expect(mockListCourses).toHaveBeenCalledWith(mockAccessToken, mockSession);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { courses: mockCourses },
      { status: 200 },
    );
  });

  it("returns 401 when auth headers are missing", async () => {
    mockRequest = { headers: { get: jest.fn(() => null) } };

    await GET(mockRequest as NextRequest);

    expect(mockListCourses).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Authentication required" },
      { status: 401 },
    );
  });

  it("returns 401 when only Authorization header is present", async () => {
    mockRequest = {
      headers: {
        get: jest.fn((name: string) =>
          name === "Authorization" ? mockAccessToken : null,
        ),
      },
    };

    await GET(mockRequest as NextRequest);

    expect(mockListCourses).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Authentication required" },
      { status: 401 },
    );
  });

  it("returns 500 on unexpected errors", async () => {
    mockListCourses.mockRejectedValueOnce(new Error("Classroom API down"));
    mockRequest = { headers: mockAuthHeaders };

    await GET(mockRequest as NextRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Failed to list courses", details: "Classroom API down" },
      { status: 500 },
    );
  });
});
