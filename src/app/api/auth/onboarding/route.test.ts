/**
 * @jest-environment node
 */
import { clerkClient, currentUser } from "@clerk/nextjs/server";

import { POST } from "./route";

import { mockCurrentUser } from "@/__tests__/__helpers__/mockUser";

let user: Awaited<ReturnType<typeof currentUser>>;

jest.mock("@clerk/nextjs/server", () => {
  const updateUserMetadataSpy = jest.fn();

  return {
    clerkClient() {
      return {
        users: {
          updateUserMetadata: updateUserMetadataSpy,
        },
      };
    },
    currentUser() {
      return Promise.resolve(user);
    },
  };
});

describe("/api/auth/onboarding", () => {
  let req: Request;
  beforeEach(() => {
    req = new Request("http://example.com", {
      method: "POST",
      body: JSON.stringify({ isTeacher: true }),
      headers: {
        referer: "http://example.com/foo",
        "x-country": "US",
      },
    });

    user = mockCurrentUser;
  });

  it("requires authentication", async () => {
    user = null;
    const response = await POST(req);

    expect(response.status).toBe(401);
  });

  it("marks the user as onboarded", async () => {
    const response = await POST(req);

    expect(clerkClient().users.updateUserMetadata).toHaveBeenCalledWith("123", {
      publicMetadata: expect.objectContaining({
        owa: {
          isTeacher: true,
          isOnboarded: true,
        },
      }),
    });
    expect(response.status).toBe(200);

    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        owa: {
          isTeacher: true,
          isOnboarded: true,
        },
      }),
    );
  });

  it("sets the referer header as sourceApp", async () => {
    await POST(req);

    expect(clerkClient().users.updateUserMetadata).toHaveBeenCalledWith("123", {
      publicMetadata: expect.objectContaining({
        sourceApp: "http://example.com",
      }),
    });
  });
  it("sets the x-country header as region", async () => {
    await POST(req);

    expect(clerkClient().users.updateUserMetadata).toHaveBeenCalledWith("123", {
      publicMetadata: expect.objectContaining({
        region: "US",
      }),
    });
  });
  it("400 status when no region in headers", async () => {
    const response = await POST(
      new Request("http://example.com", {
        method: "POST",
        body: JSON.stringify({ isTeacher: true }),
        headers: {
          referer: "http://example.com/foo",
        },
      }),
    );

    expect(response.status).toBe(400);
  });
  it("400 status when no x-country header or development user region", async () => {
    process.env.DEVELOPMENT_USER_REGION = undefined;
    const response = await POST(
      new Request("http://example.com", {
        method: "POST",
        body: JSON.stringify({ isTeacher: true }),
        headers: {
          referer: "http://example.com/foo",
        },
      }),
    );

    expect(response.status).toBe(400);
    const responseBody = await response.text(); // or response.json() if the error message is JSON
    expect(responseBody).toMatch(
      "getBrowserConfig('developmentUserRegion') failed because there is no env value DEVELOPMENT_USER_REGION",
    );
  });

  it("does not change sourceApp when the user already has one", async () => {
    user = Object.assign({}, mockCurrentUser, {
      publicMetadata: {
        sourceApp: "http://remember-me.com",
      },
    });

    await POST(req);

    expect(clerkClient().users.updateUserMetadata).toHaveBeenCalledWith(
      expect.anything(),
      {
        publicMetadata: expect.objectContaining({
          sourceApp: "http://remember-me.com",
        }),
      },
    );
  });

  it("handles validation errors", async () => {
    const response = await POST(
      new Request("http://example.com", {
        method: "POST",
        body: JSON.stringify({}),
      }),
    );

    expect(response.status).toBe(400);
  });
});
