import type { GetServerSidePropsContext } from "next";

import { isFeatureFlagEnabled } from "./featureFlagServer";

import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
jest.mock("@/node-lib/posthog/getFeatureFlag");
jest.mock("@/node-lib/posthog/getPosthogId");

const getAllCookiesMock = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    getAll: (...args: []) => getAllCookiesMock(...args),
  })),
}));

describe("isFeatureFlagEnabled", () => {
  test("returns true when constant is 'true'", async () => {
    const result = await isFeatureFlagEnabled(undefined, "test-flag", "true");
    expect(result).toBe(true);
  });

  test("returns false when context is undefined and constant is not 'true'", async () => {
    const result = await isFeatureFlagEnabled(undefined, "test-flag", "false");
    expect(result).toBe(false);
  });

  test("returns true when feature flag is enabled for the user", async () => {
    (getPosthogIdFromCookie as jest.Mock).mockReturnValue("1111");
    (getFeatureFlag as jest.Mock).mockResolvedValue(true);

    const mockContext = {
      req: {
        cookies: {
          getAll: () => getAllCookiesMock(),
        },
      },
    } as unknown as GetServerSidePropsContext;

    const result = await isFeatureFlagEnabled(
      mockContext,
      "test-flag",
      "false",
    );
    expect(result).toBe(true);
  });

  test("returns false when feature flag is not enabled for the user", async () => {
    (getPosthogIdFromCookie as jest.Mock).mockReturnValue("1111");
    (getFeatureFlag as jest.Mock).mockResolvedValue(false);

    const mockContext = {
      req: {
        cookies: {
          getAll: () => getAllCookiesMock(),
        },
      },
    } as unknown as GetServerSidePropsContext;

    const result = await isFeatureFlagEnabled(
      mockContext,
      "test-flag",
      "false",
    );
    expect(result).toBe(false);
  });
});
