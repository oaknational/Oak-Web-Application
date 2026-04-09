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
    __mockReportError: reporterMock,
  };
});

const mockedGetOakGoogleClassroomAddon =
  getOakGoogleClassroomAddon as jest.Mock;

const mockCourseWork = {
  lessonSlug: "intro-to-algebra",
  programmeSlug: "maths-primary",
  unitSlug: "algebra-unit-1",
  courseWorkId: "coursework-456",
  courseId: "course-789",
};

const mockPupilProgress = {
  exitQuiz: { grade: 8, numQuestions: 10, isComplete: true },
};

const mockGetClassroomCourseWork = jest.fn().mockResolvedValue(mockCourseWork);
const mockGetCourseWorkPupilProgress = jest
  .fn()
  .mockResolvedValue(mockPupilProgress);

const makeRequest = (params: Record<string, string>) =>
  ({
    url: `https://example.com/api/classroom/coursework/results?${new URLSearchParams(params).toString()}`,
  }) as unknown as NextRequest;

describe("GET /api/classroom/coursework/results", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetOakGoogleClassroomAddon.mockReturnValue({
      getClassroomCourseWork: mockGetClassroomCourseWork,
      getCourseWorkPupilProgress: mockGetCourseWorkPupilProgress,
    });
  });

  it("returns lessonSlug, programmeSlug, unitSlug and pupilProgress", async () => {
    await GET(
      makeRequest({ assignmentToken: "token-abc", submissionId: "sub-123" }),
    );

    expect(mockGetClassroomCourseWork).toHaveBeenCalledWith("token-abc");
    expect(mockGetCourseWorkPupilProgress).toHaveBeenCalledWith(
      "sub-123",
      "token-abc",
    );
    expect(NextResponse.json).toHaveBeenCalledWith({
      lessonSlug: "intro-to-algebra",
      programmeSlug: "maths-primary",
      unitSlug: "algebra-unit-1",
      pupilProgress: mockPupilProgress,
    });
  });

  it("fetches courseWork and pupilProgress in parallel", async () => {
    const order: string[] = [];
    mockGetClassroomCourseWork.mockImplementationOnce(async () => {
      order.push("courseWork");
      return mockCourseWork;
    });
    mockGetCourseWorkPupilProgress.mockImplementationOnce(async () => {
      order.push("pupilProgress");
      return mockPupilProgress;
    });

    await GET(
      makeRequest({ assignmentToken: "token-abc", submissionId: "sub-123" }),
    );

    expect(mockGetClassroomCourseWork).toHaveBeenCalledTimes(1);
    expect(mockGetCourseWorkPupilProgress).toHaveBeenCalledTimes(1);
    expect(order).toEqual(["courseWork", "pupilProgress"]);
  });

  it("returns 404 when the assignment is not found", async () => {
    mockGetClassroomCourseWork.mockResolvedValueOnce(null);

    await GET(
      makeRequest({ assignmentToken: "token-abc", submissionId: "sub-123" }),
    );

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Assignment not found" },
      { status: 404 },
    );
  });

  it("returns 400 when assignmentToken is missing", async () => {
    await GET(makeRequest({ submissionId: "sub-123" }));

    expect(mockGetClassroomCourseWork).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "assignmentToken and submissionId are required" },
      { status: 400 },
    );
  });

  it("returns 400 when submissionId is missing", async () => {
    await GET(makeRequest({ assignmentToken: "token-abc" }));

    expect(mockGetClassroomCourseWork).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "assignmentToken and submissionId are required" },
      { status: 400 },
    );
  });

  it("returns 500 on unexpected errors", async () => {
    mockGetClassroomCourseWork.mockRejectedValueOnce(
      new Error("Firestore down"),
    );

    await GET(
      makeRequest({ assignmentToken: "token-abc", submissionId: "sub-123" }),
    );

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Failed to fetch results", details: "Firestore down" },
      { status: 500 },
    );
  });
});
