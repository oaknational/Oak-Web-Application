/**
 * @jest-environment node
 */
import { clerkClient, currentUser } from "@clerk/nextjs/server";

import { POST } from "./route";

import { mockCurrentUser } from "@/__tests__/__helpers__/mockUser";
import OakError from "@/errors/OakError";

let user: Awaited<ReturnType<typeof currentUser>>;

const reportError = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

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

// @ts-expect-error - region is overwritten in development
process.env.NODE_ENV = "production";

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

    expect(clerkClient().users.updateUserMetadata).toHaveBeenCalledWith(
      "123",
      expect.objectContaining({
        publicMetadata: expect.objectContaining({
          sourceApp: "http://example.com",
          owa: expect.objectContaining({
            isTeacher: true,
            isOnboarded: true,
          }),
        }),
        privateMetadata: {
          region: "US",
        },
      }),
    );

    expect(response.status).toBe(200);

    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        sourceApp: "http://example.com",
        owa: expect.objectContaining({
          isTeacher: true,
          isOnboarded: true,
        }),
      }),
    );
  });

  it("sets the referer header as sourceApp", async () => {
    await POST(req);

    expect(clerkClient().users.updateUserMetadata).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        publicMetadata: expect.objectContaining({
          sourceApp: "http://example.com",
        }),
      }),
    );
  });
  it("sets the x-country header as region", async () => {
    await POST(req);

    expect(clerkClient().users.updateUserMetadata).toHaveBeenCalledWith(
      "123",
      expect.objectContaining({
        privateMetadata: expect.objectContaining({
          region: "US",
        }),
      }),
    );
  });

  it.each<[string | undefined, boolean]>([
    ["US", false],
    ["GB", true],
    [undefined, false],
  ])(
    `for %p it sets isRegionAuthorised to %p`,
    async (countryCode, isRegionAuthorised) => {
      const req = new Request("http://example.com", {
        method: "POST",
        body: JSON.stringify({ isTeacher: true }),
        headers: {
          referer: "http://example.com/foo",
          "x-country": countryCode!,
        },
      });
      await POST(req);

      expect(clerkClient().users.updateUserMetadata).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          publicMetadata: expect.objectContaining({
            owa: expect.objectContaining({
              isRegionAuthorised,
            }),
          }),
        }),
      );
    },
  );
  it("sets the x-country header as region", async () => {
    await POST(req);

    expect(clerkClient().users.updateUserMetadata).toHaveBeenCalledWith(
      "123",
      expect.objectContaining({
        privateMetadata: expect.objectContaining({
          region: "US",
        }),
      }),
    );
  });

  it("reports error when user has no region from x-country in header ", async () => {
    await POST(
      new Request("http://example.com", {
        method: "POST",
        body: JSON.stringify({ isTeacher: true }),
        headers: {
          referer: "http://example.com/foo",
        },
      }),
    );

    expect(reportError).toHaveBeenCalledWith(
      new OakError({
        code: "onboarding/request-error",
        meta: {
          message:
            "Region header not found in header: x-country or developmentUserRegion",
          user: "123",
        },
      }),
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
      expect.objectContaining({
        publicMetadata: expect.objectContaining({
          sourceApp: "http://remember-me.com",
        }),
      }),
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
