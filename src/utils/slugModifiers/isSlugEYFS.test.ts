import isSlugEYFS from "./isSlugEYFS";

describe("isSlugEYFS", () => {
  it(`returns true if slug is eyfs and has -l suffix`, () => {
    expect(
      isSlugEYFS(
        `personal-social-and-emotional-development-foundation-early-years-foundation-stage-l`,
      ),
    ).toBe(true);
  });
  it(`returns false if slug does not have -l suffix`, () => {
    expect(isSlugEYFS("chemistry-secondary-ks4")).toBe(false);
  });
});
