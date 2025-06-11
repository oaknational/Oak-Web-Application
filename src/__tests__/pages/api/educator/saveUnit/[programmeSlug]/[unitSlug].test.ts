import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";

import handler from "@/pages/api/educator/saveUnit/[programmeSlug]/[unitSlug]";
import {
  installMockClerkClient,
  mockServerUser,
  setGetAuth,
  mockGetAuthSignedIn,
  mockGetAuthSignedOut,
} from "@/__tests__/__helpers__/mockClerkServer";

jest.mock("@clerk/nextjs/server");

const updateUserMetadata = jest.fn();
const getUser = jest.fn();

const mockCreateUserListContent = jest.fn();
const mockGetUser = jest.fn();
const mockCreateUser = jest.fn();

jest.mock("@/node-lib/educator-api", () => ({
  getAuthenticatedEducatorApi: jest.fn().mockResolvedValue({
    createUserListContent: () => mockCreateUserListContent(),
    getUser: () => mockGetUser(),
    createUser: () => mockCreateUser(),
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

describe("/api/educator/saveUnit/[programmeSlug]/[unitSlug]", () => {
  installMockClerkClient({
    updateUserMetadata,
    getUser,
    mockUser: mockServerUser,
  });

  beforeEach(() => {
    setGetAuth(mockGetAuthSignedIn);
    mockCreateUserListContent.mockResolvedValue({});
    mockGetUser.mockResolvedValue({
      user: [{ id: "test-user-id" }],
    });
  });

  it("should return 200 for a signed in user", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { programmeSlug: "test-programme", unitSlug: "test-unit" },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(mockCreateUser).not.toHaveBeenCalled();
  });
  it("should create a user if it does not exist", async () => {
    mockGetUser.mockResolvedValue({ user: [] });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { programmeSlug: "test-programme", unitSlug: "test-unit" },
    });

    await handler(req, res);
    expect(mockCreateUser).toHaveBeenCalled();
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
    mockCreateUserListContent.mockRejectedValue(error);

    await handler(req, res);
    expect(res._getStatusCode()).toBe(500);
    expect(mockErrorReporter).toHaveBeenCalled();
  });
});
