import { LEGACY_SLUG_SUFFIX } from "./isSlugLegacy";
import removeLegacySlugSuffix from "./removeLegacySlugSuffix";

describe("removeLegacySlugSuffix", () => {
  it("returns slug unmodified if it doesn't have suffix", () => {
    expect(removeLegacySlugSuffix("chemistry-secondary-ks4")).toEqual(
      "chemistry-secondary-ks4",
    );
  });
  it(`returns slug without ${LEGACY_SLUG_SUFFIX} if it has suffix`, () => {
    expect(
      removeLegacySlugSuffix(`chemistry-secondary-ks4${LEGACY_SLUG_SUFFIX}`),
    ).toEqual("chemistry-secondary-ks4");
  });
});
