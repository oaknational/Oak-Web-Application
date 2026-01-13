/**
 * @jest-environment node
 */
import type { NextRequest } from "next/server";

import { GET } from "./route";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

// Mock OakGoogleClassroomAddon
jest.mock("@/node-lib/google-classroom", () => ({
  getOakGoogleClassroomAddon: jest.fn(),
}));
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
    mockVerifyAuthSession.mockResolvedValue(mockVerifiedSession);
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
      { authenticated: true },
      { status: 200 },
    );
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
      { authenticated: false },
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
});
