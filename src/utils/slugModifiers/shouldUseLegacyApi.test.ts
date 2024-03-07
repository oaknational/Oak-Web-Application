import shouldUseLegacyApi from "./shouldUseLegacyApi";

describe("shouldUseLegacyApi", () => {
  it(`returns true if slug has suffix and is not a EYFS`, () => {
    expect(shouldUseLegacyApi(`chemistry-secondary-ks4-l`)).toBe(true);
  });
  it(`returns false if slug does not have suffix`, () => {
    expect(shouldUseLegacyApi("chemistry-secondary-ks4")).toBe(false);
  });
  it(`returns false if slug is eyfs and has -l suffix`, () => {
    expect(
      shouldUseLegacyApi(
        `personal-social-and-emotional-development-foundation-early-years-foundation-stage-l`,
      ),
    ).toBe(false);
  });
});
