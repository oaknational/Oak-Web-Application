import { isFeatureFlagEnabledStatic } from "../static";

describe("isFeatureFlagEnabledStatic", () => {
  test("returns true when constant is 'true'", () => {
    process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_EXAMPLE_FEATURE = "true";
    expect(isFeatureFlagEnabledStatic("example-feature")).toBe(true);
  });

  test("returns false when constant is not 'true'", () => {
    process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_EXAMPLE_FEATURE = "false";
    expect(isFeatureFlagEnabledStatic("example-feature")).toBe(false);
  });
});
