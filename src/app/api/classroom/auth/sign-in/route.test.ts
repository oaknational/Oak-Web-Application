/**
 * @jest-environment node
 */
import type { NextRequest } from "next/server";

import { GET } from "./route";

import { getOakGoogleClassroomAddon } from "@/node-lib/google-classroom";

// todo: we could create and export one from the package
// Mock OakGoogleClassroomAddon
const mockSignInUrl = "https://google.com/signin/url";
jest.mock("@/node-lib/google-classroom", () => ({
  getOakGoogleClassroomAddon: jest.fn(),
  createClassroomErrorReporter: jest.fn(() => jest.fn()),
  isOakGoogleClassroomException: jest.fn(() => false),
  getStatusCodeForClassroomError: jest.fn(() => 500),
}));
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
});
