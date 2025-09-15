import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";

import handler from "@/pages/api/educator/getSavedUnitCount";
import {
  installMockClerkClient,
  mockServerUser,
  setGetAuth,
  mockGetAuthSignedIn,
  mockGetAuthSignedOut,
} from "@/__tests__/__helpers__/mockClerkServer";
import userListContentCountFixture from "@/node-lib/educator-api/fixtures/userListContentCount.fixture";

jest.mock("@clerk/nextjs/server");

const updateUserMetadata = jest.fn();
const getUser = jest.fn();

const mockGetUserListContentCount = jest.fn();

jest.mock("@/node-lib/educator-api", () => ({
  getAuthenticatedEducatorApi: jest.fn().mockResolvedValue({
    getUserListContentCount: () => mockGetUserListContentCount(),
  }),
}));

const mockErrorReporter = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      mockErrorReporter(...args),
}));

describe("/api/educator/getSavedUnitCount", () => {
  installMockClerkClient({
    updateUserMetadata,
    getUser,
    mockUser: mockServerUser,
  });

  beforeEach(() => {
    setGetAuth(mockGetAuthSignedIn);
    mockGetUserListContentCount.mockResolvedValue(
      userListContentCountFixture(),
    );
  });

  it("should return 200 with valid unit count for a signed in user", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(10);
  });
  it("should return 200 with 0 for a signed out user", async () => {
    setGetAuth(mockGetAuthSignedOut);
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual(0);
  });
  it("should report an error", async () => {
    mockGetUserListContentCount.mockRejectedValue(new Error("Test error"));
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(500);
    expect(mockErrorReporter).toHaveBeenCalled();
  });
});
