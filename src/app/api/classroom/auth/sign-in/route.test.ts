/**
 * @jest-environment node
 */
import type { NextRequest } from "next/server";

import { GET } from "./route";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

// todo: we could create and export one from the package
// Mock OakGoogleClassroomAddon
const mockSignInUrl = "https://google.com/signin/url";
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
const mockGetGoogleSignInUrl = jest.fn().mockResolvedValue(mockSignInUrl);

// Mock the global Response.json
const mockResponseJson = jest.fn();
global.Response.json = mockResponseJson;

// Mock NextResponse search params
const mockLoginHint = "123456789";
const mockSearchParamsGet = jest.fn().mockReturnValue(mockLoginHint);

describe("GET /api/classroom/auth/sign-in", () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    jest.clearAllMocks();

    mockedGetOakGoogleClassroomAddon.mockReturnValue({
      getGoogleSignInUrl: mockGetGoogleSignInUrl,
    });
    mockRequest = {
      nextUrl: {
        searchParams: {
          get: mockSearchParamsGet,
        },
      },
    } as unknown as NextRequest;
  });

  it("should correctly get the sign-in URL using the login_hint", async () => {
    // Act
    await GET(mockRequest);

    // Assert
    expect(mockSearchParamsGet).toHaveBeenCalledTimes(1);
    expect(mockSearchParamsGet).toHaveBeenCalledWith("login_hint");

    expect(mockGetGoogleSignInUrl).toHaveBeenCalledTimes(1);
    expect(mockGetGoogleSignInUrl).toHaveBeenCalledWith(mockLoginHint);

    expect(mockResponseJson).toHaveBeenCalledTimes(1);
    expect(mockResponseJson).toHaveBeenCalledWith(
      { signInUrl: mockSignInUrl },
      { status: 200 },
    );
  });

  it("should handle a missing login_hint", async () => {
    // Arrange
    mockSearchParamsGet.mockReturnValue(null);

    // Act
    await GET(mockRequest);

    // Assert
    expect(mockSearchParamsGet).toHaveBeenCalledWith("login_hint");

    expect(mockGetGoogleSignInUrl).toHaveBeenCalledTimes(1);
    expect(mockGetGoogleSignInUrl).toHaveBeenCalledWith(undefined);

    expect(mockResponseJson).toHaveBeenCalledTimes(1);
    expect(mockResponseJson).toHaveBeenCalledWith(
      { signInUrl: mockSignInUrl },
      { status: 200 },
    );
  });
  describe("error handling", () => {
    const {
      isOakGoogleClassroomException: mockedIsOakGoogleClassroomException,
      __mockReportError: mockedReportError,
    } = jest.requireMock("@/node-lib/google-classroom") as {
      isOakGoogleClassroomException: jest.Mock;
      __mockReportError: jest.Mock;
    };

    beforeEach(() => {
      jest.clearAllMocks();
      mockedGetOakGoogleClassroomAddon.mockReturnValue({
        getGoogleSignInUrl: mockGetGoogleSignInUrl,
      });
      // Reset to default (false) - tests that need true will override
      mockedIsOakGoogleClassroomException.mockReturnValue(false);
    });

    it("should return a 400 status code when an OakGoogleClassroomException is thrown and report to bugsnag", async () => {
      // Arrange
      const mockError = {
        name: "OakGoogleClassroomException",
        message: "Your session has expired. Please sign in again.",
        code: "invalid_grant",
        type: "google-oauth",
        severity: "error",
        shouldRetry: false,
        context: { operation: "sign-in", service: "google-oauth" },
      };
      mockGetGoogleSignInUrl.mockRejectedValue(mockError);
      mockedIsOakGoogleClassroomException.mockReturnValue(true);

      // Act
      await GET(mockRequest);

      // Assert
      expect(mockedReportError).toHaveBeenCalledWith(mockError, {
        severity: "error",
        code: "invalid_grant",
        type: "google-oauth",
        context: { operation: "sign-in", service: "google-oauth" },
      });
      expect(mockResponseJson).toHaveBeenCalledWith(
        {
          error: "Your session has expired. Please sign in again.",
          code: "invalid_grant",
          type: "google-oauth",
          severity: "error",
          shouldRetry: false,
        },
        { status: 400 },
      );
    });

    it("should return a 500 status code when a generic error is thrown and report to bugsnag", async () => {
      // Arrange
      const mockError = new Error("Something went wrong");
      mockGetGoogleSignInUrl.mockRejectedValue(mockError);

      // Act
      await GET(mockRequest);

      // Assert
      expect(mockedReportError).toHaveBeenCalledWith(mockError, {
        severity: "error",
      });
      expect(mockResponseJson).toHaveBeenCalledWith(
        {
          error: "Could not get Google Sign In link",
          details: "Something went wrong",
        },
        { status: 500 },
      );
    });
  });
});
