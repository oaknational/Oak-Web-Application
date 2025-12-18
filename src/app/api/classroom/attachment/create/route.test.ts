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

const mockResponseJson = jest.fn();
globalThis.Response.json = mockResponseJson;

// Mock NextResponse search params
const mockArgs = {
  courseId: "course-123",
  itemId: "item-id",
  title: "addon title",
  lessonSlug: "string",
  programeSlug: "string",
  unitSlug: "string",
  maxPoints: 1,
};
const mockAccessToken = "mock-access-token";
const mockSession = "mock-session-id";

const mockCreateAttachment = jest
  .fn()
  .mockResolvedValue({ id: "attachment-id" });

describe("POST /api/classroom/attachment/create", () => {
  let mockRequest: NextRequest;

  const mockHeaders = {
    get: jest.fn((headerName: string) => {
      if (headerName === "Authorization") {
        return mockAccessToken;
      }
      if (headerName === "x-oakgc-session") {
        return mockSession;
      }
      return null;
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockedGetOakGoogleClassroomAddon.mockReturnValue({
      createAttachment: mockCreateAttachment,
    });
  });
  it("should correctly create an attachment", async () => {
    mockRequest = {
      json: async () => mockArgs,
      headers: mockHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockCreateAttachment).toHaveBeenCalledWith(
      mockArgs,
      mockAccessToken,
      mockSession,
    );
    expect(NextResponse.json).toHaveBeenCalledWith(
      { attachment: { id: "attachment-id" } },
      { status: 201 },
    );
  });
  it("should handle errors when creating an attachment", async () => {
    const mockErrorMessage = "Failed to create attachment";
    mockCreateAttachment.mockRejectedValueOnce(new Error(mockErrorMessage));

    mockRequest = {
      json: async () => mockArgs,
      headers: mockHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockCreateAttachment).toHaveBeenCalledWith(
      mockArgs,
      mockAccessToken,
      mockSession,
    );
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: mockErrorMessage },
      { status: 500 },
    );
  });
  it("should reject the request with 401 if headers are missing", async () => {
    const missingHeaders = {
      get: jest.fn(() => {
        return null;
      }),
    };

    mockRequest = {
      json: async () => mockArgs,
      headers: missingHeaders,
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockCreateAttachment).not.toHaveBeenCalled();

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Authentication required" },
      { status: 401 },
    );
  });
});
