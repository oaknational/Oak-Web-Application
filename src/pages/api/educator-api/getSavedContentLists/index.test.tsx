import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";

import handler from ".";

import {
  setGetAuth,
  mockGetAuthSignedOut,
  installMockClerkClient,
  mockGetAuthSignedIn,
  mockServerUser,
} from "@/__tests__/__helpers__/mockClerkServer";

const updateUserMetadata = jest.fn();
const getUser = jest.fn();

jest.mock("@/node-lib/educator-api", () => ({
  getAuthenticatedEducatorApi: jest.fn().mockResolvedValue({
    getUserListContent: jest.fn().mockResolvedValue({
      users_content: [
        {
          users_content_lists: {
            content: {
              browse_mv: [
                {
                  unit_title: "Mock Unit",
                  year: "2023",
                  keystage: "KS2",
                  tier: null,
                  examboard: null,
                  subject: "Maths",
                  supplementary_data: [
                    {
                      slug: "lesson-1",
                      title: "Lesson 1",
                      _state: "published",
                      order: 1,
                    },
                    {
                      slug: "lesson-2",
                      title: "Lesson 2",
                      _state: "published",
                      order: 2,
                    },
                  ],
                },
              ],
              programme_slug: "mock-programme",
              unit_slug: "mock-unit",
            },
            created_at: new Date().toISOString(),
          },
        },
      ],
    }),
  }),
}));

describe("api/educator-api/getSavedContentLists", () => {
  installMockClerkClient({
    updateUserMetadata,
    getUser,
    mockUser: mockServerUser,
  });

  beforeEach(() => {
    setGetAuth(mockGetAuthSignedIn);
  });

  it("should return 200 with valid response for a signed in user", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      "mock-programme": {
        year: "2023",
        keystage: "KS2",
        subject: "Maths",
        tier: null,
        examboard: null,
        units: [
          {
            unitSlug: "mock-unit",
            unitTitle: "Mock Unit",
            savedAt: expect.any(String), // Date string
            lessons: [
              {
                slug: "lesson-1",
                title: "Lesson 1",
                state: "published",
                order: 1,
              },
              {
                slug: "lesson-2",
                title: "Lesson 2",
                state: "published",
                order: 2,
              },
            ],
          },
        ],
      },
    });
  });
  it("should return 200 with an empty record for a signed out user", async () => {
    setGetAuth(mockGetAuthSignedOut);
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({});
  });
});
