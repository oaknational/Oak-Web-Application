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

const mockVerifyAuthSession = jest.fn();
const mockRequestJson = jest.fn();

describe("POST /api/classroom/auth/verify", () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    jest.clearAllMocks();

    mockedGetOakGoogleClassroomAddon.mockReturnValue({
      verifyAuthSession: mockVerifyAuthSession,
    });

    mockRequest = {
      json: mockRequestJson,
    } as unknown as NextRequest;
  });

  it("should return authenticated: true for a valid session", async () => {
    // Arrange
    mockRequestJson.mockResolvedValue({ session: mockValidSession });
    mockVerifyAuthSession.mockResolvedValue(mockVerifiedSession);

    // Act
    await GET(mockRequest);

    // Assert
    expect(mockRequestJson).toHaveBeenCalledTimes(1);

    expect(mockVerifyAuthSession).toHaveBeenCalledTimes(1);
    expect(mockVerifyAuthSession).toHaveBeenCalledWith(mockValidSession);

    expect(mockResponseJson).toHaveBeenCalledTimes(1);
    expect(mockResponseJson).toHaveBeenCalledWith(
      { authenticated: true },
      { status: 200 },
    );
  });

  it("should return authenticated: false for an invalid session", async () => {
    // Arrange
    mockRequestJson.mockResolvedValue({ session: mockInvalidSession });
    mockVerifyAuthSession.mockResolvedValue(null);

    // Act
    await GET(mockRequest);

    // Assert
    expect(mockRequestJson).toHaveBeenCalledTimes(1);

    expect(mockVerifyAuthSession).toHaveBeenCalledTimes(1);
    expect(mockVerifyAuthSession).toHaveBeenCalledWith(mockInvalidSession);

    expect(mockResponseJson).toHaveBeenCalledTimes(1);
    expect(mockResponseJson).toHaveBeenCalledWith(
      { authenticated: false },
      { status: 401 },
    );
  });

  it("should return authenticated: false if no session is provided", async () => {
    // Arrange
    mockRequestJson.mockResolvedValue({ session: null });

    // Act
    await GET(mockRequest);

    // Assert
    expect(mockRequestJson).toHaveBeenCalledTimes(1);

    expect(mockVerifyAuthSession).not.toHaveBeenCalled();

    expect(mockResponseJson).toHaveBeenCalledTimes(1);
    expect(mockResponseJson).toHaveBeenCalledWith(
      { authenticated: false },
      { status: 401 },
    );
  });
});
