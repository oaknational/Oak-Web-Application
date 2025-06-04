import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";

import {
  installMockClerkClient,
  mockServerUser,
  setGetAuth,
  mockGetAuthSignedIn,
  mockGetAuthSignedOut,
} from "@/__tests__/__helpers__/mockClerkServer";
import handler from "@/pages/api/educator/unsaveUnit/[programmeSlug]/[unitSlug]";

jest.mock("@clerk/nextjs/server");

const updateUserMetadata = jest.fn();
const getUser = jest.fn();

const mockDeleteUserListContent = jest.fn();

jest.mock("@/node-lib/educator-api", () => ({
  getAuthenticatedEducatorApi: jest.fn().mockResolvedValue({
    deleteUserListContent: () => mockDeleteUserListContent(),
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

describe("/api/educator-api/unsaveUnit/[programmeSlug]/[unitSlug]", () => {
  installMockClerkClient({
    updateUserMetadata,
    getUser,
    mockUser: mockServerUser,
  });

  beforeEach(() => {
    setGetAuth(mockGetAuthSignedIn);
    mockDeleteUserListContent.mockResolvedValue({});
  });

  it("should return 200 for a signed in user", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { programmeSlug: "test-programme", unitSlug: "test-unit" },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
  });
  it("should return 401 for a signed out user", async () => {
    setGetAuth(mockGetAuthSignedOut);
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { programmeSlug: "test-programme", unitSlug: "test-unit" },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(401);
  });
  it("should return 400 if programmeSlug is missing or invalid", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { programmeSlug: "" },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toBe("Bad request");
  });
  it("should report an error if the request fails", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { programmeSlug: "test-programme", unitSlug: "test-unit" },
    });

    const error = new Error("Test error");
    mockDeleteUserListContent.mockRejectedValue(error);

    await handler(req, res);
    expect(res._getStatusCode()).toBe(500);
    expect(mockErrorReporter).toHaveBeenCalled();
  });
});
