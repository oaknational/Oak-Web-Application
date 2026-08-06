import {
  isFeatureFlagEnabled,
  isFeatureFlagEnabledAtBuild,
} from "./featureFlagServer";

import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
jest.mock("@/node-lib/posthog/getFeatureFlag");
jest.mock("@/node-lib/posthog/getPosthogId");

jest.mock("./featureFlags", () => ({
  process: {
    env: {
      get FORCE_FEATURE_FLAG_OAKS_IMPACT() {
        return "false";
      },
    },
  },
}));

describe("isFeatureFlagEnabled", () => {
  test("returns true when feature flag is enabled for the user", async () => {
    (getPosthogIdFromCookie as jest.Mock).mockReturnValue("1111");
    (getFeatureFlag as jest.Mock).mockResolvedValue(true);

    const result = await isFeatureFlagEnabled({}, "oaks-impact");
    expect(result).toBe(true);
  });

  test("returns false when feature flag is not enabled for the user", async () => {
    (getPosthogIdFromCookie as jest.Mock).mockReturnValue("1111");
    (getFeatureFlag as jest.Mock).mockResolvedValue(false);

    const result = await isFeatureFlagEnabled({}, "oaks-impact");
    expect(result).toBe(false);
  });
});

describe("isFeatureFlagEnabledAtBuild", () => {
  test("returns true when constant is 'true'", () => {
    process.env.FORCE_FEATURE_FLAG_OAKS_IMPACT = "true";
    const result = isFeatureFlagEnabledAtBuild("oaks-impact");
    expect(result).toBe(true);
  });

  test("returns false when constant is not 'true'", () => {
    process.env.FORCE_FEATURE_FLAG_OAKS_IMPACT = "false";
    const result = isFeatureFlagEnabledAtBuild("oaks-impact");
    expect(result).toBe(false);
  });
});
