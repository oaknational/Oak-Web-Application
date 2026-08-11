import { isFeatureFlagEnabledServer } from "../server";

import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
jest.mock("@/node-lib/posthog/getFeatureFlag");
jest.mock("@/node-lib/posthog/getPosthogId");

async function expectFeatureFlagResult({
  posthogEnabled,
  forceFlag,
}: {
  posthogEnabled: boolean;
  forceFlag: "true" | "false";
}) {
  process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_OAKS_IMPACT = forceFlag;
  (getPosthogIdFromCookie as jest.Mock).mockReturnValue("1111");
  (getFeatureFlag as jest.Mock).mockResolvedValue(posthogEnabled);
}

describe("isFeatureFlagEnabledServer", () => {
  describe("when posthog feature flag is enabled for the user", () => {
    test("returns true when the constant is 'true'", async () => {
      expectFeatureFlagResult({
        posthogEnabled: true,
        forceFlag: "true",
      });

      const result = await isFeatureFlagEnabledServer({}, "oaks-impact");

      expect(result).toBe(true);
    });

    test("returns true when the constant is 'false'", async () => {
      expectFeatureFlagResult({
        posthogEnabled: true,
        forceFlag: "false",
      });

      const result = await isFeatureFlagEnabledServer({}, "oaks-impact");

      expect(result).toBe(true);
    });
  });

  describe("when posthog feature flag is not enabled for the user", () => {
    test("returns true when the constant is 'true'", async () => {
      expectFeatureFlagResult({
        posthogEnabled: false,
        forceFlag: "true",
      });

      const result = await isFeatureFlagEnabledServer({}, "oaks-impact");

      expect(result).toBe(true);
    });

    test("returns false when the constant is 'false'", async () => {
      expectFeatureFlagResult({
        posthogEnabled: false,
        forceFlag: "false",
      });

      const result = await isFeatureFlagEnabledServer({}, "oaks-impact");

      expect(result).toBe(false);
    });
  });
});
