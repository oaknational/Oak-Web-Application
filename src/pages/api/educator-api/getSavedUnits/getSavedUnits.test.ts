import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";

import handler from "./[programmeSlug]";

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

jest.mock("@/node-lib/educator-api", () => ({
  getAuthenticatedEducatorApi: jest.fn().mockResolvedValue({
    getUserContent: jest.fn().mockResolvedValue({
      users_content: [
        { content: { unit_slug: "unit1" } },
        { content: { unit_slug: "unit2" } },
      ],
    }),
  }),
}));

describe("/api/educator-api/getSavedUnits/[programmeSlug]", () => {
  installMockClerkClient({
    updateUserMetadata,
    getUser,
    mockUser: mockServerUser,
  });

  beforeEach(() => {
    setGetAuth(mockGetAuthSignedIn);
  });

  it("should return 200 with valid unit slugs for a signed in user", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { programmeSlug: "test-programme" },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(["unit1", "unit2"]);
  });
  it("should return 200 with empty array for a signed out user", async () => {
    setGetAuth(mockGetAuthSignedOut);
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { programmeSlug: "test-programme" },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual([]);
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
});
