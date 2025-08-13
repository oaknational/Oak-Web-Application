/**
 * @jest-environment node
 */
import { POST } from "./route";

import OakError from "@/errors/OakError";
import {
  installMockClerkClient,
  mockServerUser,
  setCurrentUser,
} from "@/__tests__/__helpers__/mockClerkServer";

const reportError = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

jest.mock("@clerk/nextjs/server");

// @ts-expect-error - region is overwritten in development
process.env.NODE_ENV = "production";

const updateUserMetadata = jest.fn();
const getUser = jest.fn();

describe("/api/onboarding", () => {
  installMockClerkClient({
    updateUserMetadata,
    getUser,
    mockUser: mockServerUser,
  });

  let req: Request;
  beforeEach(() => {
    req = new Request("http://example.com", {
      method: "POST",
      headers: {
        referer: "http://example.com/foo",
        "x-vercel-ip-country": "US",
      },
    });

    // jest.spyOn(mockClerkClient.users, "updateUserMetadata").mockReset();
    setCurrentUser(mockServerUser);
  });

  it("requires authentication", async () => {
    setCurrentUser(null);
    const response = await POST(req);

    expect(response.status).toBe(401);
  });

  it("updates isRegionAuthorised to correct region and requiresGeoLocation to false", async () => {
    const response = await POST(req);

    expect(updateUserMetadata).toHaveBeenCalledWith("123", {
      publicMetadata: {
        owa: {
          isRegionAuthorised: false,
        },
      },
      privateMetadata: {
        region: "US",
      },
      unsafeMetadata: {
        requiresGeoLocation: false,
      },
    });

    expect(response.status).toBe(200);

    await expect(response.json()).resolves.toEqual({
      publicMetadata: { owa: { isRegionAuthorised: false } },
      privateMetadata: { region: "US" },
      unsafeMetadata: { requiresGeoLocation: false },
    });
  });

  it("sets the x-vercel-ip-country header as region", async () => {
    await POST(req);

    expect(updateUserMetadata).toHaveBeenCalledWith(
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
          "x-vercel-ip-country": countryCode!,
        },
      });
      await POST(req);

      expect(updateUserMetadata).toHaveBeenCalledWith(
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

  it("reports error when user has no region from x-vercel-ip-country in header ", async () => {
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
            "Region header not found in header: x-vercel-ip-country or developmentUserRegion",
          user: "123",
        },
      }),
      {
        message: "Region header not found",
      },
    );
  });
});
