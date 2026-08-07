import { isFeatureFlagEnabledStatic } from "../static";

describe("isFeatureFlagEnabledStatic", () => {
  test("returns true when constant is 'true'", () => {
    process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_OAKS_IMPACT = "true";
    const result = isFeatureFlagEnabledStatic("oaks-impact");
    expect(result).toBe(true);
  });

  test("returns false when constant is not 'true'", () => {
    process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_OAKS_IMPACT = "false";
    const result = isFeatureFlagEnabledStatic("oaks-impact");
    expect(result).toBe(false);
  });
});
