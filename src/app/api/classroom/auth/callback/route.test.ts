/**
 * @jest-environment node
 */
import type { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import {
  OakGoogleClassroomException,
  ErrorSeverity,
  ExceptionType,
} from "@oaknational/google-classroom-addon/server";

import { GET } from "./route";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";
jest.mock("@/node-lib/google-classroom/handleNewsletterSignup", () => ({
  handleNewsletterSignup: jest.fn(),
}));

const mockSession = "encrypted_session_data";
const mockAccessToken = "google_access_token";
const mockCode = "test_code_123";

// Mock NextResponse
const mockNextResponseJson = jest.fn();
jest.mock("next/server", () => ({
  NextResponse: {
    json: (...args: unknown[]) => mockNextResponseJson(...args),
  },
}));

// Mock redirect
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));
const mockedRedirect = redirect as unknown as jest.Mock;

// Mock OakGoogleClassroomAddon
jest.mock("@/node-lib/google-classroom", () => {
  const reporterMock = jest.fn();
  return {
    getOakGoogleClassroomAddon: jest.fn(),
    createClassroomErrorReporter: jest.fn(() => reporterMock),
    isOakGoogleClassroomException: jest.fn(() => false),
    getStatusCodeForClassroomError: jest.fn(() => 500),
    __mockReportError: reporterMock,
  };
});
const mockedGetOakGoogleClassroomAddon =
  getOakGoogleClassroomAddon as jest.Mock;

const mockSearchParamsGet = jest.fn();
const mockSearchParamsEntries = jest.fn();

const mockHandleGoogleSignInCallback = jest.fn().mockResolvedValue({
  encryptedSession: mockSession,
  accessToken: mockAccessToken,
});

describe("GET /api/classroom/auth/callback", () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParamsGet.mockClear();
    mockSearchParamsEntries.mockReturnValue([]);

    mockedGetOakGoogleClassroomAddon.mockReturnValue({
      handleGoogleSignInCallback: mockHandleGoogleSignInCallback,
    });
    mockRequest = {
      nextUrl: {
        searchParams: {
          get: mockSearchParamsGet,
          entries: mockSearchParamsEntries,
        },
      },
    } as unknown as NextRequest;
  });

  it("should handle a successful sign-in AND subscribe to newsletter", async () => {
    // Arrange
    mockSearchParamsGet.mockImplementation((key: string) => {
      if (key === "code") return mockCode;
      if (key === "state")
        return JSON.stringify({ subscribeToNewsletter: true });
      return null;
    });

    // Act
    await GET(mockRequest);

    // Assert
    expect(mockSearchParamsGet).toHaveBeenCalledWith("code");
    expect(mockSearchParamsGet).toHaveBeenCalledWith("state");

    expect(mockHandleGoogleSignInCallback).toHaveBeenCalledTimes(1);
    expect(mockHandleGoogleSignInCallback).toHaveBeenCalledWith(
      mockCode,
      expect.any(Function),
    );

    expect(mockedRedirect).toHaveBeenCalledTimes(1);
    expect(mockedRedirect).toHaveBeenCalledWith(
      `/classroom/auth/success?s=${encodeURIComponent(mockSession)}&at=${encodeURIComponent(mockAccessToken)}`,
    );

    expect(mockNextResponseJson).not.toHaveBeenCalled();
  });

  it("should handle a successful sign-in WITHOUT subscribing to newsletter", async () => {
    // Arrange
    mockSearchParamsGet.mockImplementation((key: string) => {
      if (key === "code") return mockCode;
      if (key === "state")
        return JSON.stringify({ subscribeToNewsletter: false });
      return null;
    });

    // Act
    await GET(mockRequest);

    // Assert
    expect(mockHandleGoogleSignInCallback).toHaveBeenCalledTimes(1);
    expect(mockHandleGoogleSignInCallback).toHaveBeenCalledWith(
      mockCode,
      expect.any(Function),
    );

    expect(mockedRedirect).toHaveBeenCalledTimes(1);
    expect(mockedRedirect).toHaveBeenCalledWith(
      `/classroom/auth/success?s=${encodeURIComponent(mockSession)}&at=${encodeURIComponent(mockAccessToken)}`,
    );

    expect(mockNextResponseJson).not.toHaveBeenCalled();
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
        handleGoogleSignInCallback: mockHandleGoogleSignInCallback,
      });
      mockedIsOakGoogleClassroomException.mockReturnValue(false);
    });

    it("should return a 400 error and report to bugsnag if 'code' is missing", async () => {
      // Arrange
      mockSearchParamsGet.mockImplementation((key: string) => {
        if (key === "code") return null;
        return null;
      });

      // Act
      await GET(mockRequest);

      // Assert
      expect(mockedReportError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "OAuth callback missing authorization code",
        }),
        {
          severity: "error",
          searchParams: {},
        },
      );
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        {
          error: "Authentication failed",
          details:
            "Missing authorization code from Google. Please try signing in again.",
        },
        { status: 400 },
      );
      expect(mockHandleGoogleSignInCallback).not.toHaveBeenCalled();
      expect(mockedRedirect).not.toHaveBeenCalled();
    });

    it("should return a 400 error and report to bugsnag when OAuth error is present", async () => {
      // Arrange
      mockSearchParamsGet.mockImplementation((key: string) => {
        if (key === "error") return "access_denied";
        if (key === "error_description") return "User denied access";
        return null;
      });

      // Act
      await GET(mockRequest);

      // Assert
      expect(mockedReportError).toHaveBeenCalledWith(
        expect.objectContaining({ message: "OAuth error: access_denied" }),
        { severity: "warning", errorDescription: "User denied access" },
      );
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        {
          error: "OAuth error",
          details: "access_denied",
          description: "User denied access",
        },
        { status: 400 },
      );
      expect(mockHandleGoogleSignInCallback).not.toHaveBeenCalled();
    });

    it("should return a 400 error and report to bugsnag when OakGoogleClassroomException is thrown", async () => {
      // Arrange
      const mockError = new OakGoogleClassroomException(
        "Your authentication token is invalid. Please sign in again.",
        ExceptionType.GoogleOAuth,
        {
          code: "invalid_token",
          shouldRetry: true,
          severity: ErrorSeverity.Error,
          context: {
            operation: "callback",
            service: ExceptionType.GoogleOAuth,
          },
        },
      );

      mockSearchParamsGet.mockImplementation((key: string) => {
        if (key === "code") return mockCode;
        return null;
      });
      mockHandleGoogleSignInCallback.mockRejectedValue(mockError);
      mockedIsOakGoogleClassroomException.mockReturnValue(true);

      // Act
      await GET(mockRequest);

      // Assert
      expect(mockedReportError).toHaveBeenCalledWith(mockError.toObject());
      expect(mockNextResponseJson).toHaveBeenCalledWith(mockError.toObject(), {
        status: 400,
      });
    });

    it("should return a 500 error and report to bugsnag when a generic error is thrown", async () => {
      // Arrange
      const mockError = new Error("Unexpected failure");
      mockSearchParamsGet.mockImplementation((key: string) => {
        if (key === "code") return mockCode;
        return null;
      });
      mockHandleGoogleSignInCallback.mockRejectedValue(mockError);

      // Act
      await GET(mockRequest);

      // Assert
      expect(mockedReportError).toHaveBeenCalledWith(mockError, {
        severity: "error",
      });
      expect(mockNextResponseJson).toHaveBeenCalledWith(
        {
          error: "Failed to process OAuth callback",
          details: "Unexpected failure",
        },
        { status: 500 },
      );
    });
  });
});
