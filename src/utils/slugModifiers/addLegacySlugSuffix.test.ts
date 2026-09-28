import addLegacySlugSuffix from "./addLegacySlugSuffix";

describe("addLegacySlugSuffix", () => {
  it("returns slug with '-l' suffix", () => {
    expect(addLegacySlugSuffix("chemistry-secondary-ks4")).toEqual(
      "chemistry-secondary-ks4-l",
    );
  });
  it("returns undefined if no slug is passed in", () => {
    expect(addLegacySlugSuffix()).toBeUndefined();
  });
  it("returns undefined if null is passed in", () => {
    expect(addLegacySlugSuffix(null)).toBeUndefined();
  });
  it("returns slug unmodified if it is already legacy slug", () => {
    expect(addLegacySlugSuffix("chemistry-secondary-ks4-l")).toEqual(
      "chemistry-secondary-ks4-l",
    );
  });
});
