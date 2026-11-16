/**
 * @jest-environment node
 */
import { getServerAuthState } from "./getServerAuthState";

import {
  signedOutAuthState,
  signedInGeoAuthenticatedAuthState,
} from "@/__tests__/__helpers__/mockCopyrightRequirements";

jest.mock("@clerk/nextjs/server", () => ({
  __esModule: true,
  auth: jest.fn(),
}));

type MockAuthResult = {
  isAuthenticated: boolean;
  sessionClaims: unknown;
};

const authMock = jest.requireMock("@clerk/nextjs/server").auth as jest.Mock<
  Promise<MockAuthResult>,
  []
>;

const unrestricted = {
  subjectSlug: "maths" as const,
  loginRequired: false,
  geoRestricted: false,
};

describe("getServerAuthState", () => {
  beforeEach(() => {
    authMock.mockReset();
  });

  it("does not look up auth for unrestricted content", async () => {
    expect(await getServerAuthState(unrestricted)).toEqual(signedOutAuthState);
    expect(authMock).not.toHaveBeenCalled();
  });

  it.each([
    ["login required", { ...unrestricted, loginRequired: true }],
    ["geo restricted", { ...unrestricted, geoRestricted: true }],
    [
      "a restricted subject",
      { ...unrestricted, subjectSlug: "music" as const },
    ],
  ])("resolves the signed-in user for %s content", async (_, restriction) => {
    authMock.mockResolvedValue({
      isAuthenticated: true,
      sessionClaims: {
        owa: { isOnboarded: true, isRegionAuthorised: true },
      },
    });

    expect(await getServerAuthState(restriction)).toEqual(
      signedInGeoAuthenticatedAuthState,
    );
    expect(authMock).toHaveBeenCalledTimes(1);
  });
});
