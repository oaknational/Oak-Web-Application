/**
 * @jest-environment node
 */
import type { NextRequest } from "next/server";
import {
  OakGoogleClassroomException,
  ErrorSeverity,
  ExceptionType,
} from "@oaknational/google-classroom-addon/server";

import { GET } from "./route";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

// Mock NextResponse
const mockNextResponseJson = jest.fn();
jest.mock("next/server", () => ({
  NextResponse: {
    json: (...args: unknown[]) => mockNextResponseJson(...args),
  },
}));

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
    expect(mockSearchParamsGet).toHaveBeenCalledWith("login_hint");
    expect(mockSearchParamsGet).toHaveBeenCalledWith("subscribeToNewsletter");

    expect(mockGetGoogleSignInUrl).toHaveBeenCalledTimes(1);
    expect(mockGetGoogleSignInUrl).toHaveBeenCalledWith(mockLoginHint, false);

    expect(mockNextResponseJson).toHaveBeenCalledTimes(1);
    expect(mockNextResponseJson).toHaveBeenCalledWith(
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
    expect(mockSearchParamsGet).toHaveBeenCalledWith("subscribeToNewsletter");

    expect(mockGetGoogleSignInUrl).toHaveBeenCalledTimes(1);
    expect(mockGetGoogleSignInUrl).toHaveBeenCalledWith(undefined, false);

    expect(mockNextResponseJson).toHaveBeenCalledTimes(1);
    expect(mockNextResponseJson).toHaveBeenCalledWith(
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
      const mockError = new OakGoogleClassroomException(
        "Your session has expired. Please sign in again.",
        ExceptionType.GoogleOAuth,
        {
          code: "invalid_grant",
          shouldRetry: false,
          severity: ErrorSeverity.Error,
          context: { operation: "sign-in", service: ExceptionType.GoogleOAuth },
        },
      );

      mockGetGoogleSignInUrl.mockRejectedValue(mockError);
      mockedIsOakGoogleClassroomException.mockReturnValue(true);

      // Act
      await GET(mockRequest);

      // Assert
      expect(mockedReportError).toHaveBeenCalledWith(mockError.toObject());
      expect(mockNextResponseJson).toHaveBeenCalledWith(mockError.toObject(), {
        status: 400,
      });
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
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        {
          error: "Could not get Google Sign In link",
          details: "Something went wrong",
        },
        { status: 500 },
      );
    });
  });
});
