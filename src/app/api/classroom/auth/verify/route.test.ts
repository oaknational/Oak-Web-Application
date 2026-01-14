/**
 * @jest-environment node
 */
import type { NextRequest } from "next/server";

import { GET } from "./route";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

// Mock OakGoogleClassroomAddon
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

// Mock the global Response.json
const mockResponseJson = jest.fn();
global.Response.json = mockResponseJson;

const mockValidSession = "valid_session";
const mockInvalidSession = "invalid_session";
const mockVerifiedSession = "verified_session";
const mockValidToken = "valid_token";

const mockVerifyAuthSession = jest.fn();
const mockRequestJson = jest.fn();
const mockRequestHeadersGet = jest.fn();

describe("POST /api/classroom/auth/verify", () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    jest.clearAllMocks();

    mockedGetOakGoogleClassroomAddon.mockReturnValue({
      verifyAuthSession: mockVerifyAuthSession,
    });

    mockRequest = {
      json: mockRequestJson,
      headers: {
        get: mockRequestHeadersGet,
      },
    } as unknown as NextRequest;
  });

  it("should return authenticated: true for a valid session", async () => {
    // Arrange
    mockVerifyAuthSession.mockResolvedValue({
      session: mockVerifiedSession,
      token: mockValidToken,
    });
    mockRequestHeadersGet.mockImplementation((name) => {
      if (name === "Authorization") return mockValidToken;
      if (name === "X-Oakgc-Session") return mockValidSession;
      return null;
    });

    // Act
    await GET(mockRequest);

    // Assert
    expect(mockVerifyAuthSession).toHaveBeenCalledTimes(1);
    expect(mockVerifyAuthSession).toHaveBeenCalledWith(
      mockValidSession,
      mockValidToken,
    );

    expect(mockResponseJson).toHaveBeenCalledTimes(1);
    expect(mockResponseJson).toHaveBeenCalledWith(
      {
        authenticated: true,
        session: mockVerifiedSession,
        token: mockValidToken,
      },
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
        verifyAuthSession: mockVerifyAuthSession,
      });
      mockedIsOakGoogleClassroomException.mockReturnValue(false);
    });

    it("should return authenticated: false for an invalid session", async () => {
      // Arrange
      mockVerifyAuthSession.mockResolvedValue(null);
      mockRequestHeadersGet.mockImplementation((name) => {
        if (name === "Authorization") return mockValidToken;
        if (name === "X-Oakgc-Session") return mockInvalidSession;
        return null;
      });

      // Act
      await GET(mockRequest);

      // Assert
      expect(mockVerifyAuthSession).toHaveBeenCalledTimes(1);
      expect(mockVerifyAuthSession).toHaveBeenCalledWith(
        mockInvalidSession,
        mockValidToken,
      );

      expect(mockResponseJson).toHaveBeenCalledTimes(1);
      expect(mockResponseJson).toHaveBeenCalledWith(
        { authenticated: false, session: undefined, token: undefined },
        { status: 401 },
      );
    });

    it("should return authenticated: false if no session is provided", async () => {
      // Arrange
      mockRequestJson.mockResolvedValue({ session: null });
      mockRequestHeadersGet.mockImplementation((name) => {
        if (name === "Authorization") return null;
        if (name === "X-Oakgc-Session") return null;
        return null;
      });

      // Act
      await GET(mockRequest);

      // Assert
      expect(mockVerifyAuthSession).not.toHaveBeenCalled();

      expect(mockResponseJson).toHaveBeenCalledTimes(1);
      expect(mockResponseJson).toHaveBeenCalledWith(
        { authenticated: false },
        { status: 401 },
      );
    });

    it("should return error details and report to bugsnag when OakGoogleClassroomException is thrown", async () => {
      // Arrange
      const mockError = {
        name: "OakGoogleClassroomException",
        message: "Session decryption failed",
        code: "decryption_error",
        type: "encryption",
        severity: "error",
        shouldRetry: false,
        context: { operation: "verify", service: "encryption" },
      };
      mockRequestHeadersGet.mockImplementation((name) => {
        if (name === "Authorization") return mockValidToken;
        if (name === "X-Oakgc-Session") return mockValidSession;
        return null;
      });
      mockVerifyAuthSession.mockRejectedValue(mockError);
      mockedIsOakGoogleClassroomException.mockReturnValue(true);

      // Act
      await GET(mockRequest);

      // Assert
      expect(mockedReportError).toHaveBeenCalledWith(mockError, {
        severity: "error",
        code: "decryption_error",
        type: "encryption",
        context: { operation: "verify", service: "encryption" },
      });
      expect(mockResponseJson).toHaveBeenCalledWith(
        {
          error: "Session decryption failed",
          code: "decryption_error",
          type: "encryption",
          severity: "error",
          shouldRetry: false,
        },
        { status: 401 },
      );
    });

    it("should return 401 and report to bugsnag when a generic error is thrown", async () => {
      // Arrange
      const mockError = new Error("Unexpected verification failure");
      mockRequestHeadersGet.mockImplementation((name) => {
        if (name === "Authorization") return mockValidToken;
        if (name === "X-Oakgc-Session") return mockValidSession;
        return null;
      });
      mockVerifyAuthSession.mockRejectedValue(mockError);

      // Act
      await GET(mockRequest);

      // Assert
      expect(mockedReportError).toHaveBeenCalledWith(mockError, {
        severity: "error",
      });
      expect(mockResponseJson).toHaveBeenCalledWith(
        {
          authenticated: false,
          error: "Session verification failed",
        },
        { status: 401 },
      );
    });
  });
});
