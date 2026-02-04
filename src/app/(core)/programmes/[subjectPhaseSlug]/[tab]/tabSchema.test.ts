import {
  isTabSlug,
  TAB_SLUGS,
  tabNameToSlug,
  tabSlugToName,
} from "./tabSchema";

describe("tabSchema", () => {
  it("returns a tab name from a given valid slug", () => {
    const result = tabSlugToName["units"];
    expect(result).toEqual("Unit sequence");
  });
  it("returns a tab slug from a valid tab name", () => {
    const result = tabNameToSlug["Explainer"];
    expect(result).toEqual("overview");
  });
  it.each(TAB_SLUGS)(
    "returns correctly for isTabSlug when it is a tab slug",
    (tab) => {
      const result = isTabSlug(tab);
      expect(result).toBe(true);
    },
  );
  it("returns correctly for isTabSlug when it is not a tab slug", () => {
    const result = isTabSlug("invalid");
    expect(result).toBe(false);
  });
});
