import type { GetServerSidePropsContext } from "next";

import { isFeatureFlagEnabledServer } from "../server";

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

describe("isFeatureFlagEnabledServer", () => {
  test("returns true when posthog feature flag is enabled for the user and constant is 'true'", async () => {
    process.env.FORCE_FEATURE_FLAG_OAKS_IMPACT = "true";
    (getPosthogIdFromCookie as jest.Mock).mockReturnValue("1111");
    (getFeatureFlag as jest.Mock).mockResolvedValue(true);

    const mockContext = {
      req: {
        cookies: {
          getAll: () => getAllCookiesMock(),
        },
      },
    } as unknown as GetServerSidePropsContext;

    const result = await isFeatureFlagEnabledServer(mockContext, "oaks-impact");
    expect(result).toBe(true);
  });

  test("returns true when posthog feature flag is enabled for the user but constant is 'false'", async () => {
    process.env.FORCE_FEATURE_FLAG_OAKS_IMPACT = "false";
    (getPosthogIdFromCookie as jest.Mock).mockReturnValue("1111");
    (getFeatureFlag as jest.Mock).mockResolvedValue(true);

    const mockContext = {
      req: {
        cookies: {
          getAll: () => getAllCookiesMock(),
        },
      },
    } as unknown as GetServerSidePropsContext;

    const result = await isFeatureFlagEnabledServer(mockContext, "oaks-impact");
    expect(result).toBe(true);
  });

  test("returns true when posthog feature flag is not enabled for the user but constant is 'true'", async () => {
    process.env.FORCE_FEATURE_FLAG_OAKS_IMPACT = "true";
    (getPosthogIdFromCookie as jest.Mock).mockReturnValue("1111");
    (getFeatureFlag as jest.Mock).mockResolvedValue(false);

    const mockContext = {
      req: {
        cookies: {
          getAll: () => getAllCookiesMock(),
        },
      },
    } as unknown as GetServerSidePropsContext;

    const result = await isFeatureFlagEnabledServer(mockContext, "oaks-impact");
    expect(result).toBe(true);
  });

  test("returns false when posthog feature flag is not enabled for the user and constant is 'false'", async () => {
    process.env.FORCE_FEATURE_FLAG_OAKS_IMPACT = "false";
    (getPosthogIdFromCookie as jest.Mock).mockReturnValue("1111");
    (getFeatureFlag as jest.Mock).mockResolvedValue(false);

    const mockContext = {
      req: {
        cookies: {
          getAll: () => getAllCookiesMock(),
        },
      },
    } as unknown as GetServerSidePropsContext;

    const result = await isFeatureFlagEnabledServer(mockContext, "oaks-impact");
    expect(result).toBe(false);
  });
});
