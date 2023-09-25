import isSlugLegacy, { LEGACY_SLUG_SUFFIX } from "./isSlugLegacy";

describe("isSlugLegacy", () => {
  it(`returns true if slug has ${LEGACY_SLUG_SUFFIX} suffix`, () => {
    expect(isSlugLegacy(`chemistry-secondary-ks4${LEGACY_SLUG_SUFFIX}`)).toBe(
      true,
    );
  });
  it(`returns false if slug does not have ${LEGACY_SLUG_SUFFIX} suffix`, () => {
    expect(isSlugLegacy("chemistry-secondary-ks4")).toBe(false);
  });
});
