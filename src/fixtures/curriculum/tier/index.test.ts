import { createTier } from "./index";

describe("createTier", () => {
  it("default tier", () => {
    const result = createTier();
    expect(result).toEqual({
      tier_slug: "blank",
      tier: "Blank",
    });
  });

  it("pass slug", () => {
    const result = createTier({ tier_slug: "test" });
    expect(result).toEqual({
      tier_slug: "test",
      tier: "Test",
    });
  });

  it("pass title", () => {
    const result = createTier({ tier: "Test" });
    expect(result).toEqual({
      tier_slug: "blank",
      tier: "Test",
    });
  });
});
