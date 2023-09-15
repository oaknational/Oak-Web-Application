import isProgrammeSlugLegacy from "./isProgrammeSlugLegacy";

describe("isProgrammeSlugLegacy", () => {
  it("returns true if slug has '-l' suffix", () => {
    expect(isProgrammeSlugLegacy("chemistry-secondary-ks4-l")).toBe(true);
  });
  it("returns false if slug does not have '-l' suffix", () => {
    expect(isProgrammeSlugLegacy("chemistry-secondary-ks4")).toBe(false);
  });
});
