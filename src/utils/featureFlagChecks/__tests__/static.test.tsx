import { isFeatureFlagEnabledStatic } from "../static";

describe("isFeatureFlagEnabledStatic", () => {
  test("returns true when constant is 'true'", () => {
    process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_OAKS_IMPACT = "true";
    expect(isFeatureFlagEnabledStatic("oaks-impact")).toBe(true);
    process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_IMPLEMENTATION_GUIDES = "true";
    expect(isFeatureFlagEnabledStatic("implementation-guides")).toBe(true);
  });

  test("returns false when constant is not 'true'", () => {
    process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_OAKS_IMPACT = "false";
    expect(isFeatureFlagEnabledStatic("oaks-impact")).toBe(false);
    process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_IMPLEMENTATION_GUIDES = "false";
    expect(isFeatureFlagEnabledStatic("implementation-guides")).toBe(false);
  });
});
