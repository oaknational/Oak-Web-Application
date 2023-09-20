import isSlugLegacy, { LEGACY_PROGRAMME_SUFFIX } from "./isSlugLegacy";

describe("isSlugLegacy", () => {
  it(`returns true if slug has ${LEGACY_PROGRAMME_SUFFIX} suffix`, () => {
    expect(
      isSlugLegacy(`chemistry-secondary-ks4${LEGACY_PROGRAMME_SUFFIX}`),
    ).toBe(true);
  });
  it(`returns false if slug does not have ${LEGACY_PROGRAMME_SUFFIX} suffix`, () => {
    expect(isSlugLegacy("chemistry-secondary-ks4")).toBe(false);
  });
});
