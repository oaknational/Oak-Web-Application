/**
 * @jest-environment node
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

import { GET } from "./route";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

const mockSession = "encrypted_session_data";
const mockAccessToken = "google_access_token";
const mockCode = "test_code_123";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

// Mock redirect
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));
const mockedRedirect = redirect as unknown as jest.Mock;

// Mock OakGoogleClassroomAddon
jest.mock("@/node-lib/google-classroom", () => ({
  getOakGoogleClassroomAddon: jest.fn(),
}));
const mockedGetOakGoogleClassroomAddon =
  getOakGoogleClassroomAddon as jest.Mock;

// Mock the global Response.json
const mockResponseJson = jest.fn();
global.Response.json = mockResponseJson;

const mockSearchParamsGet = jest.fn();

const mockHandleGoogleSignInCallback = jest.fn().mockResolvedValue({
  encryptedSession: mockSession,
  accessToken: mockAccessToken,
});

describe("GET /api/classroom/auth/callback", () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParamsGet.mockClear();

    mockedGetOakGoogleClassroomAddon.mockReturnValue({
      handleGoogleSignInCallback: mockHandleGoogleSignInCallback,
    });
    mockRequest = {
      nextUrl: {
        searchParams: {
          get: mockSearchParamsGet,
        },
      },
    } as unknown as NextRequest;
  });

  it("should handle a successful sign-in AND subscribe to newsletter", async () => {
    // Arrange
    mockSearchParamsGet.mockImplementation((key: string) => {
      if (key === "code") return mockCode;
      if (key === "subscribeToNewsletter") return "true";
      return null;
    });

    // Act
    await GET(mockRequest);

    // Assert
    expect(mockSearchParamsGet).toHaveBeenCalledWith("code");
    expect(mockSearchParamsGet).toHaveBeenCalledWith("subscribeToNewsletter");

    expect(mockHandleGoogleSignInCallback).toHaveBeenCalledTimes(1);
    expect(mockHandleGoogleSignInCallback).toHaveBeenCalledWith(
      mockCode,
      expect.any(Function),
    );

    expect(mockedRedirect).toHaveBeenCalledTimes(1);
    expect(mockedRedirect).toHaveBeenCalledWith(
      `/classroom/auth/success?s=${encodeURIComponent(mockSession)}&at=${encodeURIComponent(mockAccessToken)}`,
    );

    expect(mockResponseJson).not.toHaveBeenCalled();
  });

  it("should handle a successful sign-in WITHOUT subscribing to newsletter", async () => {
    // Arrange
    mockSearchParamsGet.mockImplementation((key: string) => {
      if (key === "code") return mockCode;
      if (key === "subscribeToNewsletter") return "false"; // or null
      return null;
    });

    // Act
    await GET(mockRequest);

    // Assert
    expect(mockHandleGoogleSignInCallback).toHaveBeenCalledTimes(1);
    expect(mockHandleGoogleSignInCallback).toHaveBeenCalledWith(
      mockCode,
      undefined,
    );

    expect(mockedRedirect).toHaveBeenCalledTimes(1);
    expect(mockedRedirect).toHaveBeenCalledWith(
      `/classroom/auth/success?s=${encodeURIComponent(mockSession)}&at=${encodeURIComponent(mockAccessToken)}`,
    );

    expect(mockResponseJson).not.toHaveBeenCalled();
  });

  it("should return a 400 error if 'code' is missing", async () => {
    // Arrange
    mockSearchParamsGet.mockImplementation((key: string) => {
      if (key === "code") return null;
      return null;
    });

    // Act
    await GET(mockRequest);

    // Assert
    expect(NextResponse.json).toHaveBeenCalledTimes(1);
    expect(NextResponse.json).toHaveBeenCalledWith("code is required", {
      status: 400,
    });

    expect(mockHandleGoogleSignInCallback).not.toHaveBeenCalled();
    expect(mockedRedirect).not.toHaveBeenCalled();
  });
});
